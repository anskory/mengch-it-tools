export function encodeUrl(str: string): string {
  try {
    return encodeURIComponent(str)
  } catch {
    return str
  }
}

export function decodeUrl(str: string): string {
  try {
    return decodeURIComponent(str)
  } catch {
    return str
  }
}

export function encodeUrlFull(str: string): string {
  try {
    return encodeURI(str)
  } catch {
    return str
  }
}

export function decodeUrlFull(str: string): string {
  try {
    return decodeURI(str)
  } catch {
    return str
  }
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}