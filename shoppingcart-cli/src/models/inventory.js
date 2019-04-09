import shop from '@/api/shop'

export default {
  data() {
    return {
      products: [],
      loaded: false,
    }
  },
  history: true,
  created() {
    this.loadProducts()
  },
  computed: {
    productMap() {
      return new Map(this.products.map(product => ([product.id, product])))
    },
  },
  methods: {
    async loadProducts() {
      if (this.loaded) {
        throw new Error('Can\'t reload products as quantity would be load')
      }
      const { saveProducts } = this
      saveProducts(await shop.getProducts())
    },
    modifyProductInventory(id, mod) {
      const product = this.products.find(productEl => productEl.id === id)
      const newInventory = product.inventory + mod
      if (newInventory < 0) {
        throw new Error(`Not enough items left for id '${id}'`)
      }
      product.inventory = newInventory
    },
    /**
     * @private
     */
    saveProducts(products) {
      this.products = products
      this.loaded = true
    },
  },
}
