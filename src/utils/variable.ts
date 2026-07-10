export function toCamelCase(str: string): string {
  const words = splitWords(str)
  return words.map((word, index) => {
    if (index === 0) return word.toLowerCase()
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  }).join('')
}

export function toPascalCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('')
}

export function toSnakeCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toLowerCase()).join('_')
}

export function toKebabCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toLowerCase()).join('-')
}

export function toUpperSnakeCase(str: string): string {
  const words = splitWords(str)
  return words.map(word => word.toUpperCase()).join('_')
}

export function toLowerCase(str: string): string {
  return str.toLowerCase()
}

export function toUpperCase(str: string): string {
  return str.toUpperCase()
}

function splitWords(str: string): string[] {
  str = str.trim()
  if (!str) return []
  
  const result: string[] = []
  let currentWord = ''
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const prevChar = str[i - 1]
    
    if (/[^a-zA-Z0-9]/.test(char)) {
      if (currentWord) {
        result.push(currentWord)
        currentWord = ''
      }
    } else if (/[A-Z]/.test(char)) {
      if (currentWord && /[a-z0-9]/.test(prevChar || '')) {
        result.push(currentWord)
        currentWord = char
      } else {
        currentWord += char
      }
    } else {
      currentWord += char
    }
  }
  
  if (currentWord) {
    result.push(currentWord)
  }
  
  return result
}

export const variableTransforms = [
  { name: 'camelCase', label: '驼峰式', transform: toCamelCase },
  { name: 'PascalCase', label: '帕斯卡式', transform: toPascalCase },
  { name: 'snake_case', label: '下划线式', transform: toSnakeCase },
  { name: 'kebab-case', label: '中划线式', transform: toKebabCase },
  { name: 'UPPER_SNAKE_CASE', label: '大写下划线', transform: toUpperSnakeCase },
  { name: 'lowercase', label: '全小写', transform: toLowerCase },
  { name: 'UPPERCASE', label: '全大写', transform: toUpperCase },
]