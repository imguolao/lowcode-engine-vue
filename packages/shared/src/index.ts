import { nanoid } from 'nanoid'

export const engineInjectionKey = Symbol('lowcode engine')

export const genID = (id?: string) => id ?? nanoid()

export function warn(pkg: string, msg: string, ...args: any[]) {
  if (__DEV__) {
    console.warn(`\x1b[1m\x1b[33m[vue-lowcode-${pkg}]\x1b[0m\x1b[33m ${msg}\x1b[0m\n`, ...args)
  }
}

export function error(pkg: string, msg: string, ...args: any[]) {
  if (__DEV__) {
    console.error(`\x1b[1m\x1b[33m[vue-lowcode-${pkg}]\x1b[0m\x1b[33m ${msg}\x1b[0m\n`, ...args)
  }
}

export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

export function isObject(val: unknown): val is object {
  return Object.prototype.toString.call(val) === '[object Object]'
}

export * from './types'
