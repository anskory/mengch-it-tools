/**
 * @file JSON处理工具
 * @description 提供JSON格式化、压缩、比较、校验等功能
 * @author IT Tools
 */

/**
 * 格式化JSON字符串（美化）
 * @description 将压缩的JSON字符串格式化为易读的格式，带缩进
 * @param jsonStr - 需要格式化的JSON字符串
 * @param indent - 缩进空格数，默认为2
 * @param sortKeys - 是否按键排序，暂未实现
 * @returns 格式化后的JSON字符串，解析失败时返回原字符串
 * @example
 * beautifyJson('{"name":"test"}')
 * // 返回:
 * // {
 * //   "name": "test"
 * // }
 */
export function beautifyJson(jsonStr: string, indent: number = 2, sortKeys: boolean = false): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed, null, indent)
  } catch {
    // JSON解析失败时返回原字符串
    return jsonStr
  }
}

/**
 * 压缩JSON字符串
 * @description 移除JSON字符串中的所有空白字符，生成最小化格式
 * @param jsonStr - 需要压缩的JSON字符串
 * @returns 压缩后的JSON字符串，解析失败时返回原字符串
 * @example
 * minifyJson('{\n  "name": "test"\n}')
 * // 返回: '{"name":"test"}'
 */
export function minifyJson(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed)
  } catch {
    return jsonStr
  }
}

/**
 * JSON差异比较结果
 * @description 表示两个JSON对象比较后的差异项
 */
export interface JsonDiffResult {
  /** 变更类型：added-新增, removed-删除, changed-修改, unchanged-未变更 */
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  /** 键名 */
  key: string
  /** 完整路径 */
  path: string
  /** 旧值 */
  oldValue?: any
  /** 新值 */
  newValue?: any
  /** 子级差异（用于嵌套对象） */
  children?: JsonDiffResult[]
}

/**
 * 比较两个JSON对象的差异
 * @description 深度比较两个JSON对象，返回差异结果数组
 * 支持嵌套对象的递归比较
 * @param oldJsonStr - 原JSON字符串
 * @param newJsonStr - 新JSON字符串
 * @returns 差异结果数组，任一JSON解析失败时返回空数组
 * @example
 * compareJson('{"a":1}', '{"a":2,"b":3}')
 * // 返回: [{ type: 'changed', key: 'a', path: 'a', oldValue: 1, newValue: 2 }, { type: 'added', key: 'b', path: 'b', newValue: 3 }]
 */
export function compareJson(oldJsonStr: string, newJsonStr: string): JsonDiffResult[] {
  try {
    const oldObj = JSON.parse(oldJsonStr)
    const newObj = JSON.parse(newJsonStr)
    return compareObjects(oldObj, newObj, '')
  } catch {
    return []
  }
}

/**
 * 递归比较两个对象的差异
 * @description 内部辅助函数，递归比较对象的所有属性
 * 检测新增、删除、修改的属性，支持嵌套对象
 * @param oldObj - 原对象
 * @param newObj - 新对象
 * @param path - 当前属性路径
 * @returns 差异结果数组
 */
function compareObjects(oldObj: any, newObj: any, path: string): JsonDiffResult[] {
  const results: JsonDiffResult[] = []
  // 合并两个对象的所有键
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
  
  for (const key of allKeys) {
    // 构建当前属性的完整路径
    const currentPath = path ? `${path}.${key}` : key
    const oldValue = oldObj[key]
    const newValue = newObj[key]
    
    // 检测新增的属性
    if (!(key in oldObj)) {
      results.push({
        type: 'added',
        key,
        path: currentPath,
        newValue,
      })
    } 
    // 检测删除的属性
    else if (!(key in newObj)) {
      results.push({
        type: 'removed',
        key,
        path: currentPath,
        oldValue,
      })
    } 
    // 检测修改的属性
    else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      // 如果两个值都是对象，递归比较
      if (typeof oldValue === 'object' && typeof newValue === 'object' && oldValue !== null && newValue !== null) {
        const children = compareObjects(oldValue, newValue, currentPath)
        if (children.length > 0) {
          results.push({
            type: 'changed',
            key,
            path: currentPath,
            oldValue,
            newValue,
            children,
          })
        }
      } else {
        // 非对象类型的值直接比较
        results.push({
          type: 'changed',
          key,
          path: currentPath,
          oldValue,
          newValue,
        })
      }
    }
  }
  
  return results
}

/**
 * 校验字符串是否为有效的JSON
 * @description 尝试解析字符串，判断是否为合法的JSON格式
 * @param str - 需要校验的字符串
 * @returns 如果是有效的JSON返回true，否则返回false
 * @example
 * isValidJson('{"name":"test"}') // 返回 true
 * isValidJson('invalid json') // 返回 false
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

/**
 * 获取JSON解析错误信息
 * @description 尝试解析JSON字符串，返回解析失败的错误信息
 * @param str - 需要校验的字符串
 * @returns 如果JSON有效返回null，否则返回错误信息
 * @example
 * getJsonError('invalid json') // 返回 "Expected property name or '}' in JSON at position 1"
 * getJsonError('{"valid":true}') // 返回 null
 */
export function getJsonError(str: string): string | null {
  try {
    JSON.parse(str)
    return null
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid JSON'
  }
}