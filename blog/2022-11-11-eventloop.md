---
slug: eventloop
title: Event Loop
tags: [JavaScript, Event Loop]
---
# Event Loop

## JS 是 single-threaded 語言

---

JS 是 **single-threaded** 程式語言，只有一個主執行緒（main thread）來執行程式碼，代表他只能**同步地**執行的任務。但是通常 JS 拿來寫網頁前端的時候，一定會處理到非同步程式碼，例如呼叫 API 就是個最常見的場景，此時就需要依靠瀏覽器這個 runtime 來提供這項能力。

## Event loop 及 Task queue

---

瀏覽器提供了 web api，例如 `setTimeout`, `fetch` 以及 Event loop 這樣的機制來管理非同步事件。

JS 在執行時，執行 function 會產生 execution context，這項任務會被放進到 call stack 中，以**先進後出**的順序被執行。如果過程中遇到非同步任務，例如 `setTimeout`，會被丟進 `callback (task) queue` 當中，以**先進先出**的順序被執行。

Event loop 這個機制就是去幫你不斷監控目前 call stack 的同步任務是不是已經**清空**了，空了的話，就幫你去 task queue 拿非同步任務出來並放到 call stack 執行。他是會不斷重複直到所有任務都執行完畢的，因此稱作為 Event loop 事件循環。

實際上，非同步的 web api 對 task queue 來說，又可以區分成兩類，Microtask queue 與 Macrotask queue。 當 call stack 清空後，其實會優先去 Microtask queue 拿任務出來執行，等到 Microtask queue 空了之後，瀏覽器會進行畫面渲染，然後再執行 Macrotask queue 的東西。

這表示，如果在執行 Macrotask 過程中產生了 Microtask，那麼這些 Microtask 會優先於下一個 Macrotask 執行。換句話說，Microtasks 具有較高的優先級，並且會在下一個 Macrotask 開始之前執行。

> 通常會產生 Macrotask 的有 JS script 本身及`setTimeout`, `setInterval` 這種較大型的任務，而 Microtask 中常由 `Promise` 產生。有這樣的分別是為了最佳化非同步管理，讓 Microtask queue 管理可能會造成 UI 組塞（DOM 操作）這樣優先度較高的任務，先把畫面更新完之後再處理較不急迫的 Macrotask

## 範例

---

#### 範例一：

```js
console.log(1)
setTimeout(() => {
  console.log(2)
}, 0)
console.log(3)
setTimeout(() => {
  console.log(4)
}, 0)
console.log(5)
```

1. Global execution context (GEC) 被放進 call stack。
2. 執行第一行 `console.log(1)`，`console.log(1)` EC 被放到 call stack。透過瀏覽器提供的 web api 取用 console 物件，呼叫方法 log，在 console 上印出 1。`console.log(1)` EC 從 call stack 被 pop out。
3. 接著 `setTimeout()` EC 被放入 call stack， `setTimeout()` 這個 web api 被取用，瀏覽器將我們寫的 callback function `() => {console.log(2)}` 存起來不執行，並計時 0 ms 。`setTimeout()` EC 從 call stack 被 pop out。後續程式碼繼續執行。
4. 執行下一行 `console.log(3)`，`console.log(3)` EC 被放到 call stack。透過瀏覽器提供的 web api 取用 console 物件，呼叫方法 log，在 console 上印出 3。`console.log(3)` EC 從 call stack 被 pop out。
5. 再次`setTimeout()` EC 被放入 call stack， `setTimeout()` 這個 web api 被取用，瀏覽器將我們寫的 callback function `() => {console.log(4)}` 存起來不執行，並計時 0 ms。`setTimeout()` EC 從 call stack 被 pop out。後續程式碼繼續執行。
6. 執行下一行 `console.log(5)`，`console.log(5)` EC 被放到 call stack。透過瀏覽器提供的 web api 取用 console 物件，呼叫方法 log，在 console 上印出 5。`console.log(5)` EC 從 call stack 被 pop out。
7. 程式碼執行到底了，Global execution context 從 call stack 被 pop out。
8. 至少過了 0 ms 後， callback function `() => {console.log(2)}` (簡稱 cb1) 就會被移到 callback queue 等待。
9. 滿足 「callback queue 裡面有待執行任務」以及「目前 call stack 已清空」這兩個條件，Event loop 就會把 callback queue 裡面的任務一次拿一個出來 (先進來的先被拿出來 )，放到 call stack 裡面。
10. cb1 execution context 從 callback queue 被拿出來塞到 call stack。
11. 執行 cb1 `console.log(2)`，透過瀏覽器提供的 web api 取用 console 物件，呼叫方法 log，在 console 上印出 2。
12. cb1 execution context 執行完畢，從 call stack 被 pop out。
13. 至少過了 0 ms 後， callback function `() => {console.log(4)}` (簡稱 cb2) 就會被移到 callback queue 等待。
14. 再度滿足 「callback queue 裡面有待執行任務」以及「目前 call stack 已清空」這兩個條件。
15. cb2 execution context 從 callback queue 被拿出來塞到 call stack。
16. 執行 cb2 `console.log(4)`，透過瀏覽器提供的 web api 取用 console 物件，呼叫方法 log，在 console 上印出 4。
17. Cb2 execution context 執行完畢，從 call stack 被 pop out。

console:

```
1
3
5
2
4
```

**範例二：**

```js
console.log('script start')

setTimeout(function () {
  console.log('setTimeout')
}, 0)

Promise.resolve()
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('script end')
```

1. 印出 script start
2. 把 setTimeout callback 放到 Macrotask queue
3. 把 Promise resolve 因此，第一個 `.then` callback 放到 Microtask queue
4. 印出 script end
5. call stack 空了，去拿 Microtask queue 的任務，也就是第一個 `.then` 的 callback，放到 call stack，執行。印出 promise1
6. 把 Promise 第二個 `.then` callback 放到 Microtask queue
7. 同上流程，去執行第二個 `.then` 的 callback。印出 promise2
8. Microtask queue 沒東西了，去拿 Macrotask queue 的任務，`setTimout` 的 callback 被放到 call stack，執行，印出 setTimeout

console

```
script start
script end
promise1
promise2
setTimeout
```

**範例三：**

```js
console.log('begins')

// S1
setTimeout(() => {
  console.log('setTimeout 1')
  Promise.resolve().then(() => {
    // P1
    console.log('promise 1')
  })
}, 0)

new Promise(function (resolve, reject) {
  console.log('promise 2')
  // S2
  setTimeout(function () {
    console.log('setTimeout 2')
    resolve('resolve 1')
  }, 0)
}).then(
  // P2
  (res) => {
    console.log('dot then 1')
    // S3
    setTimeout(() => {
      console.log(res)
    }, 0)
  }
)
```

1. 印出 begins
2. 把 S1 區塊 callback 放到 Macrotask queue
3. 執行 new Promise，印出 promise 2
4. 把 S2 區塊 callback 放到 Macrotask queue
5. call stack 空了，去執行 Macrotask queue 第一個任務，S1 區塊 callback，印出 setTimeout 1
6. 把 P1 區塊 callback 放到 Microtask queue
7. call stack 空了，去執行 Microtask queue，P1 區塊 callback，印出 promise 1
8. call stack 空了，去執行 Macrotask queue 第二個任務，S2 區塊 callback，印出 setTimeout 2
9. resolve 執行使得 `.then` 區塊 P2 區塊 callback 放到 Microtask queue
10. call stack 空了，去執行 Microtask queue，P2 區塊 callback，印出 dot then 1
11. 把 S3 區塊 callback 放到 Macrotask queue
12. call stack 空了，去執行 Macrotask queue 最後一個任務，S3 區塊 callback，印出 resolve 1

console

```
begins
promise 2
setTimeout 1
promise 1
setTimeout 2
dot then 1
resolve 1
```

## Reference

---

[請說明瀏覽器中的事件循環 (Event Loop)](https://www.explainthis.io/zh-hant/interview-guides/javascript/what-is-event-loop)

[JS 原力覺醒 Day15 - Macrotask 與 MicroTask](https://ithelp.ithome.com.tw/articles/10222737)

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[最常見的事件循環 (Event Loop) 面試題目彙整](https://www.explainthis.io/zh-hant/interview-guides/javascript/js-event-loop-questions#%E5%9F%BA%E7%A4%8E%E9%A1%8C)
