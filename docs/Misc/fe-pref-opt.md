# 前端效能優化紀錄

> 前端搭建技術：React, webpack
>
> 佈署 web server：Nginx

## 網頁效能常見術語

---

- **TTFB, Time to First Byte**：第一個 byte 傳來的時間
- **FP, First Paint**：瀏覽器開始繪製第一個 pixel 的時間
- **FCP, First Contentful Paint**：第一個能被使用者看見的內容出現的時間
- **TTI, Time To Interactive**：直到可以互動為止的時間

## 為何要提升第一次進系統的速度

---

1. 對 SEO 較好：有關於瀏覽器爬蟲每天分配給我們網站的時數有限

2. 提升使用者體驗

## 提升第一次進系統速度的思路

---

除了叫使用者換快一點的網路之外，縮短下載速度是一個可以下手的點…

**縮小 bundle size**

1. 檢查並刪掉不需要的 code（註解或沒用到的 import 之類的）
2. 增加系統模組化程度，抽出共用邏輯、元件等等
3. 壓縮 bundle：使用壓縮演算法（例如 gzip、Brotli）來縮小 bundle 的大小，從而減少傳輸時間。
   - 使用 CompressionWebpackPlugin 在打包時對檔案進行壓縮
   - Nginx config 增加 ` gzip on;` ，開啟 gzip 模式

**利用 cache**

1. html header cache 設定
2. 打包設定 split chunks 方便瀏覽器 cache
3. 打包設定輸出包含 hash 的檔案作為類似於 Etag 的功能

**設定 dynamic import**

以 route 為單位設定 dynamic import

- React `<suspense/>` and `React.lazy`
