---
slug: react-useeffect
title: React useEffect hook
tags: [React, useEffect]
---

# React useEffect hook

## 簡介

---

React 提供的，讓我們可以在每次 render 導致畫面更新之後，都去執行 Effects 的 hook。

> Effects: react-specific side effect，一段用來跟 Component 外在系統同步的邏輯

這不是專們用來模擬 class component 生命週期的 hook，因為他會在每次 dependency 內容更新後都被執行，意義上比較像是讓 component 去跟外在環境同步，而不是讓我們在 component 生命週期某階段（例如 mount）作某些事情。

React 18 為了模擬 component unmount 後再次 mount 的行為，會 mount component 兩次。這是為了確保 component 夠穩健，兩次都會得到相同結果、component 不會壞掉。（如果壞掉的話，也許要檢查是不是需要使用 cleanup function，或者其他地方有 bug，總之可以及早發現及早治療）

所以使用 `strict-mode` 且處在開發環境時，`useEffect` 的 Effect 也會被執行兩次。

如果真的不需要可以用 `useRef` 判斷是否跑過一次。

```js
const component1 = () => {
  const isFirstRender = React.useRef(true)

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // do whatever you want...
  }, [])
  return ...
}
```

## 使用 useEffect

---

1. 定義 `Effect` 邏輯
2. 定義 `dependency`，即我們希望在哪些狀態變動的情況下重新執行 `Effect`，空的話代表只會在 component mount 執行一次 `Effect` 而已。
3. 如果有需要可以 return 我們希望在下次 `dependency` 更新驅動 `Effect` 執行之前，要先執行的一段 function（cleanup function)

```js
useEffect(() => {
  // 1. Effects
  return () => {} // 3. cleanup function
}, [deps]) // 2. dependency
```



## 何時需要 Effect？

---

通常一個 component 會具備以下兩種邏輯：

1. Render 畫面用的：接收 props, state 計算出 JSX、也就是跟畫面渲染直接相關的邏輯。
2. handle event 用的：綁定在 JSX 上面的，由事件驅動的邏輯。跟畫面渲染無直接相關。

當這些還不夠完成我們需要的功能時，例如說我們想要在 `ChatReoom` component 出現在畫面上時，去跟後端建立連線，這是跟畫面渲染無直接相關也不是事件驅動的 side effect，這些就可以用 `useEffect` 來執行。所以，那些因為 render 本身帶來的 side effect 就適合用 `useEffect` 來操作。



## useEffect cleanup function

---

實務開發中，有一種常見的情形會使用到 `useEffect` cleanup function，就是當我們利用 `useEffect` 綁定 event handler 時，如下：

```js
const component1 = () => {
  useEffect(() => {
    const handleScroll = (e) => {
    	console.log(window.scrollX, window.scrollY);
  	}
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [])
}
```

在 component mount 時我們綁定了一個 scroll event handler `handleScroll`，因此，在這個 component 離開畫面之後，我們也應該要移除這個 `handleScroll` 的綁定。

這是因為如果不移除，會導致元件的實例仍然保留在記憶體中，無法被垃圾回收。這可能導致記憶體洩漏，使 React app 佔用更多記憶體。而另一方面，畫面上已經沒有此 component，但這個 event handler 持續在作用，這可能會導致預料之外的行為。



## useLayoutEffect

---

他跟 `useEffect` 長得很像，只差在 `Effect` 執行時間點。

`useEffect` 會在畫面更新之後執行，而 `useLayoutEffect` 會在畫面更新之前執行。



## 也許不需要 useEffect 的場景

---

1. 拿來計算在 render 就可以計算出來的值：在狀態或參數更新後去計算另一個狀態

   ```js
   function Form() {
     const [firstName, setFirstName] = useState('Taylor')
     const [lastName, setLastName] = useState('Swift')

     // 🔴 Avoid: redundant state and unnecessary Effect
     const [fullName, setFullName] = useState('')
     useEffect(() => {
       setFullName(firstName + ' ' + lastName)
     }, [firstName, lastName])

     // good: 直接計算得到就可以了，re-render 到最後本來就會拿到 firstName, lastName 最新的值
     const fullName = firstName + ' ' + lastName
   }
   ```

   如果是比較昂貴的計算，且不需要在每次 render 完都重新計算結果，就可以用 `useMemo` cache 住計算結果，並在 dependency 去傳入這個計算依賴的狀態，代表我們只需要在這些依賴狀態有變化的時候才要重新計算，其他時候就用舊的值即可。

   ```js
   import { useMemo, useState } from 'react'

   function TodoList({ todos, filter }) {
     const [newTodo, setNewTodo] = useState('')
     // ✅ Does not re-run getFilteredTodos() unless todos or filter change
     const visibleTodos = useMemo(
       () => getFilteredTodos(todos, filter),
       [todos, filter]
     )
     // ...
   }
   ```

2. 在狀態或參數改變之後重置 component 的狀態

   如果想在傳入的 `userId` 改變之後就把 `comment` 重置，可能會寫 `useEffect`。

   ```js
   export default function ProfilePage({ userId }) {
     const [comment, setComment] = useState('')

     // 🔴 Avoid: Resetting state on prop change in an Effect
     useEffect(() => {
       setComment('')
     }, [userId])
     // ...
   }
   ```

   但其實可以利用 react 提供的 `key` 屬性，把 `userId` 傳入。一般來說在同樣的位置 component 會被當成是同一個，內部狀態也會被保留，但藉由這個不同的 `key` React 就知道這跟之前的 component 是不同的，不會讓他們共用 state。（React 會重畫 DOM，並把元件與子元件都重置）

   ```js
   export default function ProfilePage({ userId }) {
     return <Profile userId={userId} key={userId} />
   }

   function Profile({ userId }) {
     // ✅ This and any other state below will reset on key change automatically
     const [comment, setComment] = useState('')
     // ...
   }
   ```

3. 拿來處理應該是事件驅動的計算

   如果 Effect 是跟事件相關的，可以直接寫在 event handler，這樣可以更簡潔，也少一層 `useEffect` 理解的成本。

   例如：我要在東西放進購物車時去跳提醒

   ```js
   function ProductPage({ product, addToCart }) {
     // 🔴 Avoid: Event-specific logic inside an Effect
     useEffect(() => {
       if (product.isInCart) {
         showNotification(`Added ${product.name} to the shopping cart!`)
       }
     }, [product])

     function handleBuyClick() {
       addToCart(product)
     }

     function handleCheckoutClick() {
       addToCart(product)
       navigateTo('/checkout')
     }
     // ...
   }
   ```

   直接在 event handler 寫跳提醒的邏輯，因為這時候你其實已經知道東西被加進購物車了。如果是上面寫在 `useEffect` 程式再更複雜一點，又沒有寫註解的話，其他改到這支程式的人可能會需要花多一點時間去理解這段在做什麼。

   ```js
   function ProductPage({ product, addToCart }) {
     // ✅ Good: Event-specific logic is called from event handlers
     function buyProduct() {
       addToCart(product)
       showNotification(`Added ${product.name} to the shopping cart!`)
     }

     function handleBuyClick() {
       buyProduct()
     }

     function handleCheckoutClick() {
       buyProduct()
       navigateTo('/checkout')
     }
     // ...
   }
   ```

4. 用 `useEffect` 進行連鎖計算

   這可能會導致 component 被 re-render 好幾次，造成不必要的效能支出。如同下方例子：

   `setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render

   ```js
   function Game() {
     const [card, setCard] = useState(null);
     const [goldCardCount, setGoldCardCount] = useState(0);
     const [round, setRound] = useState(1);
     const [isGameOver, setIsGameOver] = useState(false);
   
     // 🔴 Avoid: Chains of Effects that adjust the state solely to trigger each other
     useEffect(() => {
       if (card !== null && card.gold) {
         setGoldCardCount(c => c + 1);
       }
     }, [card]);
   
     useEffect(() => {
       if (goldCardCount > 3) {
         setRound(r => r + 1)
         setGoldCardCount(0);
       }
     }, [goldCardCount]);
   
     useEffect(() => {
       if (round > 5) {
         setIsGameOver(true);
       }
     }, [round]);
   
     useEffect(() => {
       alert('Good game!');
     }, [isGameOver]);
   
     function handlePlaceCard(nextCard) {
       if (isGameOver) {
         throw Error('Game already ended.');
       } else {
         setCard(nextCard);
       }
     }
   
     // ...
   ```

   改善的作法是可以將判斷的邏輯都放到一個 function 裡面，或是直接在 render 計算。而且因為 batching 特性，這些 setState 會一 次去更新，也減少了不必要的 re-render

   ```js
   function Game() {
     const [card, setCard] = useState(null)
     const [goldCardCount, setGoldCardCount] = useState(0)
     const [round, setRound] = useState(1)
   
     // ✅ Calculate what you can during rendering
     const isGameOver = round > 5
   
     function handlePlaceCard(nextCard) {
       if (isGameOver) {
         throw Error('Game already ended.')
       }
   
       // ✅ Calculate all the next state in the event handler
       setCard(nextCard)
       if (nextCard.gold) {
         if (goldCardCount <= 3) {
           setGoldCardCount(goldCardCount + 1)
         } else {
           setGoldCardCount(0)
           setRound(round + 1)
           if (round === 5) {
             alert('Good game!')
           }
         }
       }
     }
   }
   
   // ...
   ```

## Reference

---

[React docs](https://react.dev/learn/you-might-not-need-an-effect)
