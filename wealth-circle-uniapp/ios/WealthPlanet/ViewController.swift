import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
    private var webView: WKWebView!
    private var webServer: LocalWebServer?
    private let refreshControl = UIRefreshControl()
    private let activityIndicator = UIActivityIndicatorView(style: .large)
    private var localPort: UInt16 = 0

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 7/255, green: 21/255, blue: 43/255, alpha: 1.0)
        setupWebView()
        setupLoadingIndicator()
        startLocalServerAndLoad()
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }

    private func setupWebView() {
        let config = WKWebViewConfiguration()

        // Enable inline media playback & javascript
        config.allowsInlineMediaPlayback = true
        config.defaultWebpagePreferences.allowsContentJavaScript = true

        // Inject Console Bridge to print JS errors in Xcode console
        let consoleBridgeScript = """
        (function() {
            var oldLog = console.log;
            var oldWarn = console.warn;
            var oldError = console.error;
            console.log = function() {
                try { window.webkit.messageHandlers.logHandler.postMessage({level: 'LOG', msg: Array.from(arguments).map(String).join(' ')}); } catch(e){}
                oldLog.apply(console, arguments);
            };
            console.warn = function() {
                try { window.webkit.messageHandlers.logHandler.postMessage({level: 'WARN', msg: Array.from(arguments).map(String).join(' ')}); } catch(e){}
                oldWarn.apply(console, arguments);
            };
            console.error = function() {
                try { window.webkit.messageHandlers.logHandler.postMessage({level: 'ERROR', msg: Array.from(arguments).map(String).join(' ')}); } catch(e){}
                oldError.apply(console, arguments);
            };
            window.onerror = function(msg, url, line, col, error) {
                try { window.webkit.messageHandlers.logHandler.postMessage({level: 'UNCAUGHT', msg: msg + ' at ' + url + ':' + line + ':' + col}); } catch(e){}
            };
        })();
        """
        let userScript = WKUserScript(source: consoleBridgeScript, injectionTime: .atDocumentStart, forMainFrameOnly: false)
        config.userContentController.addUserScript(userScript)
        config.userContentController.add(self, name: "logHandler")

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear

        // Support Safari Web Inspector for live debugging
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }

        // Safe area adaptation
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.allowsBackForwardNavigationGestures = true

        // Pull to refresh support
        refreshControl.tintColor = UIColor(red: 16/255, green: 185/255, blue: 129/255, alpha: 1.0)
        refreshControl.addTarget(self, action: #selector(handleRefresh), for: .valueChanged)
        webView.scrollView.refreshControl = refreshControl

        view.addSubview(webView)
    }

    private func setupLoadingIndicator() {
        activityIndicator.color = UIColor(red: 16/255, green: 185/255, blue: 129/255, alpha: 1.0)
        activityIndicator.hidesWhenStopped = true
        activityIndicator.center = view.center
        activityIndicator.autoresizingMask = [.flexibleTopMargin, .flexibleBottomMargin, .flexibleLeftMargin, .flexibleRightMargin]
        view.addSubview(activityIndicator)
        activityIndicator.startAnimating()
    }

    private func startLocalServerAndLoad() {
        guard let wwwPath = Bundle.main.path(forResource: "www", ofType: nil) else {
            showErrorAlert(message: "无法在 App 安装包内找到 www 资源目录")
            return
        }

        let wwwURL = URL(fileURLWithPath: wwwPath)
        let server = LocalWebServer(wwwDirectory: wwwURL)
        self.webServer = server

        server.start { [weak self] result in
            DispatchQueue.main.async {
                guard let self = self else { return }
                switch result {
                case .success(let port):
                    self.localPort = port
                    let appURLString = "http://127.0.0.1:\(port)/index.html"
                    if let appURL = URL(string: appURLString) {
                        print("📱 [App] Loading local web view: \(appURLString)")
                        var request = URLRequest(url: appURL)
                        request.cachePolicy = .reloadIgnoringLocalCacheData
                        self.webView.load(request)
                    }
                case .failure(let error):
                    self.activityIndicator.stopAnimating()
                    self.showErrorAlert(message: "启动本地静态服务器失败: \(error.localizedDescription)")
                }
            }
        }
    }

    private func showErrorAlert(message: String) {
        let alert = UIAlertController(title: "加载失败", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "重试", style: .default, handler: { [weak self] _ in
            self?.activityIndicator.startAnimating()
            self?.startLocalServerAndLoad()
        }))
        present(alert, animated: true)
    }

    @objc private func handleRefresh() {
        webView.reload()
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
        refreshControl.endRefreshing()
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        refreshControl.endRefreshing()
        print("❌ [WebView] Navigation error: \(error)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        refreshControl.endRefreshing()
        print("❌ [WebView] Provisional navigation error: \(error)")
    }

    // MARK: - WKScriptMessageHandler
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let dict = message.body as? [String: Any],
           let level = dict["level"] as? String,
           let msg = dict["msg"] as? String {
            print("📱 [Web \(level)] \(msg)")
        }
    }

    deinit {
        webServer?.stop()
    }
}
