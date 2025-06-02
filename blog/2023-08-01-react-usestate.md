---
slug: react-usestate
title: React useState hook
tags: [React, useState]
---

# React useState hook

## React function component 是 JS function

---

因為 function component 其實就是 function ，他的 execution context 執行完之後就會離開 call stack 被清除。這就是為何， react function component 的一個狀態，如果用一般的變數宣告，在 render 之間是無法保存的。

## useState hook

---

有上述前提後，就可以理解為何我們需要，React `useState` hook 了：因為我們希望在 render 之間保持狀態。

（如果是希望在 render 之間保持一個跟渲染畫面無關的狀態，可以是用另一個 hook: `useRef`）

function component 當中定義的 react useState 與一般 function 的變數不同，並不會隨著 return 而消失，而是被 React 紀錄起來了，像是放在 React 為你準備的倉庫上的架子。

**setState 詳細觸發畫面更新流程**

1. 透過 `setState` 告訴 react 去改變 state 值
2. react 去架子上把 state 的值改了
3. react 再次呼叫 component（這個行為稱之為 render）
4. 基於新的 state, props, 等等，去計算得到下一個畫面的 JSX (snapshot)
5. 回傳新的畫面

所以在執行到 `setState` 的當下其實只是向 React 註冊了這個 state 需要被改變的請求，而 react 收到後，才會觸發 rerender 拿新的 state 計算下一個畫面，並不是直接就去更新畫面。這也就是為何 `setState` 是非同步的原因，因為更新後的值在下一個 render 才會拿到。

範例：結果會是 count 1，因為第一個 setter 執行完之後不會馬上把 count 變成 1，執行到下面那段時，count 還是 0

```js
const [count, setCount] = React.useState(0)

const handleAdd = () => {
  setCount(1)
  setCount(count + 1) // 這時候 count 實際上還是 0
}
```

## setState 兩種形式

---

**直接取代值的形式**

```js
const [count, setCount] = React.useState(0)

const handleAdd = () => {
  setCount(1)
  // or
  setCount(count + 1)
}
```

**傳 callback 形式**

這樣代表告訴 react 要用前一次的 state 來更新 state。react 會把這樣的更新放進 queue，依次執行。

因此如果需要連續使用同樣的 setState（如下範例），可以改傳 callback 形式。

```js
const [count, setCount] = React.useState(0)

const handleAdd = () => {
  setCount(1) // 等同 setCount((count) => count + 1), count 為 0
  setCount((count) => count + 1) // count 為 1
}
```

## setState batching

---

React 會在所有 setState 請求結束後才更新畫面，這現象叫做 `batching`。

這是在 react 18 優化的，之前的版本如果 event handler 裡面 set 不同 state，他會 render 不只一次

react 有這樣非同步更新 state 的原因是：

1. 不希望產生過多 re-render，這可以讓 react app 跑得更快
2. 確保可以在所有 event handler 都執行完才更新的話，就可以確保不會拿到更新到一半的值

## Reference

---

[React 官方教學文件](https://react.dev/learn/state-as-a-snapshot)
