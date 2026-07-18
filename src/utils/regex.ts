/**
 * @file 正则表达式测试工具
 * @description 提供正则表达式匹配、测试、分组提取等功能
 * @author IT Tools
 */

export interface RegexMatchResult {
  index: number
  match: string
  groups: string[]
  start: number
  end: number
}

export interface RegexTestResult {
  isValid: boolean
  error?: string
  matches: RegexMatchResult[]
  matchCount: number
}

/**
 * 测试正则表达式并返回所有匹配结果
 * @param pattern - 正则表达式模式字符串
 * @param flags - 正则表达式标志
 * @param text - 要测试的文本
 * @returns 匹配结果
 */
export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags)
    const matches: RegexMatchResult[] = []
    let match: RegExpExecArray | null
    let index = 0

    if (flags.includes('g')) {
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          index: index++,
          match: match[0],
          groups: match.slice(1),
          start: match.index,
          end: match.index + match[0].length,
        })
        if (match.index === regex.lastIndex) {
          regex.lastIndex++
        }
      }
    } else {
      match = regex.exec(text)
      if (match) {
        matches.push({
          index: 0,
          match: match[0],
          groups: match.slice(1),
          start: match.index,
          end: match.index + match[0].length,
        })
      }
    }

    return {
      isValid: true,
      matches,
      matchCount: matches.length,
    }
  } catch (e) {
    return {
      isValid: false,
      error: e instanceof Error ? e.message : '正则表达式语法错误',
      matches: [],
      matchCount: 0,
    }
  }
}

/**
 * 转义正则表达式特殊字符
 * @param str - 要转义的字符串
 * @returns 转义后的字符串
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 常用正则表达式模式
 */
export const commonPatterns = [
  { name: '邮箱地址', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { name: '手机号码', pattern: '1[3-9]\\d{9}', flags: 'g' },
  { name: 'URL链接', pattern: 'https?://[\\w-]+(\\.[\\w-]+)+[\\w.,@?^=%&:/~+#-]*', flags: 'g' },
  { name: 'IP地址', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}', flags: 'g' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+', flags: 'g' },
  { name: '身份证号', pattern: '[1-9]\\d{5}(19|20)\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]', flags: 'g' },
  { name: 'HTML标签', pattern: '<[^>]+>', flags: 'g' },
  { name: '数字', pattern: '-?\\d+\\.?\\d*', flags: 'g' },
]
