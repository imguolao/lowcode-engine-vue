export interface PropSchema {
  ref?: string
  calss?: string
  style?: string

  [key: string]: any
}

export interface NodeSchema {
  component: string

  // attr
  id?: string
  root?: boolean

  // props
  props?: PropSchema
  children?: NodeSchema[] | string

  // slots
  slotName?: string
  scopedSlot?: boolean | Record<string, string>

  [key: string]: any
}

export interface PageSchema {
  name: string
  componentTree?: NodeSchema

  [key: string]: any
}
