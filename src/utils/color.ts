/**
 * @file 颜色工具
 * @description 提供颜色格式转换、调色板生成等功能
 * @author IT Tools
 */

export interface RGB {
  r: number
  g: number
  b: number
}

export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * HEX 转 RGB
 * @param hex - 十六进制颜色值
 * @returns RGB 对象
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  }
}

/**
 * RGB 转 HEX
 * @param r - 红色 (0-255)
 * @param g - 绿色 (0-255)
 * @param b - 蓝色 (0-255)
 * @returns 十六进制颜色值
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

/**
 * RGB 转 HSL
 * @param r - 红色 (0-255)
 * @param g - 绿色 (0-255)
 * @param b - 蓝色 (0-255)
 * @returns HSL 对象
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * HSL 转 RGB
 * @param h - 色相 (0-360)
 * @param s - 饱和度 (0-100)
 * @param l - 亮度 (0-100)
 * @returns RGB 对象
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360
  s /= 100
  l /= 100
  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * HEX 转 HSL
 * @param hex - 十六进制颜色值
 * @returns HSL 对象
 */
export function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsl(rgb.r, rgb.g, rgb.b)
}

/**
 * HSL 转 HEX
 * @param h - 色相
 * @param s - 饱和度
 * @param l - 亮度
 * @returns 十六进制颜色值
 */
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

/**
 * 生成互补色
 * @param hex - 十六进制颜色值
 * @returns 互补色
 */
export function getComplementary(hex: string): string | null {
  const hsl = hexToHsl(hex)
  if (!hsl) return null
  return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)
}

/**
 * 生成类似色
 * @param hex - 十六进制颜色值
 * @returns 类似色数组
 */
export function getAnalogous(hex: string): string[] | null {
  const hsl = hexToHsl(hex)
  if (!hsl) return null
  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hex,
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
  ]
}

/**
 * 生成三角色
 * @param hex - 十六进制颜色值
 * @returns 三角色数组
 */
export function getTriadic(hex: string): string[] | null {
  const hsl = hexToHsl(hex)
  if (!hsl) return null
  return [
    hex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
  ]
}

/**
 * 生成同色系不同亮度的调色板
 * @param hex - 十六进制颜色值
 * @param count - 颜色数量
 * @returns 调色板数组
 */
export function generateShades(hex: string, count: number = 9): string[] | null {
  const hsl = hexToHsl(hex)
  if (!hsl) return null
  const shades: string[] = []
  const step = 80 / (count - 1)
  for (let i = 0; i < count; i++) {
    const lightness = 10 + i * step
    shades.push(hslToHex(hsl.h, hsl.s, Math.max(0, Math.min(100, lightness))))
  }
  return shades
}
