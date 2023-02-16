import { reactive } from 'vue-demi'
import { genID } from 'vue-lowcode-shared'
import type { PageSchema } from './type'

export class Page {
  #originPageSchema?: PageSchema

  get schema() {
    return this.#originPageSchema
  }

  init(pageSchema: PageSchema) {
    pageSchema = this.#normalizePageSchema(pageSchema)
    this.#originPageSchema = reactive(pageSchema)
  }

  #normalizePageSchema(pageSchema: PageSchema) {
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
