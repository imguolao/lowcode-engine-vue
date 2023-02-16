export interface PropSchema {
  ref?: string
  calss?: string
  style?: string

  [name: string]: any
}

export interface NodeSchema {
  component: string

  id?: string

  props?: Record<string, any>
  children?: NodeSchema[] | string

  slotName?: string
  scopedSlot?: boolean | Record<string, string>
}
