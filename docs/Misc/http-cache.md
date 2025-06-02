---
enableComments: true
---

# cache 機制

> 以下觀念整理自 [循序漸進理解 HTTP Cache 機制](https://blog.techbridge.cc/2017/06/17/cache-introduction/)

### cache-control

---

**判斷資料何時過期的 response header**

- `Expires` 告訴瀏覽器資源過期時間，瀏覽器收到這個 Response 之後就會把這個資源給快取起來，當下一次使用者再度造訪這個頁面或是要求這個圖片的資源的時候，瀏覽器會檢視「現在的時間」是否有超過這個 Expires。如果沒有超過的話，那瀏覽器「不會發送任何 Request」，而是直接從電腦裡面已經存好的 Cache 拿資料。status code 後面會出現 `from disk cache` 。

  > 問題是，時間是檢視該台電腦上面的系統時間，這樣就可能造成結果不如預期

- `max-age` 為解決 Expires 問題而出現，改為設定秒數，例如 31536000 就是 365 天後過期。一樣也是過期前都不會重發 request 拿資源。status code 後面會出現 `from memory cache`

  目前的機制中，`max-age`會蓋過`Expires`。因此現在的快取儘管兩個都會放，但其實真正會用到的是`max-age`。

  > 問題是，過期了還是可能這資源還可以用，例如他就是一年這長時間都不會更動，例如 google 的 logo

### Last-Modified 與 If-Modified-Since

---

**判斷何時真的應該更新資料用的 header**

`Last-Modified` 在 response header 上，會是這個資源最後更新的時間，如果過期了瀏覽器就會發一個 request 並在 request header 帶 `If-Modified-Since` 標示最後更新時間，表示他在問從這時間之後這資源有沒有更新。沒有的話會回 304，代表可以繼續用，有的話就會回傳新的。

> 這會遇到問題是，如果內容沒更動，但是檔案打開不編輯就儲存，也會更新檔案更新時間

### Etag 與 If-None-Match

---

**為解決上述問題可以搭配使用`Etag` 與 `If-None-Match` 。**

Etag 是 hash ，這 hash 由檔案產生，擁有檔案內容沒有改變 hash 就會是相同的特性

跟`Last-Modified`與`If-Modified-Since`使用一樣。 Server 在回傳 Response 的時候帶上`Etag`表示這個檔案獨有的 hash，快取過期後瀏覽器發送`If-None-Match`詢問 Server 是否有新的資料（不符合這個`Etag`的資料，就代表是有更新過資料），有的話就回傳新的，沒有的話就只要回傳 304 就好了。

### cache-control

---

max-age=0 搭配 etag 可以達到，每次都會去問 server 有沒有新的檔案，沒有就用舊的這樣的效果

這一點也可以用 `cache-control: no-cache` 搭配 etage 來實作。

`cache-control: no-cache` 代表不要直接使用 cache 的東西，而是每次都會發 req 去確認有沒有新的檔案。

> 容易搞混的是 `cache-control: no-cache / cache-control: no-store` 前者是不直接用的的意味，後者是完全不使用的意味，所以後者每次都會去拿新的檔案，會用在就是不想存任何東西在前端的時候，例如有機敏資料

SPA 可以使用 `no-cache` 搭配讓 bundler 輸出帶有 hash 的檔案（等同於 Etag)，來達到每次都會去問 server 有沒有新的檔案，沒有就用 cache 的檔案這樣的快取策略。

:::caution 注意事項

在 `req` , `res` header 帶的 cache 設定，影響特定 API 資源的 cache 策略，但 html `meta tag` 是影響此 html 檔案的快取策略

:::
