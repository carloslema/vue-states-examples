import VueHistory from '@sum.cumo/vue-history'
import { Event } from '@sum.cumo/vue-history/dist/esm/types'
import VueStates from '@sum.cumo/vue-states'
import Vue from 'vue'

Vue.use(VueHistory, {
  feed: true,
  // strict: process.env.NODE_ENV !== 'production',
  onEvent: (callEvent: Event) => {
    // look for methods being finished before they fired all sub-methods
    if (callEvent.caller && callEvent.caller.done) {
      console.warn(
        'Method was called after parent method did already finish. Did you forget to await for setTimeout()?',
        { event: callEvent },
      )
    }
    // look for methods being finished before all fired sub-methods where finished as well
    callEvent.promise
      .then(() => {
        // search for unresolved subEvents
        const pending = callEvent.subEvents.filter(e => !e.done)
        if (pending.length) {
          console.warn(
            `Method resolved with ${pending.length} unfinished nested calls. Did you forget to await?`,
            { event: callEvent, pending },
          )
        }
      })
  },
})

Vue.use(VueStates, {
  // restoreOnReplace: true,
  mixins: [
    { history: true },
  ],
})
