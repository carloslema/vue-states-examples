import shop from '@/api/shop.ts'
import Inventory from '@/models/inventory'
import Vue from 'vue'
import Component from 'vue-class-component'

interface CartItem {
  id: number,
  quantity: number,
}

@Component({
  injectModels: [
    'Inventory',
  ],
})
export default class Cart extends Vue {
  // @ts-ignore
  Inventory: Inventory

  items: CartItem[] = []
  checkoutStatus: 'failed' | 'successful' | null = null

  get hasProducts(): boolean {
    return this.items.length !== 0
  }

  get cartProducts() {
    return this.items.map(({ id, quantity }) => {
      // todo: resolve inventory
      const product = this.Inventory.products.find(productEl => productEl.id === id)!
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
      }
    })
  }

  get total() {
    return this.cartProducts
      .reduce((total, product) => total + product.price * product.quantity, 0)
  }

  async checkout() {
    const savedCartItems = [...this.items]
    this.checkoutStatus = null
    // empty cart
    this.items = []
    try {
      await shop.buyProducts()
      this.onCheckoutSuccess()
    } catch (e) {
      this.onCheckoutFailed(savedCartItems)
      throw e
    }
  }

  addProductToCart(productId: number) {
    const countItems = 1
    this.checkoutStatus = null
    const cartItem = this.items.find(item => item.id === productId)

    this.Inventory.modifyProductInventory(productId, -countItems)

    if (!cartItem) {
      this.pushProduct(productId)
    } else {
      this.modifyItemQuantity(productId, countItems)
    }
  }

  removeProductFromCart(productId: number) {
    this.checkoutStatus = null
    const cartItem = this.items.find(({ id }) => id === productId)

    if (!cartItem) {
      throw new Error(`CartItem ${productId} not found`)
    }
    this.Inventory.modifyProductInventory(productId, 1)

    if (cartItem.quantity === 1) {
      this.removeProduct(productId)
    } else {
      this.modifyItemQuantity(cartItem.id, -1)
    }
  }

  /**
   * @private
   */
  onCheckoutSuccess() {
    this.checkoutStatus = 'successful'
  }

  /**
   * @private
   */
  onCheckoutFailed(savedItems: CartItem[]) {
    this.checkoutStatus = 'failed'
    this.items.push(...savedItems)
  }

  /**
   * @private
   */
  modifyItemQuantity(id: number, modify: number) {
    const cartItem = this.items.find(item => item.id === id)
    if (!cartItem) {
      throw new Error(`CartItem ${id} not found`)
    }
    cartItem.quantity += modify
  }

  /**
   * @private
   */
  pushProduct(id: number) {
    this.items.push({
      id,
      quantity: 1,
    })
  }

  /**
   * @private
   */
  removeProduct(removeId: number) {
    this.items = this.items.filter(({ id }) => id !== removeId)
  }
}
