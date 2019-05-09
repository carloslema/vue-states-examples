<template>
  <div>
    <h2 class="headline ma-2">Your Cart</h2>
    <p
      class="ma-2"
      v-show="!Cart.hasProducts"
    >
      <i>Please add some products to cart.</i>
    </p>
    <v-list three-line>
      <template v-for="(product) in Cart.cartProducts">
        <v-list-tile :key="product.id">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ product.title }}
            </v-list-tile-title>
            <v-list-tile-sub-title>
              {{ product.price.toFixed(2) }} € x {{ product.quantity }}
              =
              {{ product.price * product.quantity.toFixed(2) }} €
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              @click="Cart.removeProductFromCart(product.id)"
              icon
            >
              <v-icon>remove_shopping_cart</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider :key="`${product.id}_divider`" />
      </template>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            Total: {{ Cart.total.toFixed(2) }} €
            {{ Cart.checkoutStatus }}.
          </v-list-tile-title>
          <v-list-tile-sub-title v-show="Cart.checkoutStatus">
            Checkout
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-btn
            :disabled="!Cart.hasProducts"
            @click="() => Cart.checkout()"
            color="primary"
          >
            Checkout
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  injectModels: [
    'Cart',
  ],
})
export default class ShoppingCart extends Vue {
}
</script>
