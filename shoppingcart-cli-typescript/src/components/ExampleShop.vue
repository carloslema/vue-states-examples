<template>
  <v-layout
    align-center
    justify-center
    row
  >
    <v-flex>
      <v-card class="mb-2">
        <product-list class="pa-3" />
      </v-card>
      <v-spacer />
      <v-card>
        <shopping-cart class="pa-3" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import Cart from '@/models/cart.ts'
import Inventory from '@/models/inventory.ts'
import ProductList from '@/components/ProductList'
import ShoppingCart from '@/components/ShoppingCart'

window.Inventory = Inventory
window.Vue = Vue

export default {
  name: 'ExampleShop',
  components: {
    ShoppingCart,
    ProductList,
  },
  models() {
    return {
      Inventory,
      Cart,
    }
  },
}
</script>
