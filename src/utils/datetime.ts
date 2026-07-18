/**
 * @file 时间戳转换工具
 * @description 提供时间戳与日期格式之间的相互转换
 * @author IT Tools
 */

export type TimestampUnit = 's' | 'ms'

/**
 * 时间戳转日期字符串
 * @param timestamp - 时间戳
 * @param unit - 时间戳单位（秒/毫秒）
 * @param format - 输出格式
 * @returns 格式化的日期字符串
 */
export function timestampToDate(timestamp: string | number, unit: TimestampUnit = 'ms', format: string = 'YYYY-MM-DD HH:mm:ss'): string {
  const ts = Number(timestamp)
  if (isNaN(ts)) return ''
  
  const date = new Date(unit === 's' ? ts * 1000 : ts)
  if (isNaN(date.getTime())) return ''
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const milliseconds = String(date.getMilliseconds()).padStart(3, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
    .replace('SSS', milliseconds)
}

/**
 * 日期字符串转时间戳
 * @param dateStr - 日期字符串
 * @param unit - 输出单位（秒/毫秒）
 * @returns 时间戳
 */
export function dateToTimestamp(dateStr: string, unit: TimestampUnit = 'ms'): number {
  if (!dateStr) return 0
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return 0
  const ts = date.getTime()
  return unit === 's' ? Math.floor(ts / 1000) : ts
}

/**
 * 获取当前时间戳
 * @param unit - 时间戳单位
 * @returns 当前时间戳
 */
export function getCurrentTimestamp(unit: TimestampUnit = 'ms'): number {
  const now = Date.now()
  return unit === 's' ? Math.floor(now / 1000) : now
}

/**
 * 常用日期格式
 */
export const dateFormats = [
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'YYYY/MM/DD', value: 'YYYY/MM/DD' },
  { label: 'MM-DD-YYYY HH:mm:ss', value: 'MM-DD-YYYY HH:mm:ss' },
  { label: 'YYYY年MM月DD日 HH:mm:ss', value: 'YYYY年MM月DD日 HH:mm:ss' },
  { label: 'YYYY年MM月DD日', value: 'YYYY年MM月DD日' },
]
