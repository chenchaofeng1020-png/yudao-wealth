// 常见文档类型徽标：根据文件扩展名返回展示文案与主题色
// PDF 红 / DOC 蓝 / XLS 绿 / PPT 橙 / TXT、MD 灰紫，未知类型灰色 FILE
const BADGE_MAP: Record<string, { label: string; color: string }> = {
  PDF: { label: 'PDF', color: '#e2574c' },
  DOC: { label: 'DOC', color: '#2f6fe4' },
  DOCX: { label: 'DOC', color: '#2f6fe4' },
  XLS: { label: 'XLS', color: '#1f9d55' },
  XLSX: { label: 'XLS', color: '#1f9d55' },
  CSV: { label: 'CSV', color: '#1f9d55' },
  PPT: { label: 'PPT', color: '#f0731f' },
  PPTX: { label: 'PPT', color: '#f0731f' },
  TXT: { label: 'TXT', color: '#64748b' },
  MD: { label: 'MD', color: '#8b5cf6' },
};

export const fileTypeBadge = (name: string): { label: string; color: string } => {
  const ext = (name.split('.').pop() || '').toUpperCase();
  return BADGE_MAP[ext] || { label: 'FILE', color: '#64748b' };
};
