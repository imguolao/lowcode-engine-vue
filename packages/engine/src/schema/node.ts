import type { NodeSchema } from './type'

export class Node {
  #originSchema: NodeSchema

  constructor(schema: NodeSchema, parentNodeOrID?: Node | string) {
    this.#originSchema = schema
  }

  
}
