---
title: 【Vue】Tutorial
date: 2021-05-07 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - Vue
---


## Single File Component (SFC)

An SFC is a reusable self-contained block of code that encapsulates HTML, CSS and JavaScript that belong together, written inside a `.vue` file.

## declarative rendering

The core feature of Vue is **declarative rendering**: using a template syntax that extends HTML, we can describe how the HTML should look like based on JavaScript state. 

## Reactive

State that can trigger updates when changed are considered **reactive**. We can declare reactive state using Vue's `reactive()` API. Objects created from `reactive()` are JavaScript [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) that work just like normal objects.

`reactive()` only works on objects (including arrays and built-in types like `Map` and `Set`). `ref()`, on the other hand, can take any value type and create an object that exposes the inner value under a `.value` property.

Reactive state declared in the component's `<script setup>` block can be used directly in the template. 

 we did not need to use `.value` when accessing the `message` ref in templates: it is automatically unwrapped for more succinct usage.

```vue
<script setup>
const message = ref('Hello World!')
console.log(message.value)
</script>
<template>
<h1>
    {{message}}
    </h1>
</template>
```

## Directive

```vue
<script setup>
import { ref } from 'vue'

const titleClass = ref('title')
</script>

<template>
  <h1 v-bind:class='titleClass'>Make me red</h1> 
  <h1 :class='titleClass'>
      for short
    </h1>
</template>
```

A **directive** is a special attribute that starts with the `v-` prefix. They are part of Vue's template syntax. Similar to text interpolations, directive values are JavaScript expressions that have access to the component's state. 

## Event Listener

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
    
function increment() {
  // update component state
  count.value++
}
</script>

<template>
  <button v-on:click="increment">{{ count }}</button>
  <button @click="increment">for short</button>
</template>
```

## Two-Way bindings

```VUE
<script setup>
const text = ref('')
function onInput(e) {
  // a v-on handler receives the native DOM event
  // as the argument.
  text.value = e.target.value
}
</script>
<template>
<input :value="text" @input="onInput">
<input v-model="text"><!--for short-->
</template>
```

To simplify two-way bindings, Vue provides a directive, `v-model`, which is essentially a syntax sugar.

`v-model` automatically syncs the `<input>`'s value with the bound state, so we no longer need to use a event handler for that.

`v-model` works not only on text inputs, but also other input types such as checkboxes, radio buttons, and select dropdowns. 

## Conditional Rendering

We can use the `v-if` directive to conditionally render an element, we can also use `v-else` and `v-else-if` to denote other branches of the condition.

```vue
<script setup>
import { ref } from 'vue'

const awesome = ref(true)

function toggle() {
  awesome.value=!awesome.value
}
</script>

<template>
  <button @click="toggle">toggle</button>
  <h1 v-if='awesome'>Vue is awesome!</h1>
  <h1 v-else>Oh no 😢</h1>
</template>
```

## List Rendering

We can use the `v-for` directive to render a list of elements based on a source array

 we are also giving each todo object a unique `id`, and binding it as the [special `key` attribute](https://vuejs.org/api/built-in-special-attributes.html#key) for each `<li>`. The `key` allows Vue to accurately move each `<li>` to match the position of its corresponding object in the array.

There are two ways to update the list:

1. Call [mutating methods](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) on the source array
2. Replace the array with a new one

```vue
<script setup>
import { ref } from 'vue'

// give each todo a unique id
let id = 0

const newTodo = ref('')
const todos = ref([
  { id: id++, text: 'Learn HTML' },
  { id: id++, text: 'Learn JavaScript' },
  { id: id++, text: 'Learn Vue' }
])

function addTodo() {
  todos.value.push({ id: id++, text: newTodo.value })
  newTodo.value = ''
}

function removeTodo(todo) {
  todos.value = todos.value.filter((t) => t !== todo)
}
</script>

<template>
  <input v-model="newTodo" @keyup.enter="addTodo">
  <button @click="addTodo">Add Todo</button>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      {{ todo.text }}
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
</template>
```

## Computed property

We can create a computed ref that computes its `.value` based on other reactive data sources by using `computed()`

A computed property tracks other reactive state used in its computation as dependencies. It caches the result and automatically updates it when its dependencies change.

```vue
<script setup>
import { ref, computed } from 'vue'

let id = 0

const newTodo = ref('')
const hideCompleted = ref(false)
const todos = ref([
  { id: id++, text: 'Learn HTML', done: true },
  { id: id++, text: 'Learn JavaScript', done: true },
  { id: id++, text: 'Learn Vue', done: false }
])

const filteredTodos = computed(() => {
  return hideCompleted.value
    ? todos.value.filter((t) => !t.done)
    : todos.value
})

function addTodo() {
  todos.value.push({ id: id++, text: newTodo.value, done: false })
  newTodo.value = ''
}

function removeTodo(todo) {
  todos.value = todos.value.filter((t) => t !== todo)
}
</script>

<template>
  <input v-model="newTodo" @keyup.enter="addTodo" />
  <button @click="addTodo">Add Todo</button>
  <ul>
    <li v-for="todo in filteredTodos" :key="todo.id">
      <input type="checkbox" v-model="todo.done" />
      <span :class="{ done: todo.done }">{{ todo.text }}</span>
      <button @click="removeTodo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
    {{ hideCompleted ? 'Show all' : 'Hide completed' }}
  </button>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
```

## Lifecycle and Template Refs

We can request a **template ref** - i.e. a reference to an element in the template - using the [special `ref` attribute](https://vuejs.org/api/built-in-special-attributes.html#ref).

To access the ref, we need to declare a ref with matching name in `<script setup>` . Notice the ref is initialized with `null` value. This is because the element doesn't exist yet when `<script setup>` is executed. The template ref is only accessible after the component is **mounted**.

```vue
<script setup>
import { ref, onMounted } from 'vue'

const p = ref(null)

onMounted(() => {
  p.value.textContent = 'mounted!'
})
</script>

<template>
  <p ref="p">hello</p>
</template>
```

hooks such as `onUpdated` and `onUnmounted`  are lifecycle hooks.

## Watchers

Sometimes we may need to perform "side effects" reactively

`watch()` can directly watch a ref, and the callback gets called whenever `count`'s value changes.

```vue
<script setup>
import { ref, watch } from 'vue'

const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}

fetchData()

watch(todoId, fetchData)
</script>

<template>
  <p>Todo id: {{ todoId }}</p>
  <button @click="todoId++">Fetch next todo</button>
  <p v-if="!todoData">Loading...</p>
  <pre v-else>{{ todoData }}</pre>
</template>
```

## Props

A child component can accept input from the parent via **props**. First, it needs to declare the props it accepts:

```vue
<!-- ChildComp.vue -->
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Note `defineProps()` is a compile-time macro and doesn't need to be imported. Once declared, the `msg` prop can be used in the child component's template. It can also be accessed in JavaScript via the returned object of `defineProps()`.

## Emits

In addition to receiving props, a child component can also emit events to the parent:

```vue
<script setup>
// declare emitted events
const emitter = defineEmits(['response','test'])

// emit with argument
emitter('response', 'hello from child')
emitter('test', 'testtest')
</script>
```

The first argument to `emit()` is the event name. Any additional arguments are passed on to the event listener.

The parent can listen to child-emitted events using `v-on` - here the handler receives the extra argument from the child emit call and assigns it to local state:

```vue
<ChildComp @response="(msg) => childMsg = msg" />
```

## Slots

In addition to passing data via props, the parent component can also pass down template fragments to the child via **slots**.

In the child component, it can render the slot content from the parent using the `<slot>` element as outlet.

```vue
//parent
<template>
  <ChildComp>
    message to pass
  </ChildComp>
</template>


//child
<template>
<p>
    some word here
    </p>
<slot>
    message passed form parent will be present here, and this is the default words.
    </slot>
</template>
```



