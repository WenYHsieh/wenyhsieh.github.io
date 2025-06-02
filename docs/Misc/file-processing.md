# Front-end file processing

角色關係

- File

  > `File` objects are generally retrieved from a [`FileList`](https://developer.mozilla.org/en-US/docs/Web/API/FileList) object returned as a result of a user selecting files using the [`input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) element, or from a drag and drop operation's [`DataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object.

  - 單一檔案
  - 通常透過 input tag (type='file') 或拖放動作取得的檔案物件
  - 繼承 Blob，且有檔案資訊的物件

- FileList

  - 檔案列表
  
- Blob (Binary Large Object)

  - 二進位格式的資料塊的通稱
  - 因為結構不明確的資料無法存入資料庫，因此將這樣的檔案轉換成 blob 這樣的二進位格式來儲存
  
- ArrayBuffer

- Object URL

  - 也稱為 Blob URL，是一個由 URL.createObjectURL() 方法創建的 DOMString。
  - 用於指向 File 或 Blob 對象。
  - 可以用於在瀏覽器中顯示或下載內容。

- Data URL

  - 格式為：`data:[<mediatype>][;base64],<data>`

-  MIME 型別 - MIME Type (Multipurpose Internet Mail Extensions Type)

  一種用來描述檔案格式的標準化方式，Ex.圖檔可能就會是`image/png`。也可以稱為「媒體類型」（media type）、「内容類型」（content type)。瀏覽器通常使用MIME type，而「不是」我們一般看到的檔案的副檔名(file extention)來決定怎麼處理這份文件。

使用情境

- 上傳檔案

  - 通常檔案大小小會用 base64 跟其他資料擺在一起傳，這樣 content-type 就可以用 application/json

  - 檔案大小大會用 content-type multipart/form-data，檔案用二進位檔案，File or Blob

- 檔案格式比對

- 預覽

- 下載檔案

  - 回 blob, 轉 objectURL 下載
  - 回 text/csv，res.text() 拿資料 ，轉 blob 再轉 objectURL 下載
  - 回 application/vnd.openxmlformats-officedocument.spreadsheetml.sheet ，res.blob() 拿資料 ，再轉 objectURL 下載
  - 通常會放檔名在這個 header ->  content-disposition: attachment; filename=article_80.xlsx

- 本地端編輯存擋應用

---

```javascript
// 假設我們有一個文件輸入元素
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', async (event) => {
  // 獲取 File 對象
  const file = event.target.files[0];
  console.log('File:', file);

  // 從 File 創建 Blob
  const blob = new Blob([file], { type: file.type });
  console.log('Blob:', blob);

  // 將 Blob 轉換為 ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();
  console.log('ArrayBuffer:', arrayBuffer);

  // 創建 Object URL
  const objectURL = URL.createObjectURL(blob);
  console.log('Object URL:', objectURL);

  // 創建 Data URL
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataURL = e.target.result;
    console.log('Data URL:', dataURL);
  };
  reader.readAsDataURL(blob);

  // 使用示例：顯示圖片
  if (file.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = objectURL;
    document.body.appendChild(img);
  }

  // 清理 Object URL
  URL.revokeObjectURL(objectURL);
});
```