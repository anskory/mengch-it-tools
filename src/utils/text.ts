import { diffLines } from 'diff'

export interface DiffLine {
  value: string
  added?: boolean
  removed?: boolean
  unchanged?: boolean
}

export function compareText(oldText: string, newText: string): DiffLine[] {
  const result = diffLines(oldText, newText)
  
  return result.map(part => ({
    value: part.value,
    added: part.added,
    removed: part.removed,
    unchanged: !part.added && !part.removed,
  }))
}

export function countLines(str: string): number {
  if (!str) return 0
  return str.split('\n').length
}

export function countChars(str: string): number {
  return str.length
}

export function countWords(str: string): number {
  if (!str) return 0
  const words = str.trim().split(/\s+/)
  return words.length
}