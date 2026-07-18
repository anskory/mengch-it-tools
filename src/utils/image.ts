/**
 * @file 图片压缩工具
 * @description 提供图片压缩功能，支持调整质量和尺寸，全部在本地处理
 * @author IT Tools
 */

export interface CompressOptions {
  /** 压缩质量 (0-1) */
  quality: number
  /** 最大宽度，0表示不限制 */
  maxWidth: number
  /** 最大高度，0表示不限制 */
  maxHeight: number
  /** 输出格式 */
  format: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface CompressResult {
  /** 压缩后的图片 Blob */
  blob: Blob
  /** 压缩后的图片 DataURL */
  dataUrl: string
  /** 原始尺寸 */
  originalWidth: number
  originalHeight: number
  /** 压缩后尺寸 */
  width: number
  height: number
  /** 原始文件大小 (字节) */
  originalSize: number
  /** 压缩后文件大小 (字节) */
  size: number
}

/**
 * 压缩图片
 * @param file - 图片文件
 * @param options - 压缩选项
 * @returns 压缩结果
 */
export function compressImage(file: File, options: CompressOptions): Promise<CompressResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        if (options.maxWidth > 0 && width > options.maxWidth) {
          height = (height * options.maxWidth) / width
          width = options.maxWidth
        }
        if (options.maxHeight > 0 && height > options.maxHeight) {
          width = (width * options.maxHeight) / height
          height = options.maxHeight
        }

        width = Math.round(width)
        height = Math.round(height)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('无法创建Canvas上下文'))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('图片压缩失败'))
              return
            }
            const reader2 = new FileReader()
            reader2.onload = () => {
              resolve({
                blob,
                dataUrl: reader2.result as string,
                originalWidth: img.width,
                originalHeight: img.height,
                width,
                height,
                originalSize: file.size,
                size: blob.size,
              })
            }
            reader2.onerror = () => reject(new Error('读取压缩结果失败'))
            reader2.readAsDataURL(blob)
          },
          options.format,
          options.quality
        )
      }
      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsDataURL(file)
  })
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 * @returns 格式化的大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}
