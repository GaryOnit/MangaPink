/**
 * 格式化时间戳为相对时间
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diff < minute) return '刚刚';
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)}小时前`;
  if (diff < week) return `${Math.floor(diff / day)}天前`;
  return new Date(timestamp).toLocaleDateString('zh-CN');
}

/**
 * 格式化阅读进度为百分比字符串
 */
export function formatReadingProgress(pageIndex: number, totalPages: number): string {
  if (totalPages === 0) return '0%';
  const percent = Math.round(((pageIndex + 1) / totalPages) * 100);
  return `${percent}%`;
}

/**
 * 格式化页码显示
 */
export function formatPageInfo(pageIndex: number, totalPages: number): string {
  return `${pageIndex + 1} / ${totalPages}`;
}
