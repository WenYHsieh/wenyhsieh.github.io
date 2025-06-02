# React 一些觀念

## React life cycle

---

React function component 的生命週期可分為三階段

`mounting -> update -> unmounting`

1. mounting

   當 component 放到 DOM 上面時，執行一些初始化的行為。

2. update

   當 props or state 改變驅使 component re-render

3. unmounting

   當 component 離開 DOM，執行一些 cleanup 行為。



## React 18 new feature

---

新增了一些與處理 Concurrency 相關的功能

- suspense

  ```react
  <Suspense fallback={<Loading />}> // 在子元件準備好之前會顯示 Loading 元件
   	<TodoList />
  	// 元件包含一些會非同步取得資料的過程
  </Suspense>
  ```

  以元件為最小單位去 hydration，解決了 bundle 太大下載時間常會托很久才能跟想互動的元件互動的問題。

- useTransition

- server component

- auto batching

  - 多個 setState 會一次更新，不會觸發多次 re-render

