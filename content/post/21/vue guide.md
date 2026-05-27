---
title: 【Vue】Guide
date: 2021-05-08 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - Vue
---

## Create an Application

Every Vue application starts by creating a new **application instance** with the [`createApp`](https://vuejs.org/api/application.html#createapp) function.

The object we are passing into `createApp` is in fact a component. Every app requires a "root component" that can contain other components as its children.

An application instance won't render anything until its `.mount()` method is called. It expects a "container" argument, which can either be an actual DOM element or a selector string

You are not limited to a single application instance on the same page. The `createApp` API allows multiple Vue applications to co-exist on the same page, each with its own scope for configuration and global assets

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

If you are using Vue to enhance server-rendered HTML and only need Vue to control specific parts of a large page, avoid mounting a single Vue application instance on the entire page. Instead, create multiple small application instances and mount them on the elements they are responsible for.

## Template Syntax

The double mustaches interprets the data as plain text, not HTML. In order to output real HTML, you will need to use the [`v-html` directive](https://vuejs.org/api/built-in-directives.html#v-html)

```vue
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

### dynamically binding multiple attributes

```vue
<script setup>
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}
</script>
<template>
<div v-bind="objectOfAttrs"></div>
<div :="objectOfAttrs">for short</div>
</template>
```

### Directives

Directives are special attributes with the `v-` prefix. Vue provides a number of [built-in directives](https://vuejs.org/api/built-in-directives.html)

It is also possible to use a JavaScript expression in a directive argument by wrapping it with square brackets.

#### Dynamic arguments

```vue
<a v-bind:[attributeName]="url"> ... </a>
<!-- shorthand -->
<a :[attributeName]="url"> ... </a>
```

Dynamic arguments are expected to evaluate to a string, with the exception of `null`. The special value `null` can be used to explicitly remove the binding. Any other non-string value will trigger a warning.

### Modifiers

Modifiers are special postfixes denoted by a dot, which indicate that a directive should be bound in some special way. For example, the `.prevent` modifier tells the `v-on` directive to call `event.preventDefault()` on the triggered event.

![directive syntax graph](https://vuejs.org/assets/directive.69c37117.png)

## Reactivity

We can create a reactive object or array with the [`reactive()`](https://vuejs.org/api/reactivity-core.html#reactive), and non-object by the `ref()`.

When you mutate reactive state, the DOM is updated automatically. However, it should be noted that the DOM updates are not applied synchronously. Instead, Vue buffers them until the "next tick" in the update cycle to ensure that each component needs to update only once no matter how many state changes you have made.

To wait for the DOM update to complete after a state change, you can use the [nextTick()](https://vuejs.org/api/general.html#nexttick) global API

```js
import { nextTick } from 'vue'

function increment() {
  count.value++
  nextTick(() => {
    // access updated DOM
  })
}
```

### Reactive Proxy

It is important to note that the returned value from `reactive()` is a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) of the original object, which is not equal to the original object.

Only the proxy is reactive - mutating the original object will not trigger updates. 

To ensure consistent access to the proxy, calling `reactive()` on the same object always returns **the same proxy**, and calling `reactive()` on an existing proxy also returns **that** **same proxy**

### Ref

The `reactive()` API has two limitations:

* It only works for object types
* we couldn't pass it around without losing reactivity.

 `ref()` allows us to create a "reference" to any value and pass it around without losing reactivity. 

When refs are accessed as **top-level properties** in the template, they are automatically "unwrapped" so there is no need to use `.value`.

## Computed Properties

For complex logic that includes reactive data, it is recommended to use a **computed property**. 

The `computed()` function expects to be passed a getter function, and the returned value is a **computed ref**.

A computed property automatically tracks its reactive dependencies. 

Instead of a computed property, we can define the same function as a method. For the end result, the two approaches are indeed **exactly the same**. However, the difference is that **computed properties are cached based on their reactive dependencies.** A computed property will only re-evaluate when **some of its reactive dependencies have changed**. This means as long as `author.books` has not changed, multiple access to `publishedBooksMessage` will immediately return the previously computed result without having to run the getter function again. In comparison, a method invocation will **always** run the function whenever a re-render happens.

This also means the following computed property will never update, because `Date.now()` is not a reactive dependency.

```js
const now = computed(() => Date.now())
```

### setter

Computed properties are by default getter-only. If you attempt to assign a new value to a computed property, you will receive a runtime warning. In the rare cases where you need a "writable" computed property, you can create one by providing both a getter and a setter:

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Note: we are using destructuring assignment syntax here.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

Now when you run `fullName.value = 'John Doe'`, the setter will be invoked and `firstName` and `lastName` will be updated accordingly.

## Class and Style Bindings

Vue provides special enhancements when `v-bind` is used with `class` and `style`. In addition to strings, the expressions can also evaluate to objects or arrays.

```vue
<div :class="{ active: isActive }"></div>
```

The above syntax means the presence of the `active` class will be determined by the [truthiness](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) of the data property `isActive`.  We can also bind to a [computed property](https://vuejs.org/guide/essentials/computed.html) that returns an object.

We can bind `:class` to an array to apply a list of classes

```vue
<div :class="[isActive ? activeClass : '', errorClass]"></div>
<div :class="[{ active: isActive }, errorClass]"></div>
```

### With Components

When you use the `class` attribute on a component with a **single root element**, those classes will be added to the component's root element, and merged with any existing class already on it.

If your component has **multiple root elements**, you would need to define which element will receive this class. You can do this using the `$attrs` component property

```vue
<p :class="$attrs.class">Hi!</p>
<span>This is a child component</span>
```

## Conditional Rendering

`v-if`,`v-else-if` and `v-else` can be used to attain conditional rendering and they also work for `<template>`.

The difference is that an element with `v-show` will always be rendered and remain in the DOM; `v-show` only toggles the `display` CSS property of the element.

`v-show` doesn't support the `<template>` element, nor does it work with `v-else`.

Generally speaking, `v-if` has higher toggle costs while `v-show` has higher initial render costs. So prefer `v-show` if you need to toggle something very often, and prefer `v-if` if the condition is unlikely to change at runtime.

It's **not** recommended to use `v-if` and `v-for` on the same element due to implicit precedence. Refer to [style guide](https://vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for) for details.

When `v-if` and `v-for` are both used on the same element, `v-if` will be evaluated first.

## List Rendering

For nested `v-for`, scoping also works similar to nested functions. Each `v-for` scope has access to parent scopes.

Similar to template `v-if`, you can also use a `<template>` tag with `v-for` to render a block of multiple elements.

```vue
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

When they exist on the same node, `v-if` has a higher priority than `v-for`. That means the `v-if` condition will not have access to variables from the scope of the `v-for`

This can be fixed by moving `v-for` to a wrapping `<template>` tag (which is also more explicit):

```vue
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

To give Vue a hint so that it can track each node's identity, and thus reuse and reorder existing elements, you need to provide a unique `key` attribute for each item

When using `<template v-for>`, the `key` should be placed on the `<template>` container

```vue
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

### with Components

You can directly use `v-for` on a component, like any normal element (don't forget to provide a `key`).

However, this won't automatically pass any data to the component, because components have isolated scopes of their own. In order to pass the iterated data into the component, we should also use props.

```vue
<my-component
  **v-for="(item, index) in items"**：item="item"
  **:index="index"**：key="item.id"
></my-component>
```

### Array Change

Vue wraps an observed array's mutation methods so they will also trigger view updates. The wrapped methods are:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

There are also non-mutating methods, e.g. `filter()`, `concat()` and `slice()`, which do not mutate the original array but **always return a new array**. When working with non-mutating methods, we should replace the old array with the new one.

Be careful with `reverse()` and `sort()` in a computed property! These two methods will mutate the original array, which should be avoided in computed getters. Create a copy of the original array before calling these methods.

```vue
- return numbers.reverse() //wrong
+ return [...numbers].reverse() //true
```

## Event Handling

We can use the `v-on` directive, which we typically shorten to the `@` symbol, to listen to DOM events and run some JavaScript when they're triggered. 

The handler value can be one of the following:

1. **Inline handlers:** Inline JavaScript to be executed when the event is triggered (similar to the native `onclick` attribute).
2. **Method handlers:** A property name or path that points to a method defined on the component.

```vue
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

The template compiler detects method handlers by checking whether the `v-on` value string is a valid JavaScript identifier or property access path.

Sometimes we also need to access the original DOM event in an inline handler. You can pass it into a method using the special `$event` variable, or use an inline arrow function.

```vue
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- using inline arrow function -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

### Event Modifiers

Recall that modifiers are directive postfixes denoted by a dot.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue
<!-- the click event's propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained, and the order matters-->
<a @click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form @submit.prevent></form>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div @click.self="doThat">...</div>
```

The `.capture`, `.once`, and `.passive` modifiers mirror the [options of the native `addEventListener` method](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters).

```vue
<!-- use capture mode when adding the event listener -->
<!-- i.e. an event targeting an inner element is handled here before being handled by that element -->
<div @click.capture="doThis">...</div>

<!-- the click event will be triggered at most once -->
<a @click.once="doThis"></a>

<!-- the scroll event's default behavior (scrolling) will happen -->
<!-- immediately, instead of waiting for `onScroll` to complete  -->
<!-- in case it contains `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

### Key Modifiers

You can directly use any valid key names exposed via [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values) as modifiers by converting them to kebab-case.

#### key aliases

Vue provides aliases for the most commonly used keys:

- `.enter`
- `.tab`
- `.delete` (captures both "Delete" and "Backspace" keys)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

#### System Modifier Keys

You can use the following modifiers to trigger mouse or keyboard event listeners only when the corresponding modifier key is pressed:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

Note that modifier keys are different from regular keys and when used with `keyup` events, they have to be pressed when the event is emitted. In other words, `keyup.ctrl` will only trigger if you release a key while holding down `ctrl`. It won't trigger if you release the `ctrl` key alone.

##### `.exact` Modifier

The `.exact` modifier allows control of the exact combination of system modifiers needed to trigger an event.

```vue
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

### Mouse Button Modifiers

- `.left`
- `.right`
- `.middle`

These modifiers restrict the handler to events triggered by a specific mouse button.

## Form Input Bindings

`v-model` will ignore the initial `value`, `checked` or `selected` attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using reactivity APIs.

## Lifecycle Hooks

There are also other hooks which will be called at different stages of the instance's lifecycle, with the most commonly used being [`onMounted`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted), [`onUpdated`](https://vuejs.org/api/composition-api-lifecycle.html#onupdated), and [`onUnmounted`](https://vuejs.org/api/composition-api-lifecycle.html#onunmounted).

![Component lifecycle diagram](https://vuejs.org/assets/lifecycle.16e4c08e.png)

## Watchs

With Composition API, we can use the [`watch` function](https://vuejs.org/api/reactivity-core.html#watch) to trigger a callback whenever a piece of reactive state changes.

`watch`'s first argument can be different types of reactive "sources": it can be a ref (including computed refs), a reactive object, a getter function, or an array of multiple sources.

```js
const x = ref(0)
const y = ref(0)

// single ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// array of multiple sources
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

Do note that you can't watch a property of a reactive object like this:

```js
const obj = reactive({ count: 0 })

// this won't work because we are passing a number to watch()
watch(obj.count, (count) => {
  console.log(`count is: ${count}`)
})
```

Instead, use a getter:

```js
// instead, use a getter:
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`)
  }
)
```

### watchEffect

`watchEffect()` allows us to perform a side effect immediately while automatically tracking the effect's reactive dependencies. 

`watch` and `watchEffect` both allow us to reactively perform side effects. Their main difference is the way they track their reactive dependencies:

- `watch` only tracks the explicitly watched source. It won't track anything accessed inside the callback. In addition, the callback only triggers when the source has actually changed. `watch` separates dependency tracking from the side effect, giving us more precise control over when the callback should fire.
- `watchEffect`, on the other hand, combines dependency tracking and side effect into one phase. It automatically tracks every reactive property accessed during its synchronous execution. This is more convenient and typically results in terser code, but makes its reactive dependencies less explicit.

By default, user-created watcher callbacks are called **before** Vue component updates. This means if you attempt to access the DOM inside a watcher callback, the DOM will be in the state before Vue has applied any updates.

If you want to access the DOM in a watcher callback **after** Vue has updated it, you need to specify the `flush: 'post'` option.

```js
watch(source, callback, {
  flush: 'post'
})

watchEffect(callback, {
  flush: 'post'
})
```

Post-flush `watchEffect()` also has a convenience alias, `watchPostEffect()`.

Watchers declared synchronously inside `setup()` or `<script setup>` are bound to the owner component instance, and will be automatically stopped when the owner component is unmounted. In most cases, you don't need to worry about stopping the watcher yourself.

The key here is that the watcher must be created **synchronously**: if the watcher is created in an async callback, it won't be bound to the owner component and must be stopped manually to avoid memory leaks.

To manually stop a watcher, use the returned handle function. This works for both `watch` and `watchEffect`.

Note that there should be very few cases where you need to create watchers asynchronously, and synchronous creation should be preferred whenever possible. If you need to wait for some async data, you can make your watch logic conditional instead.

## Template Refs

There may still be cases where we need direct access to the underlying DOM elements. To achieve this, we can use the special `ref` attribute:

```js
<input ref="input">
```

`ref` is a special attribute, similar to the `key` attribute discussed in the `v-for` chapter. It allows us to obtain a direct reference to a specific DOM element or child component instance after it's mounted.

To obtain the reference with Composition API, we need to declare a ref with the same name

## Components

### Registration

#### Global Registration

We can make components available globally in the current [Vue application](https://vuejs.org/guide/essentials/application.html) using the `app.component()` method.

If using SFCs, you will be registering the imported `.vue` files.

The `app.component()` method can be **chained**:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Globally registered components can be used in the template of any component within this application

##### drawbacks

* prevents build systems from removing unused components
* makes dependency relationships less explicit in large applications

#### Local Registration

When using SFC with `<script setup>`, imported components are automatically registered locally.

Note that **locally registered components are \*not\* also available in descendent components**.

### Props

Vue components require explicit props declaration so that Vue knows what external props passed to the component should be treated as fallthrough attributes.

In SFCs using `<script setup>`, props can be declared using the `defineProps()` macro.

### Events

#### $emit()

A component can emit custom events directly in template expressions (e.g. in a `v-on` handler) using the built-in `$emit` function.

```html
<button @click="$emit('someEvent')">click me</button>
```

The parent can then listen to it using `v-on`:

```html
<MyComponent @some-event="callback" />
```

Like components and props, event names provide an automatic case transformation. Like components and props, event names provide an automatic case transformation. 

> Unlike native DOM events, component emitted events do **not** bubble. You can only listen to the events emitted by a direct child component.

It's sometimes useful to emit a specific value with an event. 

> All extra arguments passed to `$emit()` after the event name will be forwarded to the listener. For example, with `$emit('foo', 1, 2, 3)` the listener function will receive three arguments.

#### `defineEmits`

Emitted events can be explicitly declared on the component via the [`defineEmits()`](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) macro.

### Fallthrough Attributes

A "fallthrough attribute" is an attribute or `v-on` event listener that is passed to a component, but is not explicitly declared in the receiving component's [props](https://vuejs.org/guide/components/props.html) or [emits](https://vuejs.org/guide/components/events.html#declaring-emitted-events). Common examples of this include `class`, `style`, and `id` attributes.

When a component renders a single root element, fallthrough attributes will be automatically added to the root element's attributes.

Unlike components with a single root node, components with multiple root nodes do not have an automatic attribute fallthrough behavior. If `$attrs` are not bound explicitly, a runtime warning will be issued.

#### `useAttrs`

If needed, you can access a component's fallthrough attributes in `<script setup>` using the `useAttrs()` API:

```js
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

### Provider/inject

#### Prop Drilling



![prop drilling diagram](https://vuejs.org/assets/prop-drilling.11201220.png)



We can solve props drilling with `provide` and `inject`. A parent component can serve as a **dependency provider** for all its descendants. Any component in the descendant tree, regardless of how deep it is, can **inject** dependencies provided by components up in its parent chain.

![Provide/inject scheme](https://vuejs.org/assets/provide-inject.3e0505e4.png)

#### Provide

```js
provide(/* key */ 'message', /* value */ 'hello!')
```

The `provide()` function accepts two arguments. The first argument is called the **injection key**, which can be a string or a `Symbol`. The injection key is used by descendent components to lookup the desired value to inject. A single component can call `provide()` multiple times with different injection keys to provide different values.

The second argument is the provided value. The value can be of any type, including reactive state such as refs.

#### Inject

```js
const message = inject('message')
```



To inject data provided by an ancestor component, use the [`inject()`](https://vuejs.org/api/composition-api-dependency-injection.html#inject) function.

If the provided value is a ref, it will be injected as-is and will **not** be automatically unwrapped. This allows the injector component to **retain the reactivity connection** to the provider component.

By default, `inject` assumes that the injected key is provided somewhere in the parent chain. In the case where the key is not provided, there will be a runtime warning.

If we want to make an injected property work with optional providers, we need to declare a default value, similar to props

```js
const value = inject('message', 'default value')
```

 **It is recommended to keep any mutations to reactive state inside of the \*provider\* whenever possible**.

There may be times when we need to update the data from a injector component. In such cases, we recommend providing a function that is responsible for mutating the state.

```js
provide('location', {
  location,
  updateLocation
})
```

Finally, you can wrap the provided value with [`readonly()`](https://vuejs.org/api/reactivity-core.html#readonly) if you want to ensure that the data passed through `provide` cannot be mutated by the injected component.

```js
provide('read-only-count', readonly(count))
```

symbol

```js
const myInjectionKey = Symbol()
provide(myInjectionKey, {
  /* data to provide */
})
const injected = inject(myInjectionKey)
```

### Async Components

In large applications, we may need to divide the app into smaller chunks and only load a component from the server when it's needed. To make that possible, Vue has a [`defineAsyncComponent`](https://vuejs.org/api/general.html#defineasynccomponent) function.

```js
const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...load component from server
    resolve(/* loaded component */)
  })
})
// ... use `AsyncComp` like a normal component
```

[ES module dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) also returns a Promise, so most of the time we will use it in combination with `defineAsyncComponent`. Bundlers like Vite and webpack also support the syntax, so we can use it to import Vue SFCs.

```js
const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

#### Loading and Error States

```js
const AsyncComp = defineAsyncComponent({
  // the loader function
  loader: () => import('./Foo.vue'),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

## Reusability

### Composables

In the context of Vue applications, a "composable" is a function that leverages Vue Composition API to encapsulate and reuse **stateful logic**.

```js
export function useMouse() {
  // state encapsulated and managed by the composable
  const x = ref(0)
  const y = ref(0)

  // a composable can update its managed state over time.
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  // a composable can also hook into its owner component's
  // lifecycle to setup and teardown side effects.
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  // expose managed state as return value
  return { x, y }
}
```

extract the logic into an external file, as a composable function.

The cooler part about composables though, is that you can also nest them: one composable function can call one or more other composable functions. This enables us to compose complex logic using small, isolated units, similar to how we compose an entire application using components.

```js
export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  function doFetch() {
    // reset state before fetching..
    data.value = null
    error.value = null
    // unref() unwraps potential refs
    fetch(unref(url))
      .then((res) => res.json())
      .then((json) => (data.value = json))
      .catch((err) => (error.value = err))
  }

  if (isRef(url)) {
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // otherwise, just fetch once
    // and avoid the overhead of a watcher
    doFetch()
  }

  return { data, error }
}
```

 `<script setup>`  is the only place where you can call composables after usage of await. The compiler automatically restores the active instance context after the async operation for you.

To some extent, you can think of these extracted cas component-scoped services that can talk to one another.

### Custom Directives

In addition to the default set of directives shipped in core (like `v-model` or `v-show`), Vue also allows you to register your own custom directives.

We have introduced two forms of code reuse in Vue: [components](https://vuejs.org/guide/essentials/component-basics.html) and [composables](https://vuejs.org/guide/reusability/composables.html). Components are the main building blocks, while composables are focused on reusing stateful logic. Custom directives, on the other hand, are mainly intended for reusing logic that involves low-level DOM access on plain elements.

A custom directive is defined as an object containing lifecycle hooks similar to those of a component.

In `<script setup>`, any camelCase variable that starts with the `v` prefix can be used as a custom directive. In the example above, `vFocus` can be used in the template as `v-focus`.

```js
const myDirective = {
  // called before bound element's attributes
  // or event listeners are applied
  created(el, binding, vnode, prevVnode) {
    // see below for details on arguments
  },
  // called right before the element is inserted into the DOM.
  beforeMount() {},
  // called when the bound element's parent component
  // and all its children are mounted.
  mounted() {},
  // called before the parent component is updated
  beforeUpdate() {},
  // called after the parent component and
  // all of its children have updated
  updated() {},
  // called before the parent component is unmounted
  beforeUnmount() {},
  // called when the parent component is unmounted
  unmounted() {}
  }
}
```

Directive hooks are passed these arguments:

- `el`: the element the directive is bound to. This can be used to directly manipulate the DOM.
- `binding`: an object containing the following properties.
  - `value`: The value passed to the directive. For example in `v-my-directive="1 + 1"`, the value would be `2`.
  - `oldValue`: The previous value, only available in `beforeUpdate` and `updated`. It is available whether or not the value has changed.
  - `arg`: The argument passed to the directive, if any. For example in `v-my-directive:foo`, the arg would be `"foo"`.
  - `modifiers`: An object containing modifiers, if any. For example in `v-my-directive.foo.bar`, the modifiers object would be `{ foo: true, bar: true }`.
  - `instance`: The instance of the component where the directive is used.
  - `dir`: the directive definition object.
- `vnode`: the underlying VNode representing the bound element.
- `prevNode`: the VNode representing the bound element from the previous render. Only available in the `beforeUpdate` and `updated` hooks.

It is also common to globally register custom directives at the app level.

```js
app.directive('focus', {
  /* ... */
})
```

> Custom directives should only be used when the desired functionality can only be achieved via direct DOM manipulation. Prefer declarative templating using built-in directives such as `v-bind` when possible because they are more **efficient** and **server-rendering friendly**.

#### shorthand

It's common for a custom directive to have the same behavior for `mounted` and `updated`, with no need for the other hooks. In such cases we can define the directive as a function:

```js
app.directive('color', (el, binding) => {
  // this will be called for both `mounted` and `updated`
  el.style.color = binding.value
})
```

When used on components, custom directives will always apply to a component's root node, similar to **[Fallthrough Attributes](https://vuejs.org/guide/components/attrs.html).**

```html
<MyComponent v-demo="test" />
<!-- template of MyComponent -->

<div> <!-- v-demo directive will be applied here -->
  <span>My component content</span>
</div>
```

Note that components can potentially have more than one root node. When applied to a multi-root component, a directive will be ignored and a warning will be thrown. Unlike attributes, directives can't be passed to a different element with `v-bind="$attrs"`. In general, it is **not** recommended to use custom directives on components.

### Plugins

Plugins are self-contained code that usually add app-level functionality to Vue. This is how we install a plugin:

```js
import { createApp } from 'vue'

const app = createApp({})

app.use(myPlugin, {
  /* optional options */
})
```

A plugin is defined as either an object that exposes an `install()` method, or simply a function that acts as the install function itself. The install function receives the [app instance](https://vuejs.org/api/application.html) along with additional options passed to `app.use()`, if any:

```js
const myPlugin = {
  install(app, options) {
    // configure the app
  }
}
```

There is no strictly defined scope for a plugin, but common scenarios where plugins are useful include:

1. Register one or more global components or custom directives with [`app.component()`](https://vuejs.org/api/application.html#app-component) and [`app.directive()`](https://vuejs.org/api/application.html#app-directive).
2. Make a resource [injectable](https://vuejs.org/guide/components/provide-inject.html) throughout the app by calling [`app.provide()`](https://vuejs.org/api/application.html#app-provide).
3. Add some global instance properties or methods by attaching them to [`app.config.globalProperties`](https://vuejs.org/api/application.html#app-config-globalproperties).
4. A library that needs to perform some combination of the above (e.g. [vue-router](https://github.com/vuejs/vue-router-next)).

## Built-in

### Transition

Vue offers two built-in components that can help work with transitions and animations in response to changing state:

- `<Transition>` for applying animations when an element or component is entering and leaving the DOM.
- `<TransitionGroup>` for applying animations when an element or component is inserted into, removed from, or moved within a `v-for` list.

`<Transition>` only supports a single element or component as its slot content. If the content is a component, the component must also have only one single root element.

When an element in a `<Transition>` component is inserted or removed, this is what happens:

1. Vue will automatically sniff whether the target element has **CSS transitions or animations** applied. If it does, a number of [CSS transition classes](https://vuejs.org/guide/built-ins/transition.html#transition-classes) will be added / removed at appropriate timings.
2. If there are **listeners** for [JavaScript hooks](https://vuejs.org/guide/built-ins/transition.html#javascript-hooks), these hooks will be called at appropriate timings.
3. If no CSS transitions / animations are detected and no JavaScript hooks are provided, the DOM operations for insertion and/or removal will be executed **on the browser's next animation frame**.

![Transition Diagram](https://vuejs.org/assets/transition-classes.f0f7b3c9.png)

1. `v-enter-from`: Starting state for enter. Added before the element is inserted, removed one frame after the element is inserted.
2. `v-enter-active`: Active state for enter. Applied during the entire entering phase. Added before the element is inserted, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the entering transition.
3. `v-enter-to`: Ending state for enter. Added one frame after the element is inserted (at the same time `v-enter-from` is removed), removed when the transition/animation finishes.
4. `v-leave-from`: Starting state for leave. Added immediately when a leaving transition is triggered, removed after one frame.
5. `v-leave-active`: Active state for leave. Applied during the entire leaving phase. Added immediately when a leave transition is triggered, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the leaving transition.
6. `v-leave-to`: Ending state for leave. Added one frame after a leaving transition is triggered (at the same time `v-leave-from` is removed), removed when the transition/animation finishes.

For a named transition, its transition classes will be prefixed with its name instead of `v`.

```vue
<Transition name="fade">
  ...
</Transition>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### TransitionGroup

`<TransitionGroup>` is a built-in component designed for animating the insertion, removal, and order change of elements or components that are rendered in a list.

### KeepAlive

`<KeepAlive>` is a built-in component that allows us to **conditionally cache component instances** (to keep the state) when dynamically switching between multiple components.

```vue
<!-- Inactive components will be cached! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

### Teleport

`<Teleport>` is a built-in component that allows us to "teleport" a part of a component's template into a DOM node that exists outside the DOM hierarchy of that component.

### Suspense

……
