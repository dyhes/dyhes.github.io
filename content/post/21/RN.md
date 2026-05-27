---
title: 【React Native】Concepts
date: 2021-10-11 00:00:00+0000
categories: 
- nutrition
- temple
tags:
  - Mobile
---

In Android and iOS development, a **view** is the **basic building block** of UI: **a small rectangular element** on the screen which can be used to display text, images, or respond to user input. Even the smallest visual elements of an app, like a line of text or a button, are kinds of views. Some kinds of views can **contain other views**. 

## Native Components

In Android development, you write views in **Kotlin or Java**; 

in iOS development, you use **Swift or Objective-C**. 

With React Native, you can invoke these views with **JavaScript** using React components.

 At runtime, React Native creates the corresponding Android and iOS views for those components. Because React Native components are backed by the same views as Android and iOS, React Native apps look, feel, and perform like any other apps. 

We call these platform-backed components **Native Components.**

### Core Components

React Native comes with a set of essential, ready-to-use Native Components you can use to start building your app today. These are React Native's **Core Components**.

| REACT NATIVE UI COMPONENT | ANDROID VIEW   | IOS VIEW         | WEB ANALOG               | DESCRIPTION                                                  |
| :------------------------ | :------------- | :--------------- | :----------------------- | :----------------------------------------------------------- |
| `<View>`                  | `<ViewGroup>`  | `<UIView>`       | A non-scrollling `<div>` | A container that supports layout with flexbox, style, some touch handling, and accessibility controls |
| `<Text>`                  | `<TextView>`   | `<UITextView>`   | `<p>`                    | Displays, styles, and nests strings of text and even handles touch events |
| `<Image>`                 | `<ImageView>`  | `<UIImageView>`  | `<img>`                  | Displays different types of images                           |
| `<ScrollView>`            | `<ScrollView>` | `<UIScrollView>` | `<div>`                  | A generic scrolling container that can contain multiple components and views |
| `<TextInput>`             | `<EditText>`   | `<UITextField>`  | `<input type="text">`    | Allows the user to enter text                                |

![A diagram showing React Native's Core Components are a subset of React Components that ship with React Native.](https://reactnative.dev/docs/assets/diagram_react-native-components.svg)

## Platform Specific  Code

When building a cross-platform app, you'll want to re-use as much code as possible. Scenarios may arise where it makes sense for the code to be different, for example you may want to implement separate visual components for Android and iOS.

React Native provides two ways to organize your code and separate it by platform:

- Using the [`Platform` module](https://reactnative.dev/docs/platform-specific-code#platform-module).
- Using [platform-specific file extensions](https://reactnative.dev/docs/platform-specific-code#platform-specific-extensions).

Certain components may have properties that work on one platform only. All of these props are annotated with `@platform` and have a small badge next to them on the website.

### Using [platform-specific file extensions](https://reactnative.dev/docs/platform-specific-code#platform-specific-extensions).

For example, say you have the following files in your project:

```shell
BigButton.ios.js
BigButton.android.js
```

You can then require the component as follows:

```jsx
import BigButton from './BigButton';
```

React Native will automatically pick up the right file based on the running platform.

You can also use the `.native.js` extension when a module needs to be shared between NodeJS/Web and React Native but it has no Android/iOS differences. This is especially useful for projects that have common code shared among React Native and ReactJS.

For example, say you have the following files in your project:

```shell
Container.js ## picked up by Webpack, Rollup or any other Web bundler
Container.native.js ## picked up by the React Native bundler for both Android and iOS (Metro)
```

You can still require it without the `.native` extension, as follows:

```jsx
import Container from './Container';
```

**Pro tip:** Configure your Web bundler to ignore `.native.js` extensions in order to avoid having unused code in your production bundle, thus reducing the final bundle size.

## Style

With React Native, you style your application using JavaScript. All of the core components accept a prop named `style`. The style names and [values](https://reactnative.dev/docs/colors) usually match how CSS works on the web, except names are written using camel casing

```js
const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  red: {
    color: 'red',
  },
});
```

### Dimensions

#### Fixed Dimensions

The general way to set the dimensions of a component is by adding a fixed `width` and `height` to style. All dimensions in React Native are unitless, and represent density-independent pixels.

#### Flex Dimensions

Use `flex` in a component's style to have the component expand and shrink dynamically based on available space. Normally you will use `flex: 1`, which tells a component to fill all available space, shared evenly amongst other components with the same parent. The larger the `flex` given, the higher the ratio of space a component will take compared to its siblings.

> A component can only expand to fill available space if its parent has dimensions greater than `0`. If a parent does not have either a fixed `width` and `height` or `flex`, the parent will have dimensions of `0` and the `flex` children will not be visible.

#### Percentage Dimensions

If you want to fill a certain portion of the screen, but you *don't* want to use the `flex` layout, you *can* use **percentage values** in the component's style. Similar to flex dimensions, percentage dimensions require parent with a defined size.

### Layout

You will normally use a combination of `flexDirection`, `alignItems`, and `justifyContent` to achieve the right layout.



#### flexDirection

controls the direction in which the children of a node are laid out. This is also referred to as the main axis. The cross axis is the axis perpendicular to the main axis, or the axis which the wrapping lines are laid out in.

- column(default)
- row
- column-reverse
- row-reverse

#### justifyContent

describes how to align children within the main axis of their container. 

- flex-start(default)
- flex-end
- center
- space-between
- space-around
- space=evenly

#### alignItems

describes how to align children along the cross axis of their container. It is very similar to `justifyContent` but instead of applying to the main axis, `alignItems` applies to the cross axis.

- stretch (default):Stretch children of a container to match the `height` of the container's cross axis.
- flex-start
- flex-end
- center
- baseline:Align children of a container along a common baseline. Individual children can be set to be the reference baseline for their parents.

#### alignSelf

has the same options and effect as `alignItems` but instead of affecting the children within a container, you can apply this property to a single child to change its alignment within its parent. `alignSelf` overrides any option set by the parent with `alignItems`.



>The [`flexWrap`](https://reactnative.dev/docs/layout-props#flexwrap) property is set on containers and it controls what happens when children overflow the size of the container along the main axis. By default, children are forced into a single line (which can shrink elements). If wrapping is allowed, items are wrapped into multiple lines along the main axis if needed. When wrapping lines, `alignContent` can be used to specify how the lines are placed in the container

#### Flex Basis, Grow, and Shrink

[`flexBasis`](https://reactnative.dev/docs/layout-props#flexbasis) is an axis-independent way of providing the default size of an item along the main axis.

[`flexGrow`](https://reactnative.dev/docs/layout-props#flexgrow) describes how any space within a container should be distributed among its children along the main axis.

[`flexShrink`](https://reactnative.dev/docs/layout-props#flexshrink) describes how to shrink children along the main axis in the case in which the total size of the children overflows the size of the container on the main axis.

### Image

#### Static Image Resources

```jsx
<Image source={require('./img/check.png')} />
```

Note that image sources required this way include size (width, height) info for the Image. If you need to scale the image dynamically (i.e. via flex), you may need to manually set `{ width: undefined, height: undefined }` on the style attribute.

#### Network Images

```jsx
<Image source={{uri: 'https://reactjs.org/logo-og.png'}}
       style={{width: 400, height: 400}} />
```

#### Background Image

```jsx
return (
  <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
    <Text>Inside</Text>
  </ImageBackground>
);
```

## Handling Touches

Users interact with mobile apps mainly through touch.

[Button](https://reactnative.dev/docs/button) provides a basic button component that is rendered nicely on all platforms. 

If the basic button doesn't look right for your app, you can build your own button using any of the "Touchable" components provided by React Native. 

## Navigation

Mobile apps are rarely made up of a single screen. Managing the presentation of, and transition between, multiple screens is typically handled by what is known as a navigator.

 If you are getting started with navigation, you will probably want to use [React Navigation](https://reactnative.dev/docs/navigation#react-navigation).

If you're integrating React Native into an app that already manages navigation natively, or looking for an alternative to React Navigation, the following library provides native navigation on both platforms: [react-native-navigation](https://github.com/wix/react-native-navigation).

### React Navigation

Now, you need to wrap the whole app in `NavigationContainer`. Usually you'd do this in your entry file, such as `index.js` or `App.js`

```jsx
const App = () => {
  return (
    <NavigationContainer>
      {/* Rest of your app code */}
    </NavigationContainer>
  );
};
```

## Animation

React Native provides two complementary animation systems: [`Animated`](https://reactnative.dev/docs/animations#animated-api) for granular and interactive control of specific values, and [`LayoutAnimation`](https://reactnative.dev/docs/animations#layoutanimation-api) for animated global layout transactions.

`Animated` exports six animatable component types: `View`, `Text`, `Image`, `ScrollView`, `FlatList` and `SectionList`, but you can also create your own using `Animated.createAnimatedComponent()`.
