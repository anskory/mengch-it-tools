/**
 * @file 通用工具函数
 * @description 提供 Tailwind CSS 类名合并和去重的工具函数
 * @author IT Tools
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 * @description 智能合并类名，解决 Tailwind CSS 类名冲突问题
 * 使用 clsx 处理条件类名，使用 tailwind-merge 去重和解决冲突
 * @param inputs - 类名列表，支持字符串、对象、数组等多种格式
 * @returns 合并后的类名字符串
 * @example
 * // 基本用法
 * cn('px-2 py-1', 'text-sm') // 返回 'px-2 py-1 text-sm'
 * 
 * // 条件类名
 * cn('base-class', isActive && 'active-class') // isActive为true时返回 'base-class active-class'
 * 
 * // 类名冲突解决（后者覆盖前者）
 * cn('p-2', 'p-4') // 返回 'p-4'，而不是 'p-2 p-4'
 * 
 * // 对象语法
 * cn({ 'text-red-500': hasError, 'text-green-500': isSuccess })
 */
export function cn(...inputs: ClassValue[]) {
  // clsx: 处理条件类名、数组、对象等格式
  // twMerge: 合并重复类名，解决 Tailwind 类名冲突
  return twMerge(clsx(inputs))
}