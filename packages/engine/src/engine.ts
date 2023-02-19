import { warn } from 'vue-lowcode-shared'
import { Plugins } from './plugin'
import type { LowCodePluginObject, LowCodeHookNames } from './plugin'

export interface LowCodeEngineOptions {
  plugins?: LowCodePluginObject[]
}

export class Engine {
  #attrs: Record<string, any>
  pluginManager: Plugins

  constructor(options: LowCodeEngineOptions) {
    this.#attrs = {}
    this.pluginManager = new Plugins()
    this.#init(options)
  }

  set<T = any>(key: string, attr: T): T {
    if (__DEV__ && Object.hasOwn(this.#attrs, key)) {
      warn('engine', `${key} is already existed.`, key, attr)
    }

    this.#attrs[key] = attr
    return this.#attrs[key]
  }

  get<T = any>(key: string): T {
    return this.#attrs[key]
  }

  callHook(hookName: LowCodeHookNames, initResult: any, ...args: any[]): any {
    return this.pluginManager.callHook(hookName, this, initResult, ...args)
  }

  #init(options: LowCodeEngineOptions) {
    const { plugins = [] } = options
    plugins.forEach(p => this.pluginManager.register(p))

    // call `init` hook
    this.callHook('init', undefined)
  }
}
