import Vue from 'vue'
import VueHistory from '@sum.cumo/vue-history'
import VueStates from '@sum.cumo/vue-states'
import globalModels from '@/models'

Vue.use(VueHistory, {
  feed: typeof window !== 'undefined',
})

Vue.use(VueStates, {
  mixins: [
    {
      history: true,
      abstract: true,
    },
  ],
  globalModels,
})
