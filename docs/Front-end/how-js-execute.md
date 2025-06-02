---
enableComments: true
---

# 了解 JS 如何被 runtime 執行

## Execution context, EC, 執行環境

---

他是一個由 JS engine 提供的程式碼，用來驗證及執行你現在正在執行的程式碼用的，可以說，他管理了正在被執行的 lexical environment，同時也管理除了你的 code 之外所需的其他事情

當 JavaScript 程式碼執行時，JS engine 會創建和管理多個 EC，並根據程式碼的結構和執行順序來處理它們。每個 function 呼叫時都會創建一個新的 EC，並將其添加到呼叫堆疊（Call Stack）中。當函數執行完成後，相應的 EC 將從 call stack 中移除。

## Lexical environment 語彙環境

---

在定義了 lexical environment 的程式語言當中，代表你的程式碼寫在哪邊（物理上位置）是很重要的。這關係到他和其他程式碼 （包括變數、函式或其他程式）的關係、在記憶體中的樣子，以及它們可以被訪問的範圍，因為這對於編譯器如何解析你的程式碼。

## Global Execution context 全域執行環境

---

當 JavaScript 程式碼開始執行時，會創建一個全域 Execution Context，稱為 Global Execution Context，這是最上層的 Execution Context，裡面 Global Object、this variable 會被產生。

- Global Object

  - 在瀏覽器環境下是 window
  - 在 Node.js 環境下是 global。

- this

  - 在瀏覽器中指向 window。
  - 在 Node.js 中，它可能指向不同的物件。this 在全域中使用時指向 Global Object，但在 function 內部，this 的值可能會根據調用上下文而改變 ([this - binding object 綁定物件](/Front-end/thisBindingObject))。

- 全域變數

  - 在 GEC 中宣告的變數和 function 會被附加到 GEC 上。
  - 在瀏覽器中，這些變數和 function 將成為 window object 的屬性。

- Outer Environment：
  - GEC 的 Outer Environment 通常被設置為 null，因為它處於最外層

## Creation and Hoisting

---

JavaScript 程式碼執行時會有兩個階段

1. Creation phase: Execution context 被產生，變數記憶體被設定的階段，hoisting 在這邊發生。

   - Global object, this, outer environment 會在這個階段被給定記憶體位置
   - 在程式碼真的開始執行之前，編譯器會由上掃到下，將記憶體空間先設定給這些變數、function。這一個動作就稱為 **hoisting**。要注意的是，hoisting 並非把你宣告的程式碼實體位置都移到所有 code 的最前面。
   - hoisting 行為差異

     - 變數： 對於每個使用 `var` 宣告的變數，在這個階段只有名稱會先設定好，給定一個記憶體空間，JS engine 還不會設定裡面的值，而是會先給他一個初始化的值，`undefined`，直到真正程式碼執行的階段變數的值才會被換成你定義的 (如果有的話)

       - `let` 與 `const` 仍存在創造階段的 hoisting，不過他的行為和 var 不太一樣，他還是會在記憶體中被設定好，但直到宣告的那行被執行到之前你都不能取用，JS engine 會把他擋下來不讓你取用，這段被禁止取用的期間叫做 `TDZ (Temperal Dead Zone)`

     - function：不同於變數，function 在這個階段就會被完全設定好放到記憶體中了

       - function 的宣告可分為 function declaration 或是 function expression 兩種形式。 function declaration 可以在宣告前呼叫而不出錯，但 function expression 與一般存放 primitive type 的變數一樣，會先被設定為 `undefined`，因此如果在 code execution 階段，我們在宣告那行之前呼叫，就等同於是 `undefined()`，會出現錯誤！

       ```js
       // 1. function declaration
       func1()
       // func1
       function func1() {
         console.log('func1')
       }

       // 2. function expression
       func2()
       // > Uncaught ReferenceError: func2 is not defined
       const func2 = () => {
         console.log('func2')
       }
       ```

   - 值得注意的是，在全域環境下，只會將在全域中的變數和 function 寫到記憶體，而不會將 function 內部的都設定好。內部的會在何時被設定呢？ 在 code execution 階段，當那個 function 被執行到的時候，內部的東西才會開始他們的創造階段

2. Code execution: 程式碼實際開始執行
   - 由上到下逐行執行的

---

以下是一個範例，我們逐行來解釋 JS 是如何被執行的：

```js
var a = 1
function fn() {
  console.log(a)
  var a = 5
  console.log(a)
  a++
  var a
  fn2()
  console.log(a)
  function fn2() {
    console.log(a)
    a = 20
    b = 100
  }
}
fn()
console.log(a)
a = 10
console.log(a)
console.log(b)
```

1. JS engine 開始解析程式碼，將 Global Execution context (GEC) 放進 call stack。

2. 依據上述 Hoisting 底層運作原理， GEC creation phase 會先設定 「宣告在全域 (global) 的變數」的記憶體位置

   - `var a = 1` : 記憶體位置被設定，名為 a，給定初始值 undefined。
   - `function fn(){...}` : 記憶體位置被設定，名為 fn，裡面的整段程式碼都被放進去，但這時候還沒有執行。

   > 每個 EC 都會有一個依據實際座落在程式碼脈絡中的位置 (lexical environment) 而定義的 outer environment ，通常會是一個接一個的形式，而這樣一系列連接在一起的 Lexical Environment 稱為 Scope chain，定義了能夠取得的變數範圍。Global 已經是最外層了，所以指向 null。

3. Global EC creation phase 結束後就進入 code execution phase

- 最先碰到的是 `var = 1`， a 被設定為 1。
- 接著碰到 `fn()`，`fn()` 的 execution context 被放到 call stack。

4. `fn()` EC 進入 creation phase

   - `var a = 5` : 在 `fn()` local memory 設定記憶體位置，名為 a，給定初始值為 undefined。
   - `var a` : 在 `fn()` local memory 已經存在 a，這段宣告就會被跳過。
   - `function fn2(){...}` : 在 `fn()` local memory 設定記憶體位置，名為 fn2，裡面的整段程式碼都被放進去，但這時候還沒有執行。

   > Outer environment: `fn() EC -> Global EC`

5. `fn()` EC 進入 code execution phase

   - `console.log(a)` : 找 `fn()` EC local memory 有無 a，有，印出 undefined。
   - `var a = 5` : 在 `fn()` EC local memory 找到 a，改為 5。
   - `console.log(a)` : 找 `fn()` EC local memory 有無 a，有，印出 5。
   - `a++` : 在 `fn()` EC local memory 找到 a，改成 6。
   - `fn2()` 的 execution context 被放到 call stack。

6. `fn2()` EC 進入 creation phase

   - 沒東西要宣告，直接進到 code execution phase

   > Outer environment: `fn2() EC -> fn() EC -> Global EC`

7. `fn2()` EC 進入 code execution phase

   - `console.log(a)` : 找 `fn2()` EC local memory 有無 a，沒有，去 outer environment 找，先找到 `fn()`，找到 a 了，印出 6。
   - `a = 20` : 找 `fn2()` EC local memory 有無 a，沒有，去 outer environment 找，先找到 `fn()` EC，找到 a 了，把 a 的值改成 20。
   - `b = 100` ：找 `fn2()` EC local memory 有無 b，沒有，去 outer environment 找，先找到 `fn()` EC，沒找到 b，往外到 Global EC 找，也沒找到 b，再往外是 null，不往上了，在 Global EC 宣告變數 b 為 100。

8. `fn2()` 執行完畢，`fn2()` EC 從 call stack 被 pop out。

9. 回到 `fn()` 繼續執行

   - `console.log(a)` : 找 `fn()` EC local memory 有無 a，有，印出 20

10. `fn()` 執行完畢，`fn()` EC 從 call stack 被 pop out。

11. 回到 Global 繼續執行

- `console.log(a)` : 找 Global EC memory 有無 a，有，印出 1
- `a = 10` : 把 Global EC 的 a 改成 10
- `console.log(a)` : 找 Global EC memory 有無 a，有，印出 10
- `console.log(b)` : 找 Global EC memory 有無 b，有，印出 100

12. 全部執行完畢，Global EC 從 call stack 被 pop out

console:

```
Undefined
5
6
20
1
10
100
```

## Reference

---

[JavaScript 全攻略：克服 JS 的奇怪部分](https://www.udemy.com/course/javascriptjs/)

[How JavaScript Code is executed? ❤️& Call Stack | Namaste JavaScript Ep. 2](https://www.youtube.com/watch?v=iLWTnMzWtj4&list=RDCMUC3N9i_KvKZYP4F84FPIzgPQ&index=6)
