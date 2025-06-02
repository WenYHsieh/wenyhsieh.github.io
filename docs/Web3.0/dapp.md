# DApp

DApp (Decentralized Application) 是一種基於去中心化開發的 App。

網頁架構方面，一般的 web2 SPA 網站前端可以透過發送 HTTP request 來跟後端溝通，後端接到 request 後向資料庫 query 資料後處理回傳 response 到前端。

DApp 則是會透過 ABI （Application Binary Interface）去與區塊鏈上的智能合約溝通（即 transaction）來達成需求的功能。



## truffle

---

智能合約開發框架 (development environment)。

**安裝並執行初始化：**

```bash
npm -g install truffle
truffle init
```

初始化後會自動在專案路徑下創建兩個資料夾：

- contract 路徑底下為智能合約 `.sol`
- Migrations 路徑底下會放智能合約 deploy 到區塊鏈用的腳本
  - 用 JS 撰寫的
  - 執行順序對應到最前面的編號。ex: `1_initial_migration.js` 

**基本指令：**

- `truffle compile`：把智能合約 compile 成 `.json` meta data

- `truffle migrate`：把智能合約 compile 之後 deploy 到區塊鏈


- `truffle console`：用 console 模式跟智能合約互動

**與 Ganache 連線：**

`truffle-config.js` port 修改為 Ganache 所在的 port

```js
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
  },
  compilers: {
    solc: {
      version: '0.8.4', // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
}

```



## Ganache

---

private blockchain，包含 EVM，for 開發測試用，跟 truffle 連線之後就可以把 contract depoly 到這，可以執行 contract，他預設會提供許多測試用帳號讓你作 transaction 使用。



## web3.js

---

他是一個讓你可以去跟 local 或 remote 的 etherum node 互動的 library 集合

例如要跟 ethereum 上的智能合約互動可以這樣:

```bash
> truffle console
truffle(development) > new instance = new web3.eth.Contract(ContractName.abi, "0xF33.....")
```

> ContractName: 智能合約名稱
>
> contract address: 智能合約地址，如 "0xF33..."

或者取得變數，呼叫 `funds()` 拿到 `funds` 變數

```bash
> const funds = await instance.methods.funds().call()
```



### sendTransaction

---

```bash
truffle(development) > new web3.eth.sendTransaction({from: "addressOfFromAccount", to: "addressOfToAccount", value: "ethUnitInWei"})
```

> addressOfFromAccount: from address
>
> addressOfToAccount: to address
>
> ethUnitInWei: 以 wei 為單位的 ETH



## MetaMask

---

- 以太坊相關網路的熱錢包的一種
- 管理你的帳號，作為橋樑，讓我們的 DApp 可以與 ethereum 互動
- 會 inject 一個 provider API 到 `window.ethereum`
- private key (32 bytes, 64 hex characters) 由 助記詞 ＋ password 經過 metamask algo. 產生 
- public key (32 bytes)  由 private key 會經過 [Elliptic Curve Digital Signature Algorithm](https://wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) 產生 
- address (20 bytes) = `0x + last 20 bytes of public key`

wallet method:

https://docs.metamask.io/wallet/reference/wallet_switchethereumchain/

