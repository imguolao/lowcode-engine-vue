import { type PropType, defineComponent, h, watchEffect, computed, toRaw, ref, shallowRef } from 'vue-demi'
import { 
  type ObjectNodeSchema, 
  type NodeSchema, 
  type VueComponent, 
  type VueVNode,
  useLowCodeEngine,
} from 'vue-lowcode-engine'
import { isString } from 'vue-lowcode-shared'

const Renderer = defineComponent({
  props: {
    schema: {
      type: Object as PropType<NodeSchema>,
      required: true,
    },
  },
  setup(props) {
    const engine = useLowCodeEngine()!
    const isText = ref(false)
    const resolvedTextVNode = shallowRef<VueVNode>()
    const resolvedComponent = shallowRef<VueComponent>()
    const resolvedProps = shallowRef<Record<string, any>>()
    const resolvedChildren = shallowRef<NodeSchema[]>()

    watchEffect(() => {
      const schema = props.schema

      // call `resolveSchema` hook
      const rawSchema = toRaw(schema)
      const resolvedSchema = engine.pluginManager.callHook('resolveSchema', engine, rawSchema, rawSchema)
      
      // No need to process text nodes
      isText.value = isString(resolvedSchema)
      if (isText.value) {
        resolvedTextVNode.value = engine.pluginManager.callHook('resolveTextVNode', engine, resolvedSchema, resolvedSchema)
        return
      }
      
      // call `resolveComponent` hook
      const objNodeSchema = resolvedSchema as ObjectNodeSchema
      const compName = objNodeSchema.component
      resolvedComponent.value = engine.pluginManager.callHook('resolveSchema', engine, compName, compName, resolvedSchema)
      
      // call `resolveProps` hook
      const schemaProps = objNodeSchema.props ?? {}
      resolvedProps.value = engine.pluginManager.callHook('resolveProps', engine, schemaProps, schemaProps, resolvedSchema)

      // call `resolveChildren` hook
      const schemaChildren = objNodeSchema.children ? [...objNodeSchema.children] : undefined
      resolvedChildren.value = engine.pluginManager.callHook('resolveChildren', engine, schemaChildren, schemaChildren, resolvedSchema)
    })

    return { 
      isText, 
      resolvedTextVNode,
    }
  },
  render() {
    const { 
      schema,
      isText,
      resolvedTextVNode
    } = this

    if (isText) {
      // Handling in vue2 & 3 is different
      return resolvedTextVNode ?? h('div', null, schema as string)
    }

    // TODO
    return h('div', null, 'empty.')
  }
})

export { Renderer }
