---
slug: react-state-update
title: React State Update
tags: [React, State, Update]
---

# React State Update

## Primitive Type Updates

---

Since primitive types are immutable by nature, it's perfectly fine to use the following approach to notify React of state changes:

```js
const [count, setCount] = useState(0)

setState(1)
```

## Object Updates (objects, Arrays)

---

Objects can be mutable, meaning the content of an object at the same memory location can be changed.

There are two main reasons why the official documentation recommends always using immutable approaches to update state, i.e., passing in a new copy of the object (deep copy):

1. Objects are passed by reference:

   - Mutable approach: Direct mutation changes the position, but since the memory location remains the same, React cannot detect if the content has changed, so it won't trigger a re-render. We should use setPosition to register the state update.

   ```js
   const [position, setPosition] = useState({
       x: 0,
       y: 0
     });

   onPointerMove={e => {
     position.x = e.clientX;
     position.y = e.clientY;
   }}

   ```

   - Immutable approach: Using setState to register state changes will correctly trigger re-renders.

   ```js
   const [position, setPosition] = useState({
       x: 0,
       y: 0
     });

   onPointerMove={e => {
     setPosition({
       x: e.clientX,
       y: e.clientY
     });
   }}
   ```

2. Avoid side effects: Using mutable data can lead to side effects, where modifying data might affect other parts of the code, causing errors or unpredictable behavior.

<!-- ## Updating object/Array state immutably

### object

1. Non-nested object

   - `Object.assign`

   ```js
   const originalObj = { name: 'lix' }
   const clonedObj = Object.assign({}, originalObj)
   console.log(clonedObj === originalObj) //false
   ```

   - Spread operator `...`

   ```js
   const originalObj = { name: 'lix' }
   const clonedObj = { ...originalObj }
   console.log(clonedObj === originalObj) //false
   ```

2. nested object

   - Implement a deep copy function using recursion
   - `Json.stringify` / `Json.parse`

     - Need to be careful about unexpected results during conversion

   - Use libraries like Lodash that provide ready-made `cloneDeep` methods

     - Drawback: This single function adds about 17 kb to your bundle

   - immer provides `useImmer` allowing us to write immutable code using mutable syntax

   - Built-in method `structuredClone`
     - Advantages: Supported across multiple browsers, node.js, and bun, safe to use with nested objects and arrays
     - Disadvantages: Some data types are not supported, such as: functions, DOM nodes...

### Array

1. Non-nested array
   - Spread operator `...` -->

## Reference

---

[React docs: Updating Objects in State](https://react.dev/learn/updating-arrays-in-state)
