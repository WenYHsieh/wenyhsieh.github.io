---
enableComments: true
---

# JS 一些觀念

## function

---

### first-class function 一級函式

可視為一般變數一樣的 function 稱為 first-class function。

下例中，`func1` 為 first-class function

- function delaration

  ```js
  const func1 = () => { console.log('yup') }
  ```

  

- 可作為參數傳遞

  ```js
  const func1 = () => { console.log('yup') }
  const logFn = (fn) => { console.log(fn) }
  ```

  

- 可作為 function 回傳值

  ```js
  const func1 = () => { console.log('yup') }
  const logFn = (fn) => { return fn }
  ```

  

### high-order function 高階函式

high-order function 是指一個 function 有無能力接收一個 function 當作參數以及是否能夠 return 一個 function

下例中，`func2` 為 high-order function

```js
const func1 = () => { console.log('yup') }
const func2 = (fn) => { console.log(fn) }
or 
const func2 = (fn) => { return fn }
```



## Closure

---

Closure 閉包簡單來說就是 function 與他的 scope chain 的集合。

閉包使得我們可以確信永遠能夠在 function 內取用 scope chain 的變數，即便外部的 function 已經執行完畢。

以下為一個例子，在 outer 執行完之後，他的 execution context 已經離開 call stack，但 return 的 function 依然抓得到 outerVar，這是因為他不只 return 了那個 function，也 return 了外部參照的 scope chain。

```js
const outer = (outerVar) => {
  return () => {
    console.log(outerVar)
  }
}

const inner = outer('outerVarIsMe')
inner()
// outerVarIsMe
```

所以實務上閉包可以用在哪呢？

私有變數，不想暴露 function 內的變數給外部任意存取及修改時，會使用到私有變數。

```js
const wallet = () => {
	let balance = 1000
  const decreaseBalance =  (price) => {
			balance = balance - price
	}
 	const getBalance = () => console.log(balance)
	return { getBalance, decreaseBalance }
}

const myWallet = wallet()

myWallet.getBalance()
myWallet.decreaseBalance(100)
myWallet.getBalance()
```



## function currying 柯里化

---

1. use bind

   ```js
   const multiply = (x, y) => {
     return x * y
   }
   
   const multiplyByTwo = multiply.bind(this, 2)
   multiplyByTwo(3) // 6
   ```

2. closure

   ```js
   const multiply = (x) => {
     return (y) => {
       return x * y
     }
   }
   
   const result = multiply(2)(3) // 6
   console.log(result)
   ```

   



