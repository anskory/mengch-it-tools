/**
 * @file 二维码生成工具
 * @description 提供二维码生成、下载功能，支持多种样式和自定义配置
 * @author IT Tools
 */

import QRCode from 'qrcode'

/**
 * 二维码点样式类型
 * @description 定义二维码数据点的显示样式
 */
export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy'

/**
 * 二维码生成选项
 * @description 配置二维码的外观和样式
 */
export interface QrCodeOptions {
  /** 二维码宽度（像素），默认256 */
  width?: number
  /** 边距大小，默认4，范围0-20 */
  margin?: number
  /** 颜色配置 */
  color?: {
    /** 前景色（数据点颜色），默认黑色 */
    dark?: string
    /** 背景色，默认白色 */
    light?: string
  }
  /** 数据点样式，默认 'square' */
  dotStyle?: DotStyle
  /** 中心图标URL */
  iconUrl?: string
  /** 中心图标大小（像素），默认为二维码宽度的20% */
  iconSize?: number
}

/**
 * QR码矩阵结构
 * @description 内部使用的二维码矩阵数据结构
 */
interface QRMatrix {
  /** 矩阵尺寸 */
  size: number
  /** 矩阵数据，true表示该位置有数据点 */
  data: boolean[]
}

/**
 * 获取QR码矩阵数据
 * @description 生成二维码的内部矩阵表示
 * 使用高纠错级别（H级别）以支持中心图标
 * @param data - 需要编码的数据字符串
 * @returns QR码矩阵对象，生成失败返回null
 */
function getQRMatrix(data: string): QRMatrix | null {
  try {
    // 创建QR码对象，使用H级别纠错以支持中心图标
    const qr = QRCode.create(data, { errorCorrectionLevel: 'H' })
    const size = qr.modules.size
    const moduleData: boolean[] = []
    // 将模块数据转换为布尔数组
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        moduleData.push((qr.modules as any).get(r, c) as boolean)
      }
    }
    return { size, data: moduleData }
  } catch {
    return null
  }
}

/**
 * 判断位置是否在定位图案区域内
 * @description 定位图案是二维码三个角落的方块图案
 * 用于区分数据点和定位图案，以便分别绘制
 * @param row - 行索引
 * @param col - 列索引
 * @param size - 矩阵总大小
 * @returns 如果是定位图案位置返回true
 */
function isFinderPattern(row: number, col: number, size: number): boolean {
  // 左上角定位图案区域
  const inTopLeft = row < 7 && col < 7
  // 右上角定位图案区域
  const inTopRight = row < 7 && col >= size - 7
  // 左下角定位图案区域
  const inBottomLeft = row >= size - 7 && col < 7
  return inTopLeft || inTopRight || inBottomLeft
}

/**
 * 绘制圆角矩形路径
 * @description 在Canvas上绘制圆角矩形路径
 * @param ctx - Canvas 2D上下文
 * @param x - 左上角X坐标
 * @param y - 左上角Y坐标
 * @param w - 宽度
 * @param h - 高度
 * @param r - 圆角半径
 */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  // 确保圆角半径不超过宽高的一半
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + w - radius, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
  ctx.lineTo(x + w, y + h - radius)
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
  ctx.lineTo(x + radius, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * 绘制单个数据点模块
 * @description 根据指定样式绘制单个二维码数据点
 * @param ctx - Canvas 2D上下文
 * @param x - 模块左上角X坐标
 * @param y - 模块左上角Y坐标
 * @param size - 模块大小
 * @param style - 点样式
 */
function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: DotStyle
) {
  if (style === 'dots') {
    // 圆点样式
    const radius = size / 2
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius * 0.82, 0, 2 * Math.PI)
    ctx.fill()
  } else if (style === 'rounded') {
    // 小圆角样式
    const radius = size * 0.3
    roundRectPath(ctx, x, y, size, size, radius)
    ctx.fill()
  } else if (style === 'classy') {
    // 大圆角样式
    const radius = size * 0.5
    roundRectPath(ctx, x, y, size, size, radius)
    ctx.fill()
  } else {
    // 默认方形样式
    ctx.fillRect(x, y, size, size)
  }
}

/**
 * 绘制定位图案
 * @description 绘制二维码三个角落的定位图案，根据样式绘制不同外观
 * 定位图案由三层嵌套方块组成：外框、内框、核心
 * @param ctx - Canvas 2D上下文
 * @param x - 图案左上角X坐标
 * @param y - 图案左上角Y坐标
 * @param moduleSize - 单个模块大小
 * @param color - 前景色
 * @param bgColor - 背景色
 * @param style - 绘制样式
 */
function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  moduleSize: number,
  color: string,
  bgColor: string,
  style: DotStyle
) {
  // 定位图案尺寸：外框7x7，内框5x5，核心3x3
  const w = moduleSize * 7
  const innerW = moduleSize * 5
  const coreW = moduleSize * 3

  ctx.fillStyle = color

  if (style === 'rounded') {
    // 小圆角定位图案
    const r = moduleSize * 2
    // 绘制外框
    roundRectPath(ctx, x, y, w, w, r)
    ctx.fill()
    // 绘制内框（使用背景色）
    ctx.fillStyle = bgColor
    roundRectPath(ctx, x + moduleSize, y + moduleSize, innerW, innerW, r * 0.6)
    ctx.fill()
    // 绘制核心
    ctx.fillStyle = color
    roundRectPath(ctx, x + moduleSize * 2, y + moduleSize * 2, coreW, coreW, r * 0.35)
    ctx.fill()
  } else if (style === 'classy') {
    // 大圆角定位图案
    const r = moduleSize * 3
    roundRectPath(ctx, x, y, w, w, r)
    ctx.fill()
    ctx.fillStyle = bgColor
    roundRectPath(ctx, x + moduleSize, y + moduleSize, innerW, innerW, r * 0.7)
    ctx.fill()
    ctx.fillStyle = color
    roundRectPath(ctx, x + moduleSize * 2, y + moduleSize * 2, coreW, coreW, r * 0.45)
    ctx.fill()
  } else if (style === 'dots') {
    // 圆形定位图案
    ctx.beginPath()
    ctx.arc(x + w / 2, y + w / 2, w / 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(x + w / 2, y + w / 2, innerW / 2, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(x + w / 2, y + w / 2, coreW / 2, 0, 2 * Math.PI)
    ctx.fill()
  } else {
    // 方形定位图案
    ctx.fillRect(x, y, w, w)
    ctx.fillStyle = bgColor
    ctx.fillRect(x + moduleSize, y + moduleSize, innerW, innerW)
    ctx.fillStyle = color
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, coreW, coreW)
  }
}

/**
 * 生成二维码图片
 * @description 根据数据和选项生成二维码，返回base64格式的PNG图片URL
 * 支持自定义样式、颜色和中心图标
 * @param data - 需要编码的数据字符串
 * @param options - 二维码生成选项
 * @returns Promise<string> 返回base64格式的图片URL，失败返回空字符串
 * @example
 * const qrUrl = await generateQrCode('https://example.com', { width: 300, dotStyle: 'rounded' })
 */
export async function generateQrCode(data: string, options: QrCodeOptions = {}): Promise<string> {
  // 空数据直接返回
  if (!data.trim()) return ''

  // 解析选项参数，设置默认值
  const width = options.width || 256
  const margin = Math.max(0, Math.min(20, options.margin ?? 4))
  const darkColor = options.color?.dark || '#000000'
  const lightColor = options.color?.light || '#ffffff'
  const dotStyle = options.dotStyle || 'square'

  // 获取QR码矩阵数据
  const matrix = getQRMatrix(data)
  if (!matrix) return ''

  // 计算模块尺寸和偏移量
  const totalModules = matrix.size + margin * 2
  const moduleSize = width / totalModules
  const offset = margin * moduleSize

  try {
    // 创建Canvas画布
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = width
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // 绘制背景色
    ctx.fillStyle = lightColor
    ctx.fillRect(0, 0, width, width)

    ctx.fillStyle = darkColor

    // 绘制数据点模块（跳过定位图案区域）
    for (let row = 0; row < matrix.size; row++) {
      for (let col = 0; col < matrix.size; col++) {
        const idx = row * matrix.size + col
        if (!matrix.data[idx]) continue
        // 跳过定位图案，单独绘制
        if (isFinderPattern(row, col, matrix.size)) continue

        const x = offset + col * moduleSize
        const y = offset + row * moduleSize
        drawModule(ctx, x, y, moduleSize, dotStyle)
      }
    }

    // 绘制三个定位图案
    const finderPositions = [
      { row: 0, col: 0 },                                    // 左上角
      { row: 0, col: matrix.size - 7 },                       // 右上角
      { row: matrix.size - 7, col: 0 },                       // 左下角
    ]
    for (const pos of finderPositions) {
      const x = offset + pos.col * moduleSize
      const y = offset + pos.row * moduleSize
      drawFinderPattern(ctx, x, y, moduleSize, darkColor, lightColor, dotStyle)
    }

    // 绘制中心图标（如果指定）
    if (options.iconUrl) {
      try {
        const iconImg = await loadImage(options.iconUrl)
        const iconSize = options.iconSize || width * 0.2
        const iconX = (width - iconSize) / 2
        const iconY = (width - iconSize) / 2

        // 绘制图标背景（白色圆角矩形）
        const padding = iconSize * 0.1
        ctx.fillStyle = lightColor
        roundRectPath(ctx, iconX - padding, iconY - padding, iconSize + padding * 2, iconSize + padding * 2, padding)
        ctx.fill()

        // 绘制图标（带圆角裁剪）
        const radius = iconSize * 0.15
        ctx.save()
        roundRectPath(ctx, iconX, iconY, iconSize, iconSize, radius)
        ctx.clip()
        ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize)
        ctx.restore()
      } catch (e) {
        console.warn('二维码图标加载失败', e)
      }
    }

    // 返回base64格式的PNG图片URL
    return canvas.toDataURL('image/png')
  } catch (e) {
    console.error('生成二维码失败', e)
    return ''
  }
}

/**
 * 异步加载图片
 * @description 创建Image对象并异步加载指定URL的图片
 * @param url - 图片URL
 * @returns Promise<HTMLImageElement> 加载成功的图片元素
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'  // 允许跨域加载
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/**
 * 下载二维码图片
 * @description 创建下载链接并触发二维码图片下载
 * @param dataUrl - base64格式的图片URL（由generateQrCode生成）
 * @param filename - 下载文件名，默认 'qrcode.png'
 * @example
 * const qrUrl = await generateQrCode('https://example.com')
 * downloadQrCode(qrUrl, 'my-qr.png')
 */
export function downloadQrCode(dataUrl: string, filename: string = 'qrcode.png'): void {
  // 创建下载链接
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 二维码颜色预设列表
 * @description 提供一组预设的二维码颜色方案，方便用户选择
 */
export const colorPresets = [
  { name: '经典黑白', dark: '#000000', light: '#ffffff' },
  { name: '深蓝白', dark: '#1e3a8a', light: '#ffffff' },
  { name: '森林绿', dark: '#166534', light: '#ffffff' },
  { name: '暗夜紫', dark: '#581c87', light: '#ffffff' },
  { name: '深褐', dark: '#451a03', light: '#fef3c7' },
  { name: '橙白', dark: '#ea580c', light: '#ffffff' },
  { name: '白黑', dark: '#ffffff', light: '#1a2332' },
  { name: '青白', dark: '#0e7490', light: '#ffffff' },
  { name: '玫红白', dark: '#be123c', light: '#ffffff' },
  { name: '墨绿白', dark: '#365314', light: '#f7fee7' },
]