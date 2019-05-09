<template>
  <div>
    <h2 class="headline ma-2">Products</h2>
    <v-list three-line>
      <div
        :key="product.id"
        v-for="(product, index) in Inventory.products"
      >
        <v-divider v-if="index !== 0" />
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ product.title }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ product.price.toFixed(2) }} € - {{ product.inventory }} left
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              icon
              :disabled="Inventory.productMap.get(product.id).inventory <= 0"
              @click="Cart.addProductToCart(product.id)"
            >
              <v-icon>add_shopping_cart</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </div>
    </v-list>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  injectModels: ['Inventory', 'Cart'],
})
export default class ProductList extends Vue {
}
</script>
