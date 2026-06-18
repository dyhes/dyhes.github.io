---
title: 【React】Basics
date: 2021-05-01 00:00:00+0000
categories: 
- nutrition
- temple
tags:
    - React
---

## JSX

 JSX is a **syntax extension** to JavaScript. it is recomended to use with React to describe **what the UI should look like**. JSX may remind you of a template language, but it comes with the full power of JavaScript.

Since JSX is closer to JavaScript than to HTML, React DOM uses `camelCase` property naming convention instead of HTML attribute names.

Babel compiles JSX down to `React.createElement()` calls.

```jsx
//before
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
//after compilation
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

### In-depth

* **Choosing the Type at Runtime**

  You cannot use a general expression as the React element type. If you do want to use a general expression to indicate the type of the element, just assign it to a capitalized variable first. This often comes up when you want to render a different component based on a prop:

  ```jsx
  import React from 'react';
  import { PhotoStory, VideoStory } from './stories';
  const components = {
    photo: PhotoStory,
    video: VideoStory
  };
  function Story(props) {
    // Correct! JSX type can be a capitalized variable.
    const SpecificStory = components[props.storyType];
    return <SpecificStory story={props.story} />;
  }
  ```
  
* **Props default to 'true'**

  ```jsx
  <MyTextBox autocomplete />
  //equals to
  <MyTextBox autocomplete={true} />
  ```

  In general, we don’t recommend *not* passing a value for a prop, because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

* **Spread Attributes**

  In general, we don’t recommend *not* passing a value for a prop, because it can be confused with the [ES6 object shorthand](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` which is short for `{foo: foo}` rather than `{foo: true}`. This behavior is just there so that it matches the behavior of HTML.

  ```jsx
  function App1() {
    return <Greeting firstName="Ben" lastName="Hector" />;
  }
  //equals to
  function App2() {
    const props = {firstName: 'Ben', lastName: 'Hector'};
    return <Greeting {...props} />;
  }
  //eg2
  const Button = props => {
    const { kind, ...other } = props;
    const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
    return <button className={className} {...other} />;
  };
  ```
  
* **Children**

  In JSX expressions that contain both an opening tag and a closing tag, the content between those tags is passed as a special prop: `props.children`.

  * **Boolean**

    `false`, `null`, `undefined`, and `true` are valid children. They simply don’t render. This can be useful to conditionally render React elements.

    ```jsx
    <div>
      {showHeader && <Header />}
      <Content />
    </div>
    ```

    Conversely, if you want a value like false, true, null, or undefined to appear in the output, you have to convert it to a string first:

    ```jsx
    <div>
      My JavaScript variable is {String(myVariable)}.
    </div>
    ```

  * **String Literals**

    You can put a string between the opening and closing tags and `props.children` will just be that string. HTML is unescaped, so you can generally write JSX just like you would write HTML.

    ```jsx
    <MyComponent>
        <div>This is valid HTML &amp; JSX at the same time.</div>
    </MyComponent>
    ```

    JSX removes whitespace at the beginning and ending of a line. It also removes blank lines. New lines adjacent to tags are removed; new lines that occur in the middle of string literals are condensed into a single space.

  * **JSX**

    You can provide more JSX elements as the children. This is useful for displaying nested components.

    ```jsx
    <MyContainer>
      <MyFirstComponent />
      <MySecondComponent />
    </MyContainer>
    ```

  * **JS Expression**

    You can pass any JavaScript expression as children, by enclosing it within `{}`.

## Components

Components let you split the UI into independent, reusable pieces, and think about each piece in isolation. 

Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.

> **Note:** **Always start component names with a capital letter.**

* **Function Component**

  ```js
  function Welcome(props) {
    return <h1>Hello, {props.name}</h1>;
  }
  
  const element = <Welcome name="Sara" />;
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
  ```

* **Class Component**

  ```jsx
  class Welcome extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  }
  const element = <Welcome/>;
  ReactDOM.render(
    element,
    document.getElementById('root')
  )
  
  //with state
  class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }
  
    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }
  
  ReactDOM.render(
    <Clock />,
    document.getElementById('root')
  );
  
  //with method
  class Toggle extends React.Component {
    constructor(props) {
      super(props);
      this.state = {isToggleOn: true};
  
      // This binding is necessary to make `this` work in the callback
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      this.setState(prevState => ({
        isToggleOn: !prevState.isToggleOn
      }));
    }
  
    render() {
      return (
        <button onClick={this.handleClick}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </button>
      );
    }
  }
  
  ReactDOM.render(
    <Toggle />,
    document.getElementById('root')
  );
  ```
  

## Lifecycle Methods


include less used method


[more detail...]([React lifecycle methods diagram (wojtekmaj.pl)](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/))

## Hooks

*Hooks* are a new addition in **React 16.8**. They let you use state and other React features without writing a class.

### `useState`

```js
 const [state, setState] = useState(initialState);
```


Returns a stateful value, and a function to update it.

During the initial render, the returned state (state) is the same as the value passed as the first argument (initialState).

The setState function is used to update the state. It accepts a new state value and enqueues a re-render of the component.

If the new state is computed using the previous state, you can pass a function to `setState`. The function will receive the previous value, and return an updated value. 

```jsx
<button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
```

>Unlike the `setState` method found in class components, `useState` does not automatically merge update objects. You can replicate this behavior by combining the function updater form with object spread syntax:

```js
const [state, setState] = useState({});
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
```

> Another option is `useReducer`, which is more suited for managing state objects that contain multiple sub-values.

The `initialState` argument is the state used during the initial render. In subsequent renders, it is disregarded. If the initial state is the result of an expensive computation, you may provide a function instead, which will be executed only on the initial render:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});

```

If you update a State Hook to the same value as the current state, React will bail out without rendering the children or firing effects.

Note that React may still need to render that specific component again before bailing out. That shouldn’t be a concern because React won’t unnecessarily go “deeper” into the tree. If you’re doing expensive calculations while rendering, you can optimize them with `useMemo`.

### `useEffect`

```
useEffect(didUpdate);
```

Accepts a **function** that contains **imperative, possibly effectful code**.

Mutations, subscriptions, timers, logging, and other side effects are **not allowed inside the main body** of a function component (referred to as React’s ***render phase***). Doing so will lead to confusing bugs and inconsistencies in the UI.

Instead, use `useEffect`. The function passed to `useEffect` will **run after the render is committed to the screen**. Think of effects as an escape hatch from React’s purely functional world into the imperative world.

By default, effects **run after every completed render**, but you can choose to fire them [only when certain values have changed](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).

#### Cleaning up an effect

Often, effects create resources that need to be cleaned up **before** the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to `useEffect` may **return a clean-up function**. For example, to create a subscription:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

The clean-up function **runs before the component is removed from the UI** to prevent memory leaks. Additionally, if a component renders multiple times (as they typically do), the **previous effect is cleaned up before executing the next effect**. In our example, this means **a new subscription is created on every update**. To avoid firing an effect on every update, refer to the next section.

#### Timing of effects

Unlike `componentDidMount` and `componentDidUpdate`, the function passed to `useEffect` fires **after** layout and paint, during a **deferred event**. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn’t block the browser from updating the screen.

However, not all effects can be deferred. For example, a DOM mutation that is visible to the user must fire synchronously before the next paint so that the user does not perceive a visual inconsistency. (The distinction is conceptually similar to passive versus active event listeners.) For these types of effects, React provides one additional Hook called [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect). It has the same signature as `useEffect`, and **only differs in when it is fired**.

Additionally, starting in **React 18**, the function passed to `useEffect` will fire synchronously **before** layout and paint **when it’s the result of a discrete user input** such as a click, or when it’s the result of an update wrapped in [`flushSync`](https://reactjs.org/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](https://reactjs.org/docs/react-dom.html#flushsync).

> **Note** : This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect), which fires the function and processes the updates inside of it immediately.

Even in cases where `useEffect` is deferred until after the browser has painted, it’s guaranteed to fire **before any new renders**. React will always flush a previous render’s effects before starting a new update.

#### Conditionally firing an effect

The default behavior for effects is to fire the effect after every completed render. That way an effect is always recreated if one of its dependencies changes.

However, this may be overkill in some cases, like the subscription example from the previous section. We don’t need to create a new subscription on every update, only if the `source` prop has changed.

To implement this, **pass a second argument to `useEffect` that is the array of values that the effect depends on**. Our updated example now looks like this:

```
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Now the subscription will only be recreated when `props.source` changes.

> Note
>
> If you use this optimization, make sure the array includes **all values from the component scope (such as props and state) that change over time and that are used by the effect**. Otherwise, your code will reference stale values from previous renders. Learn more about [how to deal with functions](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) and what to do when the [array values change too often](https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often).
>
> If you want to run an effect and clean it up **only once (on mount and unmount)**, you can pass an empty array (`[]`) as a second argument. This tells React that your effect doesn’t depend on *any* values from props or state, so it never needs to re-run. This isn’t handled as a special case — it follows directly from how the dependencies array always works.
>
> If you pass an empty array (`[]`), the props and state inside the effect **will always have their initial values**. While passing `[]` as the second argument is closer to the familiar `componentDidMount` and `componentWillUnmount` mental model, there are usually [better](https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [solutions](https://reactjs.org/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) to avoid re-running effects too often. Also, don’t forget that React defers running `useEffect` until after the browser has painted, so doing extra work is less of a problem.
>
> We recommend using the [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) rule as part of our [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) package. It warns when dependencies are specified incorrectly and suggests a fix.

The array of dependencies is not passed as arguments to the effect function. Conceptually, though, that’s what they represent: **every value referenced inside the effect function should also appear in the dependencies array**. In the future, a sufficiently advanced compiler could create this array automatically.

### `useContext`

```js
const value = useContext(MyContext);
```

Accepts a context object (the value returned from `React.createContext`) and returns the current context value for that context. The current context value is determined by the `value` prop of the nearest `<MyContext.Provider>` above the calling component in the tree.

Don’t forget that the argument to `useContext` must be the *context object itself*:

- **Correct:** `useContext(MyContext)`
- **Incorrect:** `useContext(MyContext.Consumer)`
- **Incorrect:** `useContext(MyContext.Provider)`

### Rules of Hooks

Hooks are JavaScript functions, but you need to follow two rules when using them.

* Only Call Hooks **at the Top Leve**l

  **Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, **before any early returns**. By following this rule, you ensure that Hooks are called in the same order each time a component renders. That’s what allows React to correctly preserve the state of Hooks between multiple `useState` and `useEffect` calls.

* Only Call Hooks **from React Functions**

  **Don’t call Hooks from regular JavaScript functions.** Instead, you can:

  - ✅ Call Hooks from React function components.
  - ✅ Call Hooks from custom Hooks

  By following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

### Custom Hooks

Building your own Hooks lets you extract component logic into reusable functions.

Traditionally in React, we’ve had two popular ways to share stateful logic between components: [render props](https://reactjs.org/docs/render-props.html) and [higher-order components](https://reactjs.org/docs/higher-order-components.html). We will now look at how Hooks solve many of the same problems without forcing you to add more components to the tree.

**A custom Hook is a JavaScript function whose name starts with ”`use`” and that may call other Hooks.**

```jsx
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}




function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}

function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Unlike a React component, a custom Hook doesn’t need to have a specific signature. We can decide what it takes as arguments, and what, if anything, it should return. In other words, it’s just like a normal function. 

## Lists

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);



//using index
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
//We don’t recommend using indexes for keys if the order of items may change. This can negatively impact performance and may cause issues with component state.
```

Keys help React identify which items have changed, are added, or are removed.

## Forms

### Controlled Components

In HTML, form elements such as `<input>`, `<textarea>`, and `<select>` typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with [`setState()`](https://reactjs.org/docs/react-component.html#setstate).

We can combine the two by making the React state be the “single source of truth”. Then **the React component that renders a form also controls what happens in that form on subsequent user input.** An input form element whose value is controlled by React in this way is called a “controlled component”.

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Since the `value` attribute is set on our form element, the displayed value will always be `this.state.value`, making the React state the source of truth. Since `handleChange` runs on every keystroke to update the React state, the displayed value will update as the user types.

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, we can use [uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html), an alternative technique for implementing input forms.

### Uncontrolled Components

In most cases, we recommend using [controlled components](https://reactjs.org/docs/forms.html#controlled-components) to implement forms. In a controlled component, form data is handled by a React component. The alternative is uncontrolled components, where form data is handled by the DOM itself.

To write an uncontrolled component, instead of writing an event handler for every state update, you can [use a ref](https://reactjs.org/docs/refs-and-the-dom.html) to get form values from the DOM.

In the React rendering lifecycle, the `value` attribute on form elements will override the value in the DOM. With an uncontrolled component, you often want React to specify the initial value, but leave subsequent updates uncontrolled. To handle this case, you can specify a `defaultValue` attribute instead of `value`. Changing the value of `defaultValue` attribute after a component has mounted will not cause any update of the value in the DOM.

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              defaultValue="Bob"
              type="text"
              ref={this.input} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
}
```

## Lifting state up

In React, sharing state is accomplished by moving it up to the closest common ancestor of the components that need it. This is called “lifting state up”. 

## Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language.

Context is primarily used when some data needs to be accessible by *many* components at different nesting levels. Apply it sparingly because it makes component reuse more difficult. **If you only want to avoid passing some props through many levels, [component composition](https://reactjs.org/docs/composition-vs-inheritance.html) is often a simpler solution than context.**

Using context, we can avoid passing props through intermediate elements:

```jsx
// Context lets us pass a value deep into the component tree without explicitly threading it through every component.

// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.    
      // Any component can read it, no matter how deep it is.    
      // In this example, we're passing "dark" as the current value.    
      return (
      <ThemeContext.Provider value="dark">        
              <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // Assign a contextType to read the current theme context.  
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".  
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;  }
}
```

### API

#### `React.createContext`

```js
const MyContext = React.createContext(defaultValue);
```

Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the closest matching `Provider` above it in the tree.

The `defaultValue` argument is **only** used when **a component does not have a matching Provider above it in the tree**. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.

#### `Context.Provider`

```js
<MyContext.Provider value={/* some value */}>
```

Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.

The Provider component accepts a `value` prop to be passed to consuming components that are descendants of this Provider. One Provider can be connected to many consumers. Providers can be nested to **override values** deeper within the tree.

All consumers that are descendants of a Provider will re-render whenever the Provider’s `value` prop changes. The propagation from Provider to its descendant consumers (including [`.contextType`](https://reactjs.org/docs/context.html#classcontexttype) and [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)) is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component skips an update.

#### `Class.contextType`

```js
const MyContext = React.createContext(defaultValue);
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* render something based on the value */
  }
}
```

The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](https://reactjs.org/docs/context.html#reactcreatecontext). Using this property lets you **consume the nearest current value of that Context type using `this.context`**. You can reference this in any of the lifecycle methods including the render function.

> You can only subscribe to a single context using this API. If you need to read more than one see [Consuming Multiple Contexts](https://reactjs.org/docs/context.html#consuming-multiple-contexts).

#### `Context.Consumer`

```jsx
<MyContext.Consumer>
  {value => /* render something based on the context value */}
</MyContext.Consumer>
```

A React component that subscribes to context changes. Using this component lets you subscribe to a context within a **function component**.

**Requires a function as a child**. The function receives the current context value and returns a React node. The value argument passed to the function will be equal to the value prop of the closest Provider for this context above in the tree. If there is no Provider for this context above, the value argument will be equal to the defaultValue that was passed to createContext().

#### `Context.displayName`

Context object accepts a displayName string property. React DevTools uses this string to determine what to display for the context.

For example, the following component will appear as MyDisplayName in the DevTools:

```js
const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Error Boundaries

A JavaScript error in a part of the UI shouldn’t break the whole app. To solve this problem for React users, React 16 introduces a new concept of an “error boundary”.

Error boundaries are React components that **catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI** instead of the component tree that crashed. Error boundaries catch errors **during rendering, in lifecycle methods, and in constructors of the whole tree below them**.

>Error boundaries do **not** catch errors for:
>
>- Event handlers 
>
>  React doesn’t need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the event handlers don’t happen during rendering. So if they throw, React still knows what to display on the screen. If you need to catch an error inside an event handler, use the regular JavaScript `try` / `catch` statement
>
>- Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame` callbacks)
>
>- Server side rendering
>
>- Errors thrown in the error boundary itself (rather than its children)

A class component becomes an error boundary if it defines either (or both) of the lifecycle methods static `getDerivedStateFromError()` or `componentDidCatch()`. Use static `getDerivedStateFromError() `to render a fallback UI after an error has been thrown. Use `componentDidCatch() `to log error information.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}



<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Error boundaries work like a JavaScript `catch {}` block, but for components. **Only class components** can be error boundaries. In practice, most of the time you’ll want to declare an error boundary component once and use it throughout your application.

Note that **error boundaries only catch errors in the components below them in the tree**. An error boundary can’t catch an error within itself. If an error boundary fails trying to render the error message, the error will propagate to the closest error boundary above it. 

**As of React 16, errors that were not caught by any error boundary will result in unmounting of the whole React component tree.**

## Ref

Refs provide a way to **access DOM nodes or React elements** created in the render method.

In the typical React dataflow, **props** are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively **modify a child outside of the typical dataflow**. 

There are a few good use cases for refs:

- Managing focus, text selection, or media playback.
- Triggering imperative animations.
- Integrating with third-party DOM libraries.

> Avoid using refs for anything that can be done declaratively！

### Create

Refs are created using `React.createRef()` and attached to React elements via the `ref` attribute. Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component.

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
```

By default, **you may not use the `ref` attribute on function components** because they don’t have instances:

If you want to allow people to take a `ref` to your function component, you can 

* use [`forwardRef`](https://reactjs.org/docs/forwarding-refs.html) (possibly in conjunction with [`useImperativeHandle`](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)),
* or convert the component to a class.

You can, however, **use the `ref` attribute inside a function component** as long as you refer to a DOM element or a class component

```jsx
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  const textInput = useRef(null);
  
  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Access

The value of the ref differs depending on the type of the node:

- When the `ref` attribute is used on an HTML element, the `ref` created in the constructor with `React.createRef()` receives the underlying DOM element as its `current` property.
- When the `ref` attribute is used on a custom class component, the `ref` object receives the mounted instance of the component as its `current`.
- **You may not use the `ref` attribute on function components** because they don’t have instances.

### Ref forwarding

Ref forwarding is a technique for automatically passing a [ref](https://reactjs.org/docs/refs-and-the-dom.html) through a component to one of its children. **Ref forwarding lets components opt into exposing any child component’s ref as their own**. 

**Ref forwarding is an opt-in feature that lets some components take a `ref` they receive, and pass it further down (in other words, “forward” it) to a child.**

In the example below, `FancyButton` uses `React.forwardRef` to obtain the `ref` passed to it, and then forward it to the DOM `button` that it renders:

```jsx
const FancyButton = React.forwardRef((props, ref) => (  <button ref={ref} className="FancyButton">    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly.

>Note: The second `ref` argument only exists when you define a component with `React.forwardRef` call. Regular function or class components don’t receive the `ref` argument, and ref is not available in props either.

Ref forwarding is not limited to DOM components. You can forward refs to class component instances, too.

### Callback Refs

React also supports another way to set refs called “callback refs”, which gives more fine-grain control over when refs are set and unset.

Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere.

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

> **NOTE**: If the `ref` callback is defined as an inline function, it will **get called twice during updates**, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn’t matter in most cases.

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

```jsx
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

### Legacy API: String Refs

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a **string**, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**.

## Fragment

Fragment is a common pattern in React is for a component to return multiple elements. Fragments let you group a list of children without adding extra nodes to the DOM.

```jsx
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

short syntax

```jsx
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

You can use `<></>` the same way you’d use any other element except that it doesn’t support keys or attributes.

### Keyed Fragments

Fragments declared with the explicit `<React.Fragment>` syntax may have keys. A use case for this is mapping a collection to an array of fragments — for example, to create a description list:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Without the `key`, React will fire a key warning
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key` is the only attribute that can be passed to `Fragment`. 

## High-Order Components

A higher-order component (HOC) is an advanced technique in React for reusing component logic. HOCs are not part of the React API, per se. They are a pattern that emerges from React’s compositional nature.

Concretely, **a higher-order component is a function that takes a component and returns a new component.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

HOCs are common in third-party React libraries, such as Redux’s [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) and Relay’s [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer).



For example we can imagine that in a large app, the same pattern of subscribing to `DataSource` and calling `setState` will occur over and over again. We want an abstraction that allows us to define this logic in a single place and share it across many components. This is where higher-order components excel.

```jsx
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}




const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

The first parameter is the wrapped component. The second parameter retrieves the data we’re interested in, given a `DataSource` and the current props.

When `CommentListWithSubscription` and `BlogPostWithSubscription` are rendered, `CommentList` and `BlogPost` will be passed a `data` prop with the most current data retrieved from `DataSource`:

Note that a HOC **doesn’t modify** the input component, **nor does it use inheritance** to copy its behavior. Rather, a HOC ***composes* the original component by *wrapping* it in a container component**. A HOC is a **pure function** with zero side-effects.

And that’s it! The wrapped component receives all the props of the container, along with a new prop, `data`, which it uses to render its output. The HOC isn’t concerned with how or why the data is used, and the wrapped component isn’t concerned with where the data came from.

### Caveat

* Don’t Use HOCs Inside the render Method

  Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

* Static Methods Must Be Copied Over

  ```jsx
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {/*...*/}
    // Must know exactly which method(s) to copy :(
    Enhance.staticMethod = WrappedComponent.staticMethod;
    return Enhance;
  }
  
  
  //or
  import hoistNonReactStatic from 'hoist-non-react-statics';
  function enhance(WrappedComponent) {
    class Enhance extends React.Component {/*...*/}
    hoistNonReactStatic(Enhance, WrappedComponent);
    return Enhance;
  }
  ```

* **Refs Aren’t Passed Through**

  While the convention for higher-order components is to pass through all props to the wrapped component, this does not work for **refs**. That’s because `ref` is not really a prop — like `key`, it’s **handled specially** by React. If you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the **outermost container component**, not the wrapped component.

  Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. 

  ```js
  function logProps(Component) {
    class LogProps extends React.Component {
      componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props);
      }
  
      render() {
        const {forwardedRef, ...rest} = this.props;
  
        // Assign the custom prop "forwardedRef" as a ref
        return <Component ref={forwardedRef} {...rest} />;
      }
    }
  
    // Note the second param "ref" provided by React.forwardRef.
    // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
    // And it can then be attached to the Component.
    return React.forwardRef((props, ref) => {
      return <LogProps {...props} forwardedRef={ref} />;
    });
  }
  ```

## Render Props

**A render prop is a function prop that a component uses to know what to render.**

This technique makes the behavior that we need to share extremely portable. To get that behavior, render a `<Mouse>` with a `render` prop that tells it what to render with the current (x, y) of the cursor.

One interesting thing to note about render props is that you can implement most [higher-order components](https://reactjs.org/docs/higher-order-components.html) (HOC) using a regular component with a render prop. 

```jsx
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

It’s important to remember that just because the pattern is called “render props” you don’t have to use a prop named render to use this pattern. In fact, **any prop that is a function that a component uses to know what to render is technically a “render prop”**.

## Strict Mode

`StrictMode` is a tool for highlighting potential problems in an application. Like `Fragment`, `StrictMode` does not render any visible UI. It activates additional checks and warnings for its descendants.

>**Note**: Strict mode checks are run in development mode only; *they do not impact the production build*.

You can enable strict mode for any part of your application.

```jsx
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

`StrictMode` currently helps with:

- Identifying components with **unsafe lifecycles**
- Warning about **legacy string ref API usage**
- Warning about **deprecated findDOMNode usage**
- Detecting **unexpected side effects**
- Detecting **legacy context API**
- Detecting **unsafe effects**

## PropTypes

As your app grows, you can catch a lot of bugs with typechecking. For some applications, you can use JavaScript extensions like [Flow](https://flow.org/) or [TypeScript](https://www.typescriptlang.org/) to typecheck your whole application. But even if you don’t use those, React has some **built-in typechecking abilities**. To run typechecking on the props for a component, you can assign the special `propTypes` property:

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

> **Note** : `React.PropTypes` has moved into a different package since React v15.5. Please use [the `prop-types` library instead](https://www.npmjs.com/package/prop-types).

 When an invalid value is provided for a prop, a warning will be shown in the JavaScript console. For performance reasons, `propTypes` is only checked in development mode.

```jsx
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // A React element type (ie. MyComponent).
  optionalElementType: PropTypes.elementType,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A required value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Single Child

With `PropTypes.element` you can specify that only a single child can be passed to a component as children.

```jsx
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Default Prop Values

You can define default values for your `props` by assigning to the special `defaultProps` property:

```jsx
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
const root = ReactDOM.createRoot(document.getElementById('example')); 
root.render(<Greeting />);



//or
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

The `defaultProps` will be used to ensure that `this.props.name` will have a value if it was not specified by the parent component. The `propTypes` typechecking happens after `defaultProps` are resolved, so typechecking will also apply to the `defaultProps`.

### Function Components

If you are using function components in your regular development, you may want to make some small changes to allow PropTypes to be properly applied.

```jsx
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```



## Portals

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

```css
ReactDOM.createPortal(child, container)
```

The first argument (child) is any renderable React child, such as an element, string, or fragment. The second argument (container) is a DOM element.

Normally, when you return an element from a component’s render method, it’s mounted into the DOM as a child of the nearest parent node. However, sometimes it’s useful to insert a child into a different location in the DOM. A typical use case for portals is when a parent component has an `overflow: hidden` or `z-index` style, but you need the child to visually “break out” of its container.

Even though a portal can be anywhere in the DOM tree, it behaves like a normal React child in **every other way**. Features like context work exactly the same regardless of whether the child is a portal, as the portal **still exists in the *React tree*** regardless of position in the *DOM tree*.

This includes event bubbling. An event fired from inside a portal will **propagate to ancestors in the containing *React tree***, even if those elements are not ancestors in the *DOM tree*.

Catching an event bubbling up from a portal in a parent component allows the development of more flexible abstractions that are not inherently reliant on portals. 

## Profiler

The Profiler measures **how often** a React application **renders** and **what the “cost”** of rendering is. Its purpose is to help identify parts of an application that are slow and may benefit from optimizations such as memoization.

> **Note**: Profiling adds some additional overhead, so **it is disabled in [the production build](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)**.

A `Profiler` can be added anywhere in a React tree to measure the cost of rendering that part of the tree. It requires two props: an `id` (string) and an `onRender` callback (function) which React calls any time a component within the tree “commits” an update. It receives parameters describing what was rendered and how long it took.

```jsx
unction onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```

- **`id: string`** - The `id` prop of the `Profiler` tree that has just committed. This can be used to identify which part of the tree was committed if you are using multiple profilers.
- **`phase: "mount" | "update"`** - Identifies whether the tree has just been mounted for the first time or re-rendered due to a change in props, state, or hooks.
- **`actualDuration: number`** - Time spent rendering the `Profiler` and its descendants for the current update. This indicates how well the subtree makes use of memoization (e.g. [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo), [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate)). Ideally this value should decrease significantly after the initial mount as many of the descendants will only need to re-render if their specific props change.
- **`baseDuration: number`** - Duration of the most recent `render` time for each individual component within the `Profiler` tree. This value estimates a worst-case cost of rendering (e.g. the initial mount or a tree with no memoization).
- **`startTime: number`** - Timestamp when React began rendering the current update.
- **`commitTime: number`** - Timestamp when React committed the current update. This value is shared between all profilers in a commit, enabling them to be grouped if desirable.
- **`interactions: Set`** - Set of [“interactions”](https://fb.me/react-interaction-tracing) that were being traced when the update was scheduled (e.g. when `render` or `setState` were called).









## Web Components

to be continued

## Optimizing Performance

to be continued
