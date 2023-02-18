import { reactive } from 'vue-demi'
import { genID } from 'vue-lowcode-shared'
import { Node } from './node'
import type { PageSchema, NodeSchema } from './type'

export class Page {
  #originPageSchema: PageSchema
  #nodeMap: Map<string, Node>
  rootNode: Node

  get name() {
    return this.#originPageSchema?.name
  }

  get schema() {
    return this.#originPageSchema
  }

  constructor(pageSchema: PageSchema) {
    pageSchema = this.normalizePageSchema(pageSchema)
    this.#originPageSchema = reactive(pageSchema)
    this.#nodeMap = new Map()
    this.rootNode = this.createNode(pageSchema.componentTree)
  }

  getNode(id: string) {
    return this.#nodeMap.get(id)
  }

  createNode(schema: NodeSchema, parentNodeOrID?: Node | string) {
    return new Node(schema, this, parentNodeOrID)
  }

  normalizePageSchema(pageSchema: PageSchema) {
    if (!pageSchema.componentTree) {
      pageSchema.componentTree = {
        component: 'div',
        id: genID(),
        root: true,
        props: {
          style: 'height: 100%',
        },
      }
    }

    return pageSchema
  }
}
