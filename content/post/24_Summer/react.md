---
title: 【React】ReactNode vs ReactElement
date: 2024-07-25 00:00:00+0000
categories: 
    - nutrition
    - grass
tags:
    - React
    - TypeScript
---
## ReactElement
* A ReactElement is a plain object describing a component instance or DOM node and its desired properties.
* It’s the **return type** of React.createElement().
* It’s always an **object** with a type and props.
* It’s more **specific** and represents a single React element.

```tsx
const element: React.ReactElement = <div>Hello</div>;
```
## ReactNode
* ReactNode is a **more general** type that can represent a React element, a string, a number, a boolean, null, undefined, or **an array of ReactNodes**.
* It’s a **union** type that includes ReactElement.
* It’s more **flexible** and can represent **any valid value** that can be rendered in React.

```tsx
const node1: React.ReactNode = "Hello";
const node2: React.ReactNode = 42;
const node3: React.ReactNode = <div>World</div>;
const node4: React.ReactNode = [node1, node2, node3];
```
## Key Differences
* Specificity:
  * ReactElement is more specific and always represents a single React element.
  * ReactNode is more general and can represent various types that React can render.
* Usage:
  * ReactElement is typically used when you specifically need a React element.
  * ReactNode is often used for **component children** or when you want to accept any renderable content.
* Type Hierarchy:
  * ReactNode **includes** ReactElement, but not vice versa.
  * All ReactElements are ReactNodes, but not all ReactNodes are ReactElements.
* Common Use Cases:
  * ReactElement: When you’re working with specific React components or elements.
  * ReactNode: When defining props that can accept various types of content, like children.
```tsx
import React, { ReactElement, ReactNode } from 'react';

// This only accepts a single React element
const ElementComponent: React.FC<{ content: ReactElement }> = ({ content }) => {
  return <div>{content}</div>;
};

// This accepts any renderable content
const NodeComponent: React.FC<{ content: ReactNode }> = ({ content }) => {
  return <div>{content}</div>;
};

function App() {
  return (
    <div>
      <ElementComponent content={<span>Hello</span>} /> {/* Valid */}
      {/* <ElementComponent content="Hello" /> */} {/* Invalid */}
      
      <NodeComponent content={<span>World</span>} /> {/* Valid */}
      <NodeComponent content="Hello" /> {/* Also Valid */}
    </div>
  );
}
```