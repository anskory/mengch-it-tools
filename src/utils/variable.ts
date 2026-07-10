/**
 * @file 变量名转换工具
 * @description 提供各种变量命名风格之间的转换功能，包括驼峰式、帕斯卡式、下划线式、中划线式等
 * @author IT Tools
 */

/**
 * 将字符串转换为驼峰式命名（camelCase）
 * @description 首单词小写，后续单词首字母大写，单词之间无分隔符
 * @param str - 需要转换的字符串，支持多种命名风格输入
 * @returns 转换后的驼峰式命名字符串
 * @example
 * toCamelCase('hello_world') // 返回 'helloWorld'
 * toCamelCase('HelloWorld') // 返回 'helloWorld'
 * toCamelCase('hello-world') // 返回 'helloWorld'
 */
export function toCamelCase(str: string): string {
  // 首先将字符串分割成单词数组
  const words = splitWords(str)
  // 首单词小写，后续单词首字母大写并拼接
  return words.map((word, index) => {
    if (index === 0) return word.toLowerCase()
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join('')
}

/**
 * 将字符串转换为帕斯卡式命名（PascalCase）
 * @description 每个单词首字母大写，单词之间无分隔符，也称为大驼峰命名
 * @param str - 需要转换的字符串，支持多种命名风格输入
 * @returns 转换后的帕斯卡式命名字符串
 * @example
 * toPascalCase('hello_world') // 返回 'HelloWorld'
 * toPascalCase('hello-world') // 返回 'HelloWorld'
 */
export function toPascalCase(str: string): string {
  // 分割单词后，每个单词首字母大写
  const words = splitWords(str)
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')
}

/**
 * 将字符串转换为下划线式命名（snake_case）
 * @description 所有单词小写，使用下划线连接
 * @param str - 需要转换的字符串，支持多种命名风格输入
 * @returns 转换后的下划线式命名字符串
 * @example
 * toSnakeCase('HelloWorld') // 返回 'hello_world'
 * toSnakeCase('hello-world') // 返回 'hello_world'
 */
export function toSnakeCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toLowerCase()).join('_')
}

/**
 * 将字符串转换为中划线式命名（kebab-case）
 * @description 所有单词小写，使用中划线连接，也称为短横线命名
 * @param str - 需要转换的字符串，支持多种命名风格输入
 * @returns 转换后的中划线式命名字符串
 * @example
 * toKebabCase('HelloWorld') // 返回 'hello-world'
 * toKebabCase('hello_world') // 返回 'hello-world'
 */
export function toKebabCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toLowerCase()).join('-')
}

/**
 * 将字符串转换为大写下划线式命名（UPPER_SNAKE_CASE）
 * @description 所有单词大写，使用下划线连接，常用于常量命名
 * @param str - 需要转换的字符串，支持多种命名风格输入
 * @returns 转换后的大写下划线式命名字符串
 * @example
 * toUpperSnakeCase('HelloWorld') // 返回 'HELLO_WORLD'
 * toUpperSnakeCase('hello-world') // 返回 'HELLO_WORLD'
 */
export function toUpperSnakeCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toUpperCase()).join('_')
}

/**
 * 将字符串转换为全小写
 * @description 将字符串中的所有字符转换为小写
 * @param str - 需要转换的字符串
 * @returns 转换后的全小写字符串
 * @example
 * toLowerCase('Hello World') // 返回 'hello world'
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

/**
 * 将字符串转换为全大写
 * @description 将字符串中的所有字符转换为大写
 * @param str - 需要转换的字符串
 * @returns 转换后的全大写字符串
 * @example
 * toUpperCase('Hello World') // 返回 'HELLO WORLD'
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

/**
 * 将字符串分割成单词数组
 * @description 内部辅助函数，用于将各种命名风格的字符串分割成独立的单词
 * 支持识别：下划线分隔、中划线分隔、驼峰命名、帕斯卡命名等
 * @param str - 需要分割的字符串
 * @returns 分割后的单词数组
 * @example
 * splitWords('hello_world') // 返回 ['hello', 'world']
 * splitWords('HelloWorld') // 返回 ['Hello', 'World']
 * splitWords('hello-world') // 返回 ['hello', 'world']
 */
function splitWords(str: string): string[] {
  // 去除首尾空格
  str = str.trim()
  // 空字符串直接返回空数组
  if (!str) return []
  
  const result: string[] = []
  let currentWord = ''
  
  // 遍历字符串的每个字符
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const prevChar = str[i - 1]
    
    // 非字母数字字符作为分隔符
    if (/[^a-zA-Z0-9]/.test(char)) {
      if (currentWord) {
        result.push(currentWord)
        currentWord = ''
      }
    } else if (/[A-Z]/.test(char)) {
      // 大写字母处理：检测驼峰命名中的单词边界
      // 如果前一个字符是小写字母或数字，则当前大写字母是新单词的开始
      if (currentWord && /[a-z0-9]/.test(prevChar || '')) {
        result.push(currentWord)
        currentWord = char
      } else {
        currentWord += char
      }
    } else {
      // 小写字母和数字直接追加到当前单词
      currentWord += char
    }
  }
  
  // 处理最后一个单词
  if (currentWord) {
    result.push(currentWord)
  }
  
  return result
}

/**
 * 变量名转换配置列表
 * @description 包含所有支持的变量命名风格及其转换函数，用于界面展示和转换调用
 */
export const variableTransforms = [
  { name: 'camelCase', label: '驼峰式', transform: toCamelCase },
  { name: 'PascalCase', label: '帕斯卡式', transform: toPascalCase },
  { name: 'snake_case', label: '下划线式', transform: toSnakeCase },
  { name: 'kebab-case', label: '中划线式', transform: toKebabCase },
  { name: 'UPPER_SNAKE_CASE', label: '大写下划线', transform: toUpperSnakeCase },
  { name: 'lowercase', label: '全小写', transform: toLowerCase },
  { name: 'UPPERCASE', label: '全大写', transform: toUpperCase },
]