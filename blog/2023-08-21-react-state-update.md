---
slug: react-state-update
title: React State Update
tags: [React, State, Update]
---

# React 狀態更新

## Primitive type 的更新

---

因為 primitive type 本身就是 immutable，用以下寫法來告知 React state 有改變是沒問題的

```js
const [count, setCount] = useState(0)

setState(1)
```

## Object 物件 (object, Array) 的更新

---

Object 可以是 mutable 的，代表同一個記憶體位置裡面的 Object 內容是可以被改變的。

有以下兩種原因，官方建議我們應該永遠都應該使用 immutable 方式去更新 state，即傳入新的一份 Object (deep copy)

1. Object 是 pass by reference：

   - mutable: 直接 mutate 雖然 position 確實被改變了，但記憶體位置沒有改變，React 無法得知內容物是否變化，所以不會有 re-render。應該要用 setPosition 註冊狀態更新

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

   - immutable: 使用 setState 註冊狀態變化，才可以正確觸發 re-render

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

2. 避免副作用： 使用 mutable 資料可能導致 side effect，即在修改資料時可能會影響到其他部分的程式碼，導致錯誤或難以預測的行為。

<!-- ## 以 immutable 方式更新 object/Array state

### object

1. 非 nested object

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

   - 利用 recursive 自己實作一個 deep copy function
   - `Json.stringify` / `Json.parse`

     - 轉換時可能需要注意屬性出現非預期結果

   - Lodash 這樣的套件提供的現成的 `cloneDeep` 方法

     - 缺點：僅僅這個 function 就要多 17 kb 左右

   - immer 有 `useImmer` 讓我們可以使用 mutable 語法撰寫 immutable 程式碼

   - built-in 方法 `structuredClone`
     - 優點：多種瀏覽器、node.js、bun 都支援、nested object and array 都可以安心使用
     - 缺點：仍有一些不支援的資料類型要注意，如： function, DOM node…

### Array

1. 非 nested array
   - Spread operator `...` -->

## Reference

---

[React docs: Updating Objects in State](https://react.dev/learn/updating-arrays-in-state)
