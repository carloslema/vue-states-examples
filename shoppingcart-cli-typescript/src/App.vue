<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title v-text="'VUE-STATES/SHOPPINGCART'" />
    </v-toolbar>
    <v-content>
      <v-container>
        <example-shop />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import ExampleShop from '@/components/ExampleShop'

export default {
  name: 'App',
  components: {
    ExampleShop,
  },
}
</script>
