import { provide, inject } from 'vue-demi'
import { engineInjectionKey } from 'vue-lowcode-shared'
import { Engine, type LowCodeEngineOptions } from './engine'

export function useLowcodeInit(options: LowCodeEngineOptions) {
  const engine = new Engine(options)
  provide<Engine>(engineInjectionKey, engine)
}

export function useLowcodeEngine() {
  return inject<Engine>(engineInjectionKey)
}

export * from './plugin'
export * from './engine'
