/**
 * Mocking client-server processing
 */
const PRODUCT_ITEMS = () => ([
  {
    id: 1, title: 'State', price: 500.01, inventory: 2,
  },
  {
    id: 2, title: 'Management', price: 10.99, inventory: 10,
  },
  {
    id: 3, title: 'System', price: 19.99, inventory: 5,
  },
])

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  async getProducts() {
    await wait(100)
    return PRODUCT_ITEMS()
  },

  async buyProducts() {
    await wait(100)
    // simulate random checkout failure.
    if (Math.random() > 0.5) {
      throw new Error('Something went wrong')
    }
  },
}
