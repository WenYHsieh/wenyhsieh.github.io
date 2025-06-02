---
enableComments: true
---

# Redux 非同步行為處理及 Redux Middleware

<img src={require("./img/reduxAsunc01.gif").default} alt="img" style={{zoom: "33%"}} />

## Redux Middleware 是什麼及功能是什麼？

---

賦予 Redux 更多功能性的中介程式，他會攔截進到 Reducer 之前的 action，作一些額外的事情之後，例如處理 Side Effect、紀錄 redux 的 log 等等，最後再透過 dispatch action 傳到 Reducer。middleware 也可以串聯使用。

使用 middleware 的好處是，可以讓 Reducer 的功能保持單純只要處理狀態更新就好，其他事情拆分出去讓 middleware 負責。

## 用 Redux Middleware 處理非同步行為

---

雖然沒有使用 Redux middleware，我們仍然可以在直接在 `useEffect` 或甚至 reducer 直接 call API。但是 Redux 官方並不推薦這個用法，建議是要使用 Redux middleware 像是 Redux-thunk 或 Redux-saga 這樣處理非同步行為專用的 middlewares。因為他可以讓我們更好地管理非同步操作和副作用，Reducer 會有較好的預測性、維護性，也較便於測試，如果專案變得更大，也會更利於擴充。

然而，使用 middleware 畢竟也是需要學習成本，比起直接在 useEffect 裡面 call API 這類直接的作法，也會多出不少額外的程式碼需要管理，如果是個人的小專案也許不必動用到。不過，在複雜的應用程式中，使用 Redux middleware 就會是不錯的選擇。

最常用的有 Redux-thunk（Redux toolkit 內建) 以及 Redux-saga。以下簡單介紹 Redux-saga 使用方式。

## Redux-saga

---

Redux-saga 是個管理非同步行為的 Redux middleware，他使用 ES6 generator function 來實作，讓我們可以用類似於 async/await 的方式撰寫非同步程式碼，使得程式碼得以更簡潔、容易維護與拓展。

**基礎配置**

1. 安裝

   ```shell
   $ yarn add redux-saga
   ```

2. 建立與 Redux 之間的關聯

   **建立一個基本的 saga (generator function)**

   ```js
   // todo slice
   ...
   export const slice = createSlice({
       name: 'todo',
       initialState,
       reducers: {
         	GET_TODOS: () => {},
           SET_TODOS: (state, action: PayloadAction<Todos>) => {
             state.todos = action.payload
           },
       }
   });

   export const {
     	GET_TODOS,
       SET_TODOS,
   } = slice.actions;

   export default slice.reducer;

   ```

   ```js
   // saga
   import { put, takeEvery, all, call } from 'redux-saga/effects'

   export function* helloSaga() {
     console.log('Hello Sagas!')
   }

   // get todos 用的 saga，負責呼叫 API 去拿 todos，最後 dispatch SET_TODOS 存入結果
   export function* getTodos() {
     try {
       // 用 call 進行 API 呼叫，call 為指示用 effect，會指示 redux-saga 去執行傳入的 function，
       // 這例子中會執行 fetchTodos，response 會由 yield 取得
       const response: ResponseGenerator = yield call(fetchTodos)
       const convertedResponse = convertTodos(response)
       // 用 put 來發起 dispatch action
       yield put(SET_TODOS(convertedResponse))
     } catch (error) {
       console.error(error)
       // error handling...
     }
   }

   // 監聽所有 GET_TODOS action，如果被 dispatch 就執行 getTodos saga
   export function* watchTodoAsync() {
     yield takeEvery(GET_TODOS, getTodos)
   }

   // 將所有 saga 結合成一個 rootSaga export
   export default function* rootSaga() {
     // 同步在背景運行多個 saga
     yield all([helloSaga(), watchTodoAsync()])
   }
   ```

   **把 rootSaga 註冊為 Redux middleware**

   ```js
   import { createStore, applyMiddleware } from 'redux'
   import rootSaga from './sagas'

   // 建立 middleware
   const sagaMiddleware = createSagaMiddleware()
   const store = createStore(reducer, applyMiddleware(sagaMiddleware))
   //
   sagaMiddleware.run(rootSaga)

   // ...
   ```

## Reference

---

[Redux-saga docs](https://redux-saga.js.org/docs/basics/DeclarativeEffects)
