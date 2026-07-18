/**
 * @file 哈希加密工具
 * @description 提供MD5、SHA1、SHA256、SHA512等哈希加密功能
 * @author IT Tools
 */

/**
 * 支持的哈希算法
 */
export type HashAlgorithm = 'md5' | 'sha1' | 'sha256' | 'sha384' | 'sha512'

/**
 * MD5 哈希算法实现
 * @param str - 要加密的字符串
 * @returns MD5 哈希值（32位小写十六进制）
 */
function md5(str: string): string {
  function rotateLeft(value: number, shift: number): number {
    return (value << shift) | (value >>> (32 - shift))
  }

  function addUnsigned(x: number, y: number): number {
    const x8 = x & 0x80000000
    const y8 = y & 0x80000000
    const x4 = x & 0x40000000
    const y4 = y & 0x40000000
    const result = (x & 0x3fffffff) + (y & 0x3fffffff)
    if (x4 & y4) return result ^ 0x80000000 ^ x8 ^ y8
    if (x4 | y4) {
      if (result & 0x40000000) return result ^ 0xc0000000 ^ x8 ^ y8
      else return result ^ 0x40000000 ^ x8 ^ y8
    }
    return result ^ x8 ^ y8
  }

  function F(x: number, y: number, z: number): number { return (x & y) | ((~x) & z) }
  function G(x: number, y: number, z: number): number { return (x & z) | (y & (~z)) }
  function H(x: number, y: number, z: number): number { return x ^ y ^ z }
  function I(x: number, y: number, z: number): number { return y ^ (x | (~z)) }

  function FF(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function GG(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function HH(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }
  function II(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
    return addUnsigned(rotateLeft(a, s), b)
  }

  function convertToWordArray(str: string): number[] {
    let wordCount = 0
    const wordArray: number[] = []
    const bytePosition = 0
    const byteCount = str.length * 8
    for (let i = 0; i < byteCount; i += 8) {
      const wordArrayPosition = (i / 32) | 0
      const byteOffSet = (i % 32) | 0
      const charCode = str.charCodeAt((i / 8) | 0) & 0xff
      wordArray[wordArrayPosition] = wordArray[wordArrayPosition] | (charCode << byteOffSet)
      wordCount = wordArrayPosition + 1
    }
    const wordArrayPosition = Math.floor(byteCount / 32)
    const byteOffSet = byteCount % 32
    const mask = 0xff << byteOffSet
    wordArray[wordArrayPosition] = (wordArray[wordArrayPosition] & ~mask) | (0x80 << byteOffSet)
    wordCount = wordArrayPosition + 1
    const sizeWord = Math.floor(byteCount / 0x100000000)
    const sizeWord2 = byteCount & 0xffffffff
    wordArray[wordCount + 14] = sizeWord2
    wordArray[wordCount + 15] = sizeWord
    return wordArray
  }

  function wordToHex(value: number): string {
    let hex = ''
    for (let i = 0; i < 4; i++) {
      const byte = (value >>> (i * 8)) & 255
      hex += ('0' + byte.toString(16)).slice(-2)
    }
    return hex
  }

  const x = convertToWordArray(str)
  let a = 0x67452301
  let b = 0xEFCDAB89
  let c = 0x98BADCFE
  let d = 0x10325476

  for (let k = 0; k < x.length; k += 16) {
    const AA = a, BB = b, CC = c, DD = d
    a = FF(a, b, c, d, x[k + 0], 7, 0xD76AA478)
    d = FF(d, a, b, c, x[k + 1], 12, 0xE8C7B756)
    c = FF(c, d, a, b, x[k + 2], 17, 0x242070DB)
    b = FF(b, c, d, a, x[k + 3], 22, 0xC1BDCEEE)
    a = FF(a, b, c, d, x[k + 4], 7, 0xF57C0FAF)
    d = FF(d, a, b, c, x[k + 5], 12, 0x4787C62A)
    c = FF(c, d, a, b, x[k + 6], 17, 0xA8304613)
    b = FF(b, c, d, a, x[k + 7], 22, 0xFD469501)
    a = FF(a, b, c, d, x[k + 8], 7, 0x698098D8)
    d = FF(d, a, b, c, x[k + 9], 12, 0x8B44F7AF)
    c = FF(c, d, a, b, x[k + 10], 17, 0xFFFF5BB1)
    b = FF(b, c, d, a, x[k + 11], 22, 0x895CD7BE)
    a = FF(a, b, c, d, x[k + 12], 7, 0x6B901122)
    d = FF(d, a, b, c, x[k + 13], 12, 0xFD987193)
    c = FF(c, d, a, b, x[k + 14], 17, 0xA679438E)
    b = FF(b, c, d, a, x[k + 15], 22, 0x49B40821)

    a = GG(a, b, c, d, x[k + 1], 5, 0xF61E2562)
    d = GG(d, a, b, c, x[k + 6], 9, 0xC040B340)
    c = GG(c, d, a, b, x[k + 11], 14, 0x265E5A51)
    b = GG(b, c, d, a, x[k + 0], 20, 0xE9B6C7AA)
    a = GG(a, b, c, d, x[k + 5], 5, 0xD62F105D)
    d = GG(d, a, b, c, x[k + 10], 9, 0x02441453)
    c = GG(c, d, a, b, x[k + 15], 14, 0xD8A1E681)
    b = GG(b, c, d, a, x[k + 4], 20, 0xE7D3FBC8)
    a = GG(a, b, c, d, x[k + 9], 5, 0x21E1CDE6)
    d = GG(d, a, b, c, x[k + 14], 9, 0xC33707D6)
    c = GG(c, d, a, b, x[k + 3], 14, 0xF4D50D87)
    b = GG(b, c, d, a, x[k + 8], 20, 0x455A14ED)
    a = GG(a, b, c, d, x[k + 13], 5, 0xA9E3E905)
    d = GG(d, a, b, c, x[k + 2], 9, 0xFCEFA3F8)
    c = GG(c, d, a, b, x[k + 7], 14, 0x676F02D9)
    b = GG(b, c, d, a, x[k + 12], 20, 0x8D2A4C8A)

    a = HH(a, b, c, d, x[k + 5], 4, 0xFFFA3942)
    d = HH(d, a, b, c, x[k + 8], 11, 0x8771F681)
    c = HH(c, d, a, b, x[k + 11], 16, 0x6D9D6122)
    b = HH(b, c, d, a, x[k + 14], 23, 0xFDE5380C)
    a = HH(a, b, c, d, x[k + 1], 4, 0xA4BEEA44)
    d = HH(d, a, b, c, x[k + 4], 11, 0x4BDECFA9)
    c = HH(c, d, a, b, x[k + 7], 16, 0xF6BB4B60)
    b = HH(b, c, d, a, x[k + 10], 23, 0xBEBFBC70)
    a = HH(a, b, c, d, x[k + 13], 4, 0x289B7EC6)
    d = HH(d, a, b, c, x[k + 0], 11, 0xEAA127FA)
    c = HH(c, d, a, b, x[k + 3], 16, 0xD4EF3085)
    b = HH(b, c, d, a, x[k + 6], 23, 0x04881D05)
    a = HH(a, b, c, d, x[k + 9], 4, 0xD9D4D039)
    d = HH(d, a, b, c, x[k + 12], 11, 0xE6DB99E5)
    c = HH(c, d, a, b, x[k + 15], 16, 0x1FA27CF8)
    b = HH(b, c, d, a, x[k + 2], 23, 0xC4AC5665)

    a = II(a, b, c, d, x[k + 0], 6, 0xF4292244)
    d = II(d, a, b, c, x[k + 7], 10, 0x432AFF97)
    c = II(c, d, a, b, x[k + 14], 15, 0xAB9423A7)
    b = II(b, c, d, a, x[k + 5], 21, 0xFC93A039)
    a = II(a, b, c, d, x[k + 12], 6, 0x655B59C3)
    d = II(d, a, b, c, x[k + 3], 10, 0x8F0CCC92)
    c = II(c, d, a, b, x[k + 10], 15, 0xFFEFF47D)
    b = II(b, c, d, a, x[k + 1], 21, 0x85845DD1)
    a = II(a, b, c, d, x[k + 8], 6, 0x6FA87E4F)
    d = II(d, a, b, c, x[k + 15], 10, 0xFE2CE6E0)
    c = II(c, d, a, b, x[k + 6], 15, 0xA3014314)
    b = II(b, c, d, a, x[k + 13], 21, 0x4E0811A1)
    a = II(a, b, c, d, x[k + 4], 6, 0xF7537E82)
    d = II(d, a, b, c, x[k + 11], 10, 0xBD3AF235)
    c = II(c, d, a, b, x[k + 2], 15, 0x2AD7D2BB)
    b = II(b, c, d, a, x[k + 9], 21, 0xEB86D391)

    a = addUnsigned(a, AA)
    b = addUnsigned(b, BB)
    c = addUnsigned(c, CC)
    d = addUnsigned(d, DD)
  }

  return (wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)).toLowerCase()
}

/**
 * 使用 Web Crypto API 计算 SHA 哈希
 * @param algorithm - 算法名称
 * @param str - 要加密的字符串
 * @returns 十六进制哈希值
 */
async function shaHash(algorithm: string, str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 计算字符串的哈希值
 * @param algorithm - 哈希算法
 * @param str - 要加密的字符串
 * @returns 十六进制哈希值
 */
export async function hash(algorithm: HashAlgorithm, str: string): Promise<string> {
  if (!str) return ''
  switch (algorithm) {
    case 'md5':
      return md5(str)
    case 'sha1':
      return shaHash('SHA-1', str)
    case 'sha256':
      return shaHash('SHA-256', str)
    case 'sha384':
      return shaHash('SHA-384', str)
    case 'sha512':
      return shaHash('SHA-512', str)
    default:
      return ''
  }
}

/**
 * 哈希算法信息
 */
export const hashAlgorithms = [
  { value: 'md5' as HashAlgorithm, label: 'MD5', bits: 128, desc: '128位，已不推荐用于安全场景' },
  { value: 'sha1' as HashAlgorithm, label: 'SHA-1', bits: 160, desc: '160位，已不推荐用于安全场景' },
  { value: 'sha256' as HashAlgorithm, label: 'SHA-256', bits: 256, desc: '256位，推荐使用' },
  { value: 'sha384' as HashAlgorithm, label: 'SHA-384', bits: 384, desc: '384位，高安全性' },
  { value: 'sha512' as HashAlgorithm, label: 'SHA-512', bits: 512, desc: '512位，最高安全性' },
]
