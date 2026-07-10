/**
 * @file URL编解码工具
 * @description 提供URL编码、解码、完整URL编解码和URL校验功能
 * @author IT Tools
 */

/**
 * URL编码
 * @description 对字符串进行URL编码，转义特殊字符
 * 使用 encodeURIComponent 编码，会对所有特殊字符进行转义
 * @param str - 需要编码的字符串
 * @returns 编码后的字符串，编码失败时返回原字符串
 * @example
 * encodeUrl('hello world') // 返回 'hello%20world'
 * encodeUrl('name=张三&age=20') // 返回 'name%3D%E5%BC%A0%E4%B8%89%26age%3D20'
 */
export function encodeUrl(str: string): string {
  try {
    return encodeURIComponent(str)
  } catch {
    return str
  }
}

/**
 * URL解码
 * @description 对已编码的URL字符串进行解码
 * 使用 decodeURIComponent 解码，可解码所有编码字符
 * @param str - 需要解码的字符串
 * @returns 解码后的字符串，解码失败时返回原字符串
 * @example
 * decodeUrl('hello%20world') // 返回 'hello world'
 * decodeUrl('name%3D%E5%BC%A0%E4%B8%89') // 返回 'name=张三'
 */
export function decodeUrl(str: string): string {
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

/**
 * 完整URL编码
 * @description 对完整URL进行编码，保留URL结构字符（如 ://, ?, &, = 等）
 * 使用 encodeURI 编码，不会转义URL特殊字符
 * @param str - 需要编码的完整URL字符串
 * @returns 编码后的URL字符串，编码失败时返回原字符串
 * @example
 * encodeUrlFull('https://example.com/path?name=张三')
 * // 返回 'https://example.com/path?name=%E5%BC%A0%E4%B8%89'
 */
export function encodeUrlFull(str: string): string {
  try {
    return encodeURI(str)
  } catch {
    return str
  }
}

/**
 * 完整URL解码
 * @description 对已编码的完整URL进行解码
 * 使用 decodeURI 解码，可解码 encodeURI 编码的内容
 * @param str - 需要解码的完整URL字符串
 * @returns 解码后的URL字符串，解码失败时返回原字符串
 * @example
 * decodeUrlFull('https://example.com/path?name=%E5%BC%A0%E4%B8%89')
 * // 返回 'https://example.com/path?name=张三'
 */
export function decodeUrlFull(str: string): string {
  try {
    return decodeURI(str)
  } catch {
    return str
  }
}

/**
 * 校验字符串是否为有效的URL
 * @description 使用 URL 构造函数校验字符串是否为合法的URL格式
 * 需要包含协议（如 http://, https://）
 * @param str - 需要校验的字符串
 * @returns 如果是有效的URL返回true，否则返回false
 * @example
 * isValidUrl('https://example.com') // 返回 true
 * isValidUrl('example.com') // 返回 false（缺少协议）
 * isValidUrl('invalid url') // 返回 false
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}