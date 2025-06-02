# Electron.js

Electron.js 是一個讓你可以用網頁技術來寫跨平台桌面應用程式的 javascript 套件。

## 如何為不同作業系統平台開發桌面應用程式？

---

一般在 windows 當中可能會透過撰寫 C# 搭配 Windows form，在 MacOS 中可能會需要寫 swift 或 objective-c。

## Electron.js 是什麼，為何要用他？

---

2013 年左右 GitHub 團隊在開發 Atom 時候，因為也想要利用網頁技術去開發這個編輯器，當時市面上沒有比較好的解決方案，因此他們就決定自己開發這個工具，並命名為 Atom-shell，而後來改名為 Electron

Electron 將 Chromium 及 Node.js embed 在一起作為 runtime，使得我們可以利用前端技術來開發桌面應用程式，當然也可以使用你最喜歡的框架來開發

因為網頁具有跨平台的特性，目前是能支援到三個平台，windows, macOS, Linux（可以 output 這三種平台的安裝檔）

因此對一個 commercial 的產品來說，公司如果已經有個網頁，這時出現了需要這個網頁的 windows 及 MacOS 或應用程式版本的話，就會需要找到能夠寫這些語言的人，除此之外也會耗費不少時間在這個轉換上。這時候像是 Electron 這樣的套件就有他的市場出現了。

## Electron.js 優缺點比較

---

**優點：**

第一個顯著的好處就是跨平台，在系統要從網頁版本轉換為桌面應用程式時，公司可以剩下聘請 Native app 工程師的預算以及時間。

第二個是寫起來的體驗蠻接近在寫網頁的，對於已經對網頁技術有一點概念的開發人員，要上手 Electron 算是幾乎沒有學習成本

第三是因為跟網頁技術結合，他也可以算是共享前端的 community 社群，有龐大的社群支持。

**缺點：**

因為 Electron 會將 node.js 和 chromium bundle 在一起，因此他的應用程式大小會比用 native 語言及框架來寫還要更大上不少，即便只有最基礎的設定，Electron app 的安裝黨也有大約會有 100 MB 以上。

另外也因為他試圖用同一份 code 在不同 OS 上，Electron 對不同 OS 上有去作一些優化處理，使得他會比 Native OS 專一的 app 對於系統資源的利用效率還要來得比較沒那麼好。

在 Electron 程式碼當中其實會需要花時間去處理 OS 專一的功能，有人就覺得到頭來開發上可能更耗費時間

所以 Electron 其實帶來很多便利之餘也有許多不那麼好的地方

如果今天是單看已經有網頁版，要轉換到桌面應用程式的情況，或者要開發的系統比較小型，那 Electron 可能就會是個不錯的選擇

## 誰有在用 Electron.js?

---

以下是一些比較常見的 ，以 Electron 開發的 app，除了一開始有提到的 vscode，還有像是 messenger, twitch, 還有我們常用他來畫 ui flow 的 figma

## Multi-process architecture of chromium and Electron

---

瀏覽器的架構可以是單一 process 或多 process 的設計

在架構方面，Electron 繼承了 Chromium multi-process 的架構

在瀏覽器架構上，早期多為 **single process，就類似一個人作公司裡面所有的業務**

因為以前的瀏覽器功能較為單純，所一一個 process 的設計其實就足夠應付需求的狀況。

隨著網頁技術演進，瀏覽器已經變成不只需要管畫面的呈現，他也需要管更多次要的功能，例如多頁面或分頁的狀況或是載入第三方 extension 等等。使用單一 process 的架構可能會使得某一個功能壞掉或是很慢的時候，會連帶影響到其他的功能，也因此衍生出了後來比較主流的多 process 瀏覽器架構。 就類似公司開始分職位，讓個個職位的人去負責專一的業務

所以在多 process 架構底下，當瀏覽器打開的時候，會產生一個 process 開始跑，啟動的 process 可以要求作業系統建立新的 process 來處理其他任務，process 之間有獨立的記憶體空間，可以透過 inter-process communication (IPC) 來交流。以 chrome 來說 他讓每個分頁都擁有獨自的 process， 如果一個 tab 遭受到資安方面的攻擊，也相對比較不會影響到其他的分頁，也就是安全性比較高。

## Process modal in Electron

---

剛才提到在 Electron 當中也是採用 multi-process 的架構，在寫 Electron 的時候，開發人員會需要關注到的是 process modal 上面的三個部分， main process, renderer process 及 preload script

**main process**:

對應到的就是主 process，他是 Electron 的進入點，主要管三個部分:

1. Window management：在 main process 會去由產生  `BrowserWindow` 的 instance   來建立 application window ，這個 window 就是 app 內容以外的視窗本身。可以自訂許多參數去產生這個視窗，例如寬高，表提列、工具列或是背景的顯示等等。
2. Application lifecycle: Electron 也提供在 main process 去引入 app 這個 api ，讓你可以監聽不同 app 生命週期階段，然後寫一些比較客製化的行為
3. Native APIs: 最後， 在 main process 還可以使用 Electron 提供的 api 去存取作業系統的功能，例如 menus, dialogs, and tray icons

**Renderer process**:

顧名思義就是管網頁內容的部分，可以有好多個，每一個都是 Chromium 的實體，在建立應用程式視窗的時候可以以 html 為進入點來去將網頁內容本身載入到視窗，

如果需要在 main process 及 renderer process 之間溝通，Electron 也提供了一些 api 讓我們可去作 IPC，但因為安全考量，在比較後來版的的 Electron 以經預設禁止我們在 renderer process 取用 node.js 或 Electron module，因為操作通常是涉及一些權限很大的 api 的取用與操作，例如控制或存取你硬體的資訊。

**preload script**:

跟網頁內容會在不同的 context 中運行，也可以去存取 node.js 跟 Electron 提供的存取系統相關的 api ，這兩個特性下使得他可以作為 IPC 的媒介。

在創建視窗的時候可以設定 preload script 的路徑，他就會在 load 網頁內容之前先執行這個 script
