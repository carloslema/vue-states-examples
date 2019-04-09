<template>
  <v-layout
    row
    justify-center
    align-center
  >
    <v-flex>
      <v-card class="mb-2">
        <ProductList class="pa-3" />
      </v-card>
      <v-spacer />
      <v-card>
        <ShoppingCart class="pa-3" />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import ProductList from '../components/ProductList'
import ShoppingCart from '../components/ShoppingCart'

export default {
  components: {
    ShoppingCart,
    ProductList,
  },
}
</script>
