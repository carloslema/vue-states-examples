/**
 * Mocking client-server processing
 */

export interface Product {
  id: number,
  title: string,
  price: number,
  inventory: number,
}

const PRODUCT_ITEMS: () => Product[] = () => ([
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

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default {
  async getProducts(): Promise<Product[]> {
    await wait(100)
    return PRODUCT_ITEMS()
  },

  async buyProducts(): Promise<void> {
    await wait(100)
    // simulate random checkout failure.
    if (Math.random() > 0.5) {
      throw new Error('Something went wrong')
    }
  },
}
