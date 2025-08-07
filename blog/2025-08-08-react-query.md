---
slug: react-query
title: React Query
tags: [React, React-Query, TanStack Query]
---

# React Query

在 React 開發中，處理非同步資料（如 API 請求）是非常常見的需求。要正確並有效率地管理非同步狀態並不簡單，尤其當應用越來越大時，會面臨多個 components 間資料共用、錯誤處理、Race condition 等挑戰。

這篇文章會依序說明：

1. 呼叫 API 時常見的挑戰有哪些
2. 不使用工具時該如何處理
3. 使用 React Query（TanStack Query）能帶來哪些好處

---

### 1. 呼叫 API 時需要考慮哪些事情？

####  非同步資料的狀態維護

當我們執行一個 API 請求時，通常需要維護以下狀態：

* **資料本身**：API 回傳的內容
* **Loading 狀態**：告訴使用者資料還在請求中
* **錯誤狀態（error handling）**：例如 API timeout、無網路、後端報錯等情況

這些都會需要 state 來追蹤，例如 `isLoading`、`error`、`data`。

####  多個元件共用相同資料

常見的作法有：

* **將 state 往上提至父層元件**
* **使用 Context + 自訂 hook**：例如 `useApiData` + React Context
* **使用全域狀態管理工具**：如 Zustand、Redux 等

不過這些做法會讓資料 flow 更複雜，還容易造成 **props drilling** 或 **過度 re-render** 的問題。

####  Race Condition 處理

假設使用者快速切換搜尋條件，會觸發多個 API 請求。這時就可能出現：

* **資料閃爍**
* **畫面顯示非最新結果**

常見解法：

1. **Abort Request**：使用 `AbortController` 中斷先前的請求
2. **UI 鎖定**：切換參數後禁止再次觸發按鈕，幫他加個 loading 狀態
3. **比對參數再更新**：`setState` 前確認回傳的參數仍是目前的

---

### 2. 如果不用外部工具，我們會怎麼做？

最原始的方式是：

* 在 `useEffect` 裡搭配 `fetch` 或 `axios` 發送 API
* 自行維護 `loading` / `error` / `data`
* 自行實作快取邏輯、重新請求機制（如頁面重新聚焦時）
* 為避免 memory leak 還得在 `useEffect` 裡清理請求

這些方法雖然可行，但當需求越來越多時，這些邏輯會變得複雜、難以維護，也較容易出錯。

---

### 3. React Query 能幫上什麼忙？

React Query（TanStack Query）不是 data fetching 工具，而是專注在 **管理非同步狀態** 的解決方案。

它帶來以下幫助：

####  抽象化非同步資料管理

你只需提供一個返回 Promise 的函式，它就幫你處理：

* loading / error / data 狀態
* 快取與重新請求邏輯
* 背景更新（stale-while-revalidate）

例如：

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});
```

####  自動快取與跨元件共用資料

同樣的 `queryKey` 只會請求一次，其他使用者直接用快取資料，解決 props drilling 與 useContext 的重新渲染問題。

####  自動更新與錯誤重試

* 網頁重新聚焦或網路恢復時自動重抓資料
* 可自訂重試次數、錯誤策略

####  Race condition 解法內建

不需要自己用 AbortController，React Query 內建請求取消與過期快取策略，永遠只顯示最新結果。

####  更方便地寫出複雜 user flow

像是：

建立資料後自動更新列表或修改、刪除後同步更新其他頁面資料，都可透過搭配 queryKey 或 mutation + `invalidateQueries` 組合技就能實現

---

### 小結

雖然使用 `useEffect` + `fetch` + 自訂 hook 也能完成非同步邏輯，但當應用變複雜時，會花大量時間在管理狀態與錯誤處理上。
React Query 幫你抽象化這一切，讓我們能更專注在商業邏輯與 UI 呈現上。

