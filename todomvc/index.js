Vue.use(VueStates.default, {
  mixins: [{ history: true }],
})

Vue.use(VueHistory, {
  feed: true,
  filter: event => {
    return event.callId !== 'save'
  },
})

function uid() {
  return Math.random().toString(16).substr(2)
}

// localStorage persistence
const STORAGE_KEY = 'todos-vue-states-1.0'

Vue.component('todo-input', {
  template: `<input
      class="new-todo"
      autofocus autocomplete="off"
      placeholder="What needs to be done?"
      v-model="newTodo"
      @keyup.enter="save"
    >`,
  data() {
    return { newTodo: '' }
  },
  methods: {
    save() {
      const value = this.newTodo.trim()
      if (!value) {
        return
      }
      this.newTodo = ''
      this.$emit('create', {
        title: value,
        completed: false,
      })
    },
  },
})

Vue.component('todo-item', {
  props: ['todo', 'editing'],
  data() {
    return {
      editValue: '',
    }
  },
  template: `
        <li
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing }"
        >
          <div class="view">
            <input 
              class="toggle" 
              type="checkbox" 
              :checked="todo.completed" 
              @change="changeCompleted"
            />
            <label @dblclick="startEdit">{{ todo.title }}</label>
            <button class="destroy" @click="$emit('remove')"></button>
          </div>
          <input
            class="edit" 
            type="text"
            :value="value"
            @change="e => editValue = e.target.value"
            @blur="done"
            @keyup.enter="done"
            @keyup.esc="finish"
          />
      </li>`,
  computed: {
    value() {
      return this.editing ? this.editValue : this.todo.title
    },
  },
  methods: {
    changeCompleted(e) {
      this.$emit('update', { completed: e.target.checked })
    },
    startEdit() {
      this.$emit('edit-init')
      this.editValue = this.todo.title
    },
    done() {
      this.editValue = this.editValue.trim()
      if (this.editValue) {
        this.$emit('update', { title: this.editValue })
        this.finish()
      }
    },
    finish() {
      this.editValue = ''
      this.$emit('edit-finish')
    },
  },
})

const filters = ['completed', 'active']

Vue.component('todo-list', {

  injectModels: [
    'Todos',
  ],

  template: `
    <ul class="todo-list">
      <todo-item
        v-for="todo in filtered"
        :todo="todo"
        :key="todo.id"
        :editing="todo.id === editing"
        @edit-init="editing = todo.id"
        @edit-finish="editing = null"
        @update="partial => Todos.update(todo.id, partial)"
        @remove="Todos.remove(todo.id)"
      />
    </ul>`,

  data() {
    return {
      filter: 'all',
      editing: null,
    }
  },

  mounted() {
    window.addEventListener('hashchange', this.onHashChange)
    this.onHashChange()
    this.$on('hook:beforeDestroy', () => {
      window.removeEventListener('hashchange', this.onHashChange)
    })
  },

  computed: {
    filtered() {
      return this.Todos.filteredMap[this.filter]
    },
  },

  methods: {
    setFilter(filter) {
      this.filter = filter
    },
    onHashChange() {
      const visibility = window.location.hash.replace(/#\/?/, '')
      this.setFilter(filters.includes(visibility)
        ? visibility
        : 'all',
      )
    },
  },
})

let app

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(app.$modelRegistry.exportState()))
}

const Todos = {
  data() {
    return { items: [] }
  },

  watch: {
    items: {
      handler: persist,
      deep: true,
    },
  },

  computed: {
    filteredMap() {
      const filtered = {
        all: this.items,
        active: [],
        completed: [],
      }
      this.items.forEach((todo) => {
        filtered[todo.completed ? 'completed' : 'active'].push(todo)
      })
      return filtered
    },
    allDone() {
      return !this.remaining
    },
    remaining() {
      return this.filteredMap.active.length
    }
  },

  methods: {
    create(todo) {
      this.items.push({
        id: uid(),
        ...todo,
      })
    },

    update(id, update) {
      const todo = this.items.find(el => el.id === id)
      if (todo) {
        Object.assign(todo, update)
      }
    },

    remove(id) {
      this.items.splice(this.items.findIndex(todo => todo.id === id), 1)
    },

    updateAll(update) {
      this.items.forEach(function (todo) {
        Object.assign(todo, update)
      })
    },

    removeCompleted() {
      this.items = this.filteredMap.active
    },
  },
}

const modelRegistry = new VueStates.Registry()

const stored = localStorage.getItem(STORAGE_KEY)

if(stored) {
  modelRegistry.importState(JSON.parse(stored))
}

// app Vue instance
app = new Vue({
  modelRegistry,
  models: {
    Todos,
  },
})

// mount
app.$mount('#app')
