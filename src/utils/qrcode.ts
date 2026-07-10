import QRCode from 'qrcode'

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy'

export interface QrCodeOptions {
  width?: number
  margin?: number
  color?: {
    dark?: string
    light?: string
  }
  dotStyle?: DotStyle
  iconUrl?: string
  iconSize?: number
}

interface QRMatrix {
  size: number
  data: boolean[]
}

function getQRMatrix(data: string): QRMatrix | null {
  try {
    const qr = QRCode.create(data, { errorCorrectionLevel: 'H' })
    const size = qr.modules.size
    const moduleData: boolean[] = []
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

function isFinderPattern(row: number, col: number, size: number): boolean {
  const inTopLeft = row < 7 && col < 7
  const inTopRight = row < 7 && col >= size - 7
  const inBottomLeft = row >= size - 7 && col < 7
  return inTopLeft || inTopRight || inBottomLeft
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
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

function drawModule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: DotStyle
) {
  if (style === 'dots') {
    const radius = size / 2
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius * 0.82, 0, 2 * Math.PI)
    ctx.fill()
  } else if (style === 'rounded') {
    const radius = size * 0.3
    roundRectPath(ctx, x, y, size, size, radius)
    ctx.fill()
  } else if (style === 'classy') {
    const radius = size * 0.5
    roundRectPath(ctx, x, y, size, size, radius)
    ctx.fill()
  } else {
    ctx.fillRect(x, y, size, size)
  }
}

function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  moduleSize: number,
  color: string,
  bgColor: string,
  style: DotStyle
) {
  const w = moduleSize * 7
  const innerW = moduleSize * 5
  const coreW = moduleSize * 3

  ctx.fillStyle = color

  if (style === 'rounded') {
    const r = moduleSize * 2
    roundRectPath(ctx, x, y, w, w, r)
    ctx.fill()

    ctx.fillStyle = bgColor
    roundRectPath(ctx, x + moduleSize, y + moduleSize, innerW, innerW, r * 0.6)
    ctx.fill()

    ctx.fillStyle = color
    roundRectPath(ctx, x + moduleSize * 2, y + moduleSize * 2, coreW, coreW, r * 0.35)
    ctx.fill()
  } else if (style === 'classy') {
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
    ctx.fillRect(x, y, w, w)
    ctx.fillStyle = bgColor
    ctx.fillRect(x + moduleSize, y + moduleSize, innerW, innerW)
    ctx.fillStyle = color
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, coreW, coreW)
  }
}

export async function generateQrCode(data: string, options: QrCodeOptions = {}): Promise<string> {
  if (!data.trim()) return ''

  const width = options.width || 256
  const margin = Math.max(0, Math.min(20, options.margin ?? 4))
  const darkColor = options.color?.dark || '#000000'
  const lightColor = options.color?.light || '#ffffff'
  const dotStyle = options.dotStyle || 'square'

  const matrix = getQRMatrix(data)
  if (!matrix) return ''

  const totalModules = matrix.size + margin * 2
  const moduleSize = width / totalModules
  const offset = margin * moduleSize

  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = width
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    ctx.fillStyle = lightColor
    ctx.fillRect(0, 0, width, width)

    ctx.fillStyle = darkColor

    for (let row = 0; row < matrix.size; row++) {
      for (let col = 0; col < matrix.size; col++) {
        const idx = row * matrix.size + col
        if (!matrix.data[idx]) continue

        if (isFinderPattern(row, col, matrix.size)) continue

        const x = offset + col * moduleSize
        const y = offset + row * moduleSize
        drawModule(ctx, x, y, moduleSize, dotStyle)
      }
    }

    const finderPositions = [
      { row: 0, col: 0 },
      { row: 0, col: matrix.size - 7 },
      { row: matrix.size - 7, col: 0 },
    ]
    for (const pos of finderPositions) {
      const x = offset + pos.col * moduleSize
      const y = offset + pos.row * moduleSize
      drawFinderPattern(ctx, x, y, moduleSize, darkColor, lightColor, dotStyle)
    }

    if (options.iconUrl) {
      try {
        const iconImg = await loadImage(options.iconUrl)
        const iconSize = options.iconSize || width * 0.2
        const iconX = (width - iconSize) / 2
        const iconY = (width - iconSize) / 2

        const padding = iconSize * 0.1
        ctx.fillStyle = lightColor
        roundRectPath(ctx, iconX - padding, iconY - padding, iconSize + padding * 2, iconSize + padding * 2, padding)
        ctx.fill()

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

    return canvas.toDataURL('image/png')
  } catch (e) {
    console.error('生成二维码失败', e)
    return ''
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

export function downloadQrCode(dataUrl: string, filename: string = 'qrcode.png'): void {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

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
