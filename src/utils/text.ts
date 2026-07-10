/**
 * @file 文本处理工具
 * @description 提供文本差异比较、行数统计、字符统计、单词统计等功能
 * @author IT Tools
 */

import { diffLines } from 'diff'

/**
 * 文本差异行结构
 * @description 表示文本比较结果中每一行的差异类型和内容
 */
export interface DiffLine {
  /** 行内容 */
  value: string
  /** 是否为新增行 */
  added?: boolean
  /** 是否为删除行 */
  removed?: boolean
  /** 是否为未变更行 */
  unchanged?: boolean
}

/**
 * 比较两段文本的差异
 * @description 使用 diff 库进行逐行比较，返回差异结果数组
 * 每个差异项包含内容、添加标记、删除标记和未变更标记
 * @param oldText - 原始文本
 * @param newText - 新文本
 * @returns 差异行数组，每项包含内容和变更类型
 * @example
 * const diff = compareText('hello', 'hello world')
 * // 返回: [{ value: 'hello\n', unchanged: true }, { value: 'world', added: true, unchanged: false }]
 */
export function compareText(oldText: string, newText: string): DiffLine[] {
  // 使用 diff 库进行逐行比较
  const result = diffLines(oldText, newText)
  
  // 转换为统一的差异结构
  return result.map(part => ({
    value: part.value,
    added: part.added,
    removed: part.removed,
    unchanged: !part.added && !part.removed,
  }))
}

/**
 * 统计文本的行数
 * @description 通过换行符分割计算文本的总行数
 * @param str - 需要统计的文本字符串
 * @returns 文本的行数，空字符串返回 0
 * @example
 * countLines('hello\nworld') // 返回 2
 * countLines('') // 返回 0
 */
export function countLines(str: string): number {
  if (!str) return 0
  return str.split('\n').length
}

/**
 * 统计文本的字符数
 * @description 返回字符串的长度，包含所有字符（包括空格和换行符）
 * @param str - 需要统计的文本字符串
 * @returns 文本的字符数
 * @example
 * countChars('hello') // 返回 5
 * countChars('你好') // 返回 2
 */
export function countChars(str: string): number {
  return str.length
}

/**
 * 统计文本的单词数
 * @description 以空白字符为分隔符计算单词数量
 * 连续的空白字符会被视为单个分隔符
 * @param str - 需要统计的文本字符串
 * @returns 文本的单词数，空字符串返回 0
 * @example
 * countWords('hello world') // 返回 2
 * countWords('  hello   world  ') // 返回 2
 */
export function countWords(str: string): number {
  if (!str) return 0
  // 去除首尾空白后，按空白字符分割
  const words = str.trim().split(/\s+/)
  return words.length
}