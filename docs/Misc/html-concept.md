---
enableComments: true
---

# HTML 一些觀念

## script tag

---

### normal plain script tag

**狀況一：放在隨便一個地方**

```html
<body>
  /* some html here */
  <script src="app.js"></script>
  /* rest html here */
</body>
```

1. 建構 script 上方 HTML
2. JS 下載
3. JS 執行
4. 建構 script 下方 HTML

這個方法會阻塞 DOM 建構，如果 `app.js` 是比較大的檔案，畫面可能會較久才能完整呈現。所以通常會放在所有 html 的後面。

**狀況二：放在所有 html 的後面**

```html
<body>
  /* some html here */
  <script src="app.js"></script>
</body>
```

1. 建構 script 上方 HTML
2. JS 下載
3. JS 執行
4. HTML 可以互動

這個方法雖然不會阻塞 DOM 建構，如果 `app.js` 是有點大的檔案，畫面可能變成已經出現了，但因為 JS 還沒下載完，不能夠互動。

因此後來出現兩個屬性，`defer`, `asyc` 可以處理上述的問題。

### script tag with defer

```html
<script src="app.js" defer>
```

- 會在背景下載 JS ，不會阻塞 DOM 建構，並且確保會在 DOM 建構完成才執行 JS。
- 有多份 JS 時，會依照引入順序去執行，而非下載完成順序
- JS 有多份、且有相依性，需要在 DOM 準備好之後才執行的狀況適用
- 這個方法跟把 script tag 放到最後，雖然都是最後才執行 JS，但差異是，JS 的下載可以跟 DOM 建構並行，因此可以節省一點時間。

### script tag with async

```html
<script src="app.js" async>
```

- 會在背景下載 JS ，不會阻塞 DOM 建構，下載完畢的 JS 會被立刻執行。
- 有多份 JS 時，無法保證執行順序等於引入順序

### ref

https://www.explainthis.io/zh-hant/interview-guides/frontend/fe-script-async-defer-difference

https://pjchender.dev/javascript/js-async-defer/#defer

https://ithelp.ithome.com.tw/m/articles/10216858



## Semantic elements

---

sematic elements 語意化標籤，在 HTML 當中指的是那些可以清楚定義內容目的的標籤。

例如，`<article>`, `<header>`, `<footer>` 就會稱之為語意化標籤。反之，像是 `<div>`, `<span>` 這種即是無語意的標籤。

而為何我們需要語意化標籤呢？

除了使開發人員本身更能一目了然 HTML 的結構，對於程式來說也更容易解讀。

網頁在被搜尋引擎解析時，能夠因為語意化標籤的存在而更有辦法了解網頁的架構，就使得他有更好的 SEO。另外，語意化標籤也長用於建構無障礙的網站，這是為了輔助設備能夠良好地理解網頁的架構。
