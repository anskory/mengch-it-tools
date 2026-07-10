export function beautifyJson(jsonStr: string, indent: number = 2, sortKeys: boolean = false): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed, null, indent)
  } catch {
    return jsonStr
  }
}

export function minifyJson(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr)
    return JSON.stringify(parsed)
  } catch {
    return jsonStr
  }
}

export interface JsonDiffResult {
  type: 'added' | 'removed' | 'changed' | 'unchanged'
  key: string
  path: string
  oldValue?: any
  newValue?: any
  children?: JsonDiffResult[]
}

export function compareJson(oldJsonStr: string, newJsonStr: string): JsonDiffResult[] {
  try {
    const oldObj = JSON.parse(oldJsonStr)
    const newObj = JSON.parse(newJsonStr)
    return compareObjects(oldObj, newObj, '')
  } catch {
    return []
  }
}

function compareObjects(oldObj: any, newObj: any, path: string): JsonDiffResult[] {
  const results: JsonDiffResult[] = []
  const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)])
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const oldValue = oldObj[key]
    const newValue = newObj[key]
    
    if (!(key in oldObj)) {
      results.push({
        type: 'added',
        key,
        path: currentPath,
        newValue,
      })
    } else if (!(key in newObj)) {
      results.push({
        type: 'removed',
        key,
        path: currentPath,
        oldValue,
      })
    } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
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

export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

export function getJsonError(str: string): string | null {
  try {
    JSON.parse(str)
    return null
  } catch (e) {
    return e instanceof Error ? e.message : 'Invalid JSON'
  }
}