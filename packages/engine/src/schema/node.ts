import { set } from 'vue-demi'
import { isString, isObject, genID, warn, error } from 'vue-lowcode-shared'
import type { Page } from './page'
import type { NodeSchema, ObjectNodeSchema } from './type'

export const LC_NODE_KEY = Symbol('lowcode node')

export class Node {
  /**
   * @field Internal property
   */
  [LC_NODE_KEY] = true

  #originSchema: NodeSchema
  id: string
  page: Page
  parent?: Node | null
  children?: Node[]

  /**
   * Whether the node is a root node
   */
  get isRoot() {
    return isObject(this.#originSchema) && !!this.#originSchema?.root
  }

  /**
   * Whether the node is a text node
   */
  get isText() {
    return isString(this.#originSchema)
  }

  get schema() {
    return this.#originSchema
  }

  constructor(schema: NodeSchema, page: Page, parentNodeOrID?: Node | string) {
    this.#originSchema = schema
    this.page = page
    this.parent = this.#normalizeNode(parentNodeOrID)
    this.id = this.#normalizeID(schema)
    this.#initializeChildren(schema)
  }

  addChildren(schemas: NodeSchema[]): Node[] {
    return schemas.map(schema => this.addChild(schema))
  }

  addChild(schema: NodeSchema): Node {
    if (this.isText) {
      error('engine', `Node[${this.id}] is a text node that can't call "addChild" function.`, this, schema)
    }

    // Inset into the reactive tree.
    if (!(this.#originSchema as ObjectNodeSchema)?.children) {
      set(this.#originSchema, 'children', [])
    }

    (this.#originSchema as ObjectNodeSchema).children!.push(schema)

    // Create node and link it.
    if (!this.children) {
      this.children = []
    }

    const node = new Node(schema, this.page, this)
    this.children!.push(node)
    return node
  }

  #initializeChildren(schema: NodeSchema): void {
    if (isString(schema) || !Array.isArray(schema.children)) {
      return
    }

    this.addChildren(schema.children)
  }

  #normalizeNode(nodeOrID?: Node | string): Node | undefined {
    if (isString(nodeOrID)) {
      return this.page?.getNode(nodeOrID)
    }

    if (isObject(nodeOrID) && nodeOrID[LC_NODE_KEY]) {
      return nodeOrID
    }

    return undefined
  }

  #normalizeID(schema: NodeSchema): string {
    if (isString(schema)) {
      return genID()
    }

    const id = schema.id ?? genID()
    set(schema, 'id', id)
    return id
  }
}
