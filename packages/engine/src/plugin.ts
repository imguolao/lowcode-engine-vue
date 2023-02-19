import { h } from 'vue-demi'
import { warn } from 'vue-lowcode-shared'
import { type Engine } from './engine'
import { type NodeSchema, type ObjectNodeSchema, type PropSchema } from './schema'

export type VueComponent = Parameters<typeof h>[0] | string
export type VueVNode = ReturnType<typeof h>

export enum LowCodeHooks {
  'init' = 'init',
  'resolveSchema' = 'resolveSchema',
  'resolveTextVNode' = 'resolveTextVNode',
  'resolveComponent' = 'resolveComponent',
  'resolveProps' = 'resolveProps',
  'resolveChildren' = 'resolveChildren',
}

export type LowCodeHooksType = {
  [LowCodeHooks.init]: (engine: Engine) => void
  [LowCodeHooks.resolveSchema]: (engine: Engine, schema: NodeSchema, prevResult: NodeSchema) => NodeSchema
  [LowCodeHooks.resolveTextVNode]: (engine: Engine, text: string, prevResult: string) => VueVNode
  [LowCodeHooks.resolveComponent]: (engine: Engine, component: string, schema: ObjectNodeSchema, prevResult: VueComponent) => VueComponent
  [LowCodeHooks.resolveProps]: (engine: Engine, props: PropSchema, schema: ObjectNodeSchema, prevResult: Record<string, any>) => VueComponent
  [LowCodeHooks.resolveChildren]: (
    engine: Engine, 
    children: ObjectNodeSchema['children'], 
    schema: ObjectNodeSchema, 
    prevResult: ObjectNodeSchema['children'],
  ) => VueComponent
}

export type LowCodePluginID = string;
export type LowCodeHookNames = `${LowCodeHooks}`
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

  callHook(hookName: LowCodeHookNames, engine: Engine, initResult: any, ...args: any[]) {
    if (this.#hooksMap.has(hookName)) {
      return this.#hooksMap.get(hookName)!.reduce((res, func) => {
        return func.call(null, engine, ...args, res)
      }, initResult)
    }
  }

  #normalizePluginID(id: string | undefined, pluginObj: LowCodePluginObject) {
    if (id) {
      if (this.#pluginsMap.has(id)) {
        warn('engine', `Duplicate registration of the plugin with id ${id}.`, pluginObj, this)
      }

      return id
    }

    warn('engine', `plugin id is missing.`, pluginObj, this)
    return `plugin-${this.#innerPluginIDCount++}`
  }

  #isHookName(name: string): name is LowCodeHookNames {
    return !!~Object.keys(LowCodeHooks).findIndex(v => v === name)
  }
}