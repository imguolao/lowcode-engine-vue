export interface PropSchema {
  ref?: string
  calss?: string
  style?: string

  [key: string]: any
}

export interface ObjectNodeSchema {
  component: string

  // attr
  id?: string
  root?: boolean

  // props
  props?: PropSchema
  children?: NodeSchema[]

  // slots
  slotName?: string
  scopedSlot?: boolean | Record<string, string>

  [key: string]: any
}

export type TextNodeSchema = string
export type NodeSchema = ObjectNodeSchema | TextNodeSchema

export interface PageSchema {
  name?: string
  componentTree: NodeSchema

  [key: string]: any
}
