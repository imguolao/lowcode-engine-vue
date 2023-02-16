import { warn } from 'vue-lowcode-shared'
import { Plugins } from './plugin'
import type { LowCodePluginObject } from './plugin'

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

  #init(options: LowCodeEngineOptions) {
    const { plugins = [] } = options
    plugins.forEach(p => this.pluginManager.register(p))

    // call `init` hook
    this.pluginManager.callHook('init', undefined, this)
  }
}
