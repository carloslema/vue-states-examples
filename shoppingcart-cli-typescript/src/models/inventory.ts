import shop, { Product } from '@/api/shop.ts'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class Inventory extends Vue {

  products: Product[] = []
  loaded = false

  created(): void {
    this.loadProducts()
  }

  get productMap() {
    return new Map(this.products.map(product => ([product.id, product])))
  }

  async loadProducts() {
    if (this.loaded) {
      throw new Error('Can\'t reload products as quantity would be load')
    }
    const { saveProducts } = this
    saveProducts(await shop.getProducts())
  }

  modifyProductInventory(id: number, mod: number) {
    const product = this.products.find(productEl => productEl.id === id)
    if (!product || (product.inventory + mod < 0)) {
      throw new Error(`Not enough items left for id '${id}'`)
    }
    product.inventory += mod
  }

  /**
   * @private
   */
  saveProducts(products: Product[]) {
    this.products = products
    this.loaded = true
  }
}
