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
import Vue from 'vue'
import Component from 'vue-class-component'

import ExampleShop from '@/components/ExampleShop'

@Component({
  name: 'App',
  components: {
    ExampleShop,
  },
})

export default class App extends Vue {
}
</script>
