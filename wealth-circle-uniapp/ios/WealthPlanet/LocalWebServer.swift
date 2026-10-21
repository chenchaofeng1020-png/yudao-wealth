import Foundation
import Network

class LocalWebServer {
    private var listener: NWListener?
    private let wwwDirectory: URL
    private(set) var port: UInt16 = 0

    init(wwwDirectory: URL) {
        self.wwwDirectory = wwwDirectory
    }

    func start(completion: @escaping (Result<UInt16, Error>) -> Void) {
        do {
            let parameters = NWParameters.tcp
            let listener = try NWListener(using: parameters, on: .any)
            self.listener = listener

            listener.stateUpdateHandler = { [weak self] state in
                guard let self = self else { return }
                switch state {
                case .ready:
                    if let port = listener.port?.rawValue {
                        self.port = port
                        print("🚀 [LocalWebServer] Running at http://127.0.0.1:\(port)")
                        completion(.success(port))
                    }
                case .failed(let error):
                    print("❌ [LocalWebServer] Failed: \(error)")
                    completion(.failure(error))
                default:
                    break
                }
            }

            listener.newConnectionHandler = { [weak self] connection in
                self?.handleConnection(connection)
            }

            listener.start(queue: DispatchQueue.global(qos: .userInitiated))
        } catch {
            completion(.failure(error))
        }
    }

    func stop() {
        listener?.cancel()
        listener = nil
    }

    private func handleConnection(_ connection: NWConnection) {
        connection.start(queue: DispatchQueue.global(qos: .userInitiated))
        receiveRequest(connection: connection)
    }

    private func receiveRequest(connection: NWConnection) {
        connection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { [weak self] content, _, isComplete, error in
            guard let self = self else { return }
            if let content = content, let requestString = String(data: content, encoding: .utf8) {
                self.processRequest(requestString: requestString, connection: connection)
            } else if error != nil || isComplete {
                connection.cancel()
            }
        }
    }

    private func processRequest(requestString: String, connection: NWConnection) {
        let lines = requestString.components(separatedBy: "\r\n")
        guard let firstLine = lines.first else {
            connection.cancel()
            return
        }

        let parts = firstLine.components(separatedBy: " ")
        guard parts.count >= 2 else {
            connection.cancel()
            return
        }

        let rawPath = parts[1]
        let cleanPath = rawPath.components(separatedBy: "?").first?.components(separatedBy: "#").first ?? "/"
        let decodedPath = cleanPath.removingPercentEncoding ?? cleanPath

        var relativePath = decodedPath.hasPrefix("/") ? String(decodedPath.dropFirst()) : decodedPath
        if relativePath.isEmpty {
            relativePath = "index.html"
        }

        var fileURL = wwwDirectory.appendingPathComponent(relativePath)
        var isDir: ObjCBool = false
        if FileManager.default.fileExists(atPath: fileURL.path, isDirectory: &isDir) {
            if isDir.boolValue {
                fileURL = fileURL.appendingPathComponent("index.html")
            }
        } else {
            // If requested path does not have an extension, route to index.html (SPA routing)
            if fileURL.pathExtension.isEmpty {
                fileURL = wwwDirectory.appendingPathComponent("index.html")
            }
        }

        if let data = try? Data(contentsOf: fileURL) {
            let mimeType = mimeTypeFor(pathExtension: fileURL.pathExtension)
            let header = """
            HTTP/1.1 200 OK\r
            Content-Type: \(mimeType)\r
            Content-Length: \(data.count)\r
            Access-Control-Allow-Origin: *\r
            Connection: close\r
            \r\n
            """
            var responseData = header.data(using: .utf8) ?? Data()
            responseData.append(data)

            connection.send(content: responseData, completion: .contentProcessed({ _ in
                connection.cancel()
            }))
        } else {
            let notFound = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n"
            connection.send(content: notFound.data(using: .utf8), completion: .contentProcessed({ _ in
                connection.cancel()
            }))
        }
    }

    private func mimeTypeFor(pathExtension: String) -> String {
        switch pathExtension.lowercased() {
        case "html", "htm": return "text/html; charset=utf-8"
        case "js", "mjs": return "application/javascript; charset=utf-8"
        case "css": return "text/css; charset=utf-8"
        case "json": return "application/json; charset=utf-8"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "gif": return "image/gif"
        case "svg": return "image/svg+xml"
        case "ico": return "image/x-icon"
        case "woff": return "font/woff"
        case "woff2": return "font/woff2"
        case "ttf": return "font/ttf"
        case "webp": return "image/webp"
        default: return "application/octet-stream"
        }
    }
}
