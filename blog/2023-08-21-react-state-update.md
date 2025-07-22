---
slug: react-state-update
title: React State Update
tags: [React, State, Update]
---

# React 狀態更新
此篇主要探討 React 的狀態（state）更新。
包括 React 如何知道 state 是否改變、不同資料型態的 state 更新方式及需要注意的細節。

## 什麼是 state ?
在 React 中，state 是 component 內部管理的狀態，會隨著 component 生命週期演進而改變。

## 為什麼需要更新 state ?
在 React 中，state 的更新會觸發 component 的 re-render，來達成畫面的更新。

## React 如何知道 state 是否改變？
在討論如何以正確得方式更新不同資料型態的 state 前，我們要先知道，React 透過 `Object.is` 來判斷 state 是否改變，**表示他是依據記憶體位置是否改變來判斷，記憶體位置若相同，則不會觸發 re-render**。這麼做的原因是為了追求更好的效能，而我們只要開發者能確保永遠以 immutable 方式去更新 state，React 就可以幫我們免不必要的 re-render。

> 當我們說使用 immutable 方式更新 state 時，指的是，將所有資料視為 immutable 資料去更新。

## 不同資料型態的 state 更新方式
**React 官方建議我們應該永遠都應該使用 immutable 方式去更新 state**，因此在非 primitive type 的 state 更新上，我們要特別注意。
JS 中，變數又分為 primitive type 和 reference type，前者是 immutable，後者是 mutable。以下分別探討兩者的更新方式。

### Primitive type 的更新

因為 primitive type 本身是 immutable，可直接用傳入新值的方式告知 React state 改變，即可正確觸發 re-render。

```js
const [count, setCount] = useState(0)

setState(1)
```

### Reference type 的更新
Reference type 的資料，如：Object, Array，是 mutable 的，代表即使值被改變，其記憶體位置可能不變，React 將無法辨識變化，造成不會 re-render。因此需確保**傳入 setState 的新 state 是一份 deep copy**。

#### 1. Object 的更新

- 非 nested object
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

-  nested object

   - 利用 recursive 自己實作一個 deep copy function
   - `Json.stringify` / `Json.parse`

     - 轉換時可能需要注意屬性出現非預期結果

   - Lodash 這樣的套件提供的現成的 `cloneDeep` 方法

     - 缺點：僅僅這個 function 就要多 17 kb 左右

   - immer 有 `useImmer` 讓我們可以使用 mutable 語法撰寫 immutable 程式碼

   - built-in 方法 `structuredClone`
     - 優點：多種瀏覽器、node.js、bun 都支援，包括 nested object and array 都可以安心使用
     - 缺點：仍有一些不支援的資料類型要注意，如： function, DOM node 等等

#### 2. Array 的更新
使用會回傳新的 Array 的內建 function，如：map, filter, slice, concat。
避免使用會修改原 Array 的內建 function，如：push, pop, shift, unshift, splice。

- 錯誤作法： 直接 mutate 原 **Array**，即使使用 setState，但記憶體位置不變，React 無法得知內容物是否變化，所以不會有 re-render。
  ```js
  const [amount, setAmount] = useState([1, 2, 3])
  setAmount(amount.push(4))
  ```

- 正確作法： 使用會回傳新的 Array 的內建 function，搭配 setState 註冊狀態更新，正確觸發 re-render。
  ```js
  const [amount, setAmount] = useState([1, 2, 3])
  setAmount(amount.map(i => i * 2))
  setAmount(prev => prev.map(i => i * 2))
  ```

## 以 immutable 方式更新 state 的其他優點 
避免副作用： 使用 mutable 方式更新可能導致 side effect，代表修改資料時可能會影響到其他部分的程式碼，導致錯誤或難以預測的行為。


## Reference

[React docs: Updating Objects in State](https://react.dev/learn/updating-arrays-in-state)
[為什麼 React 中的 state 必須是 immutable？](https://wehelp.tw/topic/5077127607091200)