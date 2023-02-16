import type { LowCodeHookNames } from 'vue-lowcode-shared'
import { LowCodeHooks, warn } from 'vue-lowcode-shared'

export type LowCodePluginID = string;
export type LowCodePluginObject = Record<LowCodeHookNames, Function> & { id: string } & Record<string, any>

export class Plugins {
  #innerPluginIDCount: number
  #hooksMap: Map<LowCodeHookNames, Function[]>
  #pluginsMap: Map<LowCodePluginID, LowCodePluginObject>

  constructor() {
    this.#innerPluginIDCount = 0
    this.#hooksMap = new Map()
    this.#pluginsMap = new Map()
  }

  register(pluginObj: LowCodePluginObject): boolean {
    const pluginID = this.#normalizePluginID(pluginObj?.id, pluginObj)
    this.#pluginsMap.set(pluginID, {
      ...pluginObj,
      id: pluginID,
    })

    Object
      .keys(pluginObj)
      .filter(this.#isHookName)
      .forEach(hookName => {
        if (!this.#hooksMap.has(hookName)) {
          this.#hooksMap.set(hookName, [])
        }

        this.#hooksMap.get(hookName)!.push(pluginObj[hookName])
      })

    return true
  }

  // unregister(): boolean {}

  callHook(hookName: LowCodeHookNames, initResult: any, ...args: any[]) {
    if (this.#hooksMap.has(hookName)) {
      return this.#hooksMap.get(hookName)!.reduce((res, func) => {
        return func.call(null, ...args, res)
      }, initResult)
    }
  }

  #normalizePluginID(id: string | undefined, pluginObj: LowCodePluginObject) {
    if (id) {
      if (this.#pluginsMap.has(id)) {
        warn('engine', `Duplicate registration of the plugin with id ${id}.`, pluginObj)
      }

      return id
    }

    warn('engine', `plugin id is missing.`, pluginObj)
    return `plugin-${this.#innerPluginIDCount++}`
  }

  #isHookName(name: string): name is LowCodeHookNames {
    return Object.keys(LowCodeHooks).findIndex(v => v === name) !== -1
  }
}