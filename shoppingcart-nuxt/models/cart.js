import shop from '@/api/shop'

export default {
  injectModels: [
    'Inventory',
  ],
  data() {
    return {
      items: [],
      checkoutStatus: null,
    }
  },
  computed: {
    hasProducts() {
      return this.items.length !== 0
    },

    cartProducts() {
      return this.items.map(({ id, quantity }) => {
        const product = this.Inventory.products.find(productEl => productEl.id === id)
        return {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity,
        }
      })
    },

    total() {
      return this.cartProducts
        .reduce((total, product) => total + product.price * product.quantity, 0)
    },
  },
  methods: {
    async checkout() {
      const savedCartItems = [...this.items]
      this.checkoutStatus = null
      // empty cart
      this.items = []
      try {
        await shop.buyProducts(savedCartItems)
        this.onCheckoutSuccess()
      } catch (e) {
        this.onCheckoutFailed(savedCartItems)
        throw e
      }
    },

    addProductToCart(productId) {
      const countItems = 1
      this.checkoutStatus = null
      const cartItem = this.items.find(item => item.id === productId)

      this.Inventory.modifyProductInventory(productId, -countItems)

      // TODO: nachgträglich eingefügte subEvent

      if (!cartItem) {
        this.pushProduct(productId)
      } else {
        this.modifyItemQuantity(productId, countItems)
      }
    },

    removeProductFromCart(productId) {
      this.checkoutStatus = null
      const cartItem = this.items.find(({ id }) => id === productId)
      this.Inventory.modifyProductInventory(productId, 1)
      if (cartItem.quantity === 1) {
        this.removeProduct(productId)
      } else {
        this.modifyItemQuantity(cartItem.id, -1)
      }
    },

    /**
     * @private
     */
    onCheckoutSuccess() {
      this.checkoutStatus = 'successful'
    },

    /**
     * @private
     */
    onCheckoutFailed(savedItems) {
      this.checkoutStatus = 'failed'
      this.items.push(...savedItems)
    },

    /**
     * @private
     */
    modifyItemQuantity(id, modify) {
      const cartItem = this.items.find(item => item.id === id)
      cartItem.quantity += modify
    },

    /**
     * @private
     */
    pushProduct(id) {
      this.items.push({
        id,
        quantity: 1,
      })
    },

    /**
     * @private
     */
    removeProduct(removeId) {
      this.items = this.items.filter(({ id }) => id !== removeId)
    },
  },
}
