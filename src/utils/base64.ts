/**
 * @file Base64编解码工具
 * @description 提供Base64编码、解码功能，支持中英文
 * @author IT Tools
 */

/**
 * Base64编码
 * @param str - 要编码的字符串
 * @returns Base64编码后的字符串
 */
export function encodeBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str)
    let binary = ''
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  } catch {
    return ''
  }
}

/**
 * Base64解码
 * @param str - 要解码的Base64字符串
 * @returns 解码后的字符串，解码失败返回空字符串
 */
export function decodeBase64(str: string): string {
  try {
    const binary = atob(str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch {
    return ''
  }
}

/**
 * 检查字符串是否为有效的Base64格式
 * @param str - 要检查的字符串
 * @returns 是否为有效Base64
 */
export function isValidBase64(str: string): boolean {
  if (!str) return false
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  return base64Regex.test(str)
}
