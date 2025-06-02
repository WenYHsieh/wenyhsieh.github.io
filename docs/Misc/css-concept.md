---
enableComments: true
---

# CSS 一些觀念

## Box model

---

Box model 是將 html 元素當作一個很多層的盒子來定義的模型，CSS 能夠針對不同層做樣式變化。

由內而外分別是:

- content 內容
- padding 內邊距
  - border 和 content 之間的距離。
  - 是向內畫，因此可能會壓縮到內容，影響元素實際的寬高。
- border 邊框
  - 元素的外框。
  - 是向內畫，因此可能會壓縮到內容，影響元素實際的寬高。
- margin 外邊距
  - 和其他元素的距離。
  - 因為是向外擴張的，不會影響元素實際的寬高。

比較要注意的點是，**box model 預設為 content-box**，指的是對這個元素定義的寬高是 content，因此調整 padding 或 border 後會使得整個元素寬高變得更大，造成變形。這時候改設定 box model 為 border-box，在此設定之下調整 padding 跟 border，CSS 會自動計算調整各個部分的大小，讓 border 以內範圍的寬高符合我們所設定的寬高。

## CSS 常用 selector

---

|        | 意義                                |
| ------ | ----------------------------------- |
| a b    | 選中所有子元素                      |
| a > b  | 選中最靠近的子元素                  |
| a ~ b  | 選中所有同級元素                    |
| a + b  | 選中最靠近的同級元素                |
| .a.b   | 選中同時具有 a, b class name 的元素 |
| a[x=y] | 選中 x 屬性被設定為 y 的 a 元素     |
| \*     | 全選                                |
| #a     | 選中 id 為 a 的元素                 |
| div    | 選中所有 div 元素                   |

- div .a.b
  - 選中 div 的所有子元素，有 class name a 及 b 的所有元素
- div .a .b
  - 選中 div 所有子元素符合 class name 為 a 的所有元素，這個元素符合 class name 為 b 的所有元素
- div section
  - 選中 div 為 section 元素的所有子元素
- div > section
  - 選中 div 最接近的一個為 section 的子元素
- div + section
  - 選中 div 最接近的一個為 section 的 sibling 元素 (同一層級）
- div ~ section
  - 選中 div 最接近的所有為 section 的 sibling 元素 (同一層級)

## class name Naming convention

---

CSS 是全域的，因此會有 class name 相同後面覆蓋到前面的問題，BEM 是一種為了解決此問題而出現的一種命名慣例，三個字母分別代表 Block、Element、Modifier。

- Block: 可重用的區塊
- Element: 區塊當中的元素
- Modifier: 此元素的狀態。如：active, inactive

因此 BEM 把一個元素的 class 用這三者來加以定義，使之形成 scope，來減少撞名的可能。

例如，元素是一個資訊卡中的按鈕，可能會這樣命名：`infoCard__button--active` -> `[Block]__[Element]--[Modifier]`

## display

---

- inline 行內元素
  - 寬高由內容物來決定，無法自訂寬高。
  - 和其他元素的關係：可併排在同一行。
  - 上下 margin 亦無法調整 (左右可以)，padding 無效。
  - 常見: a, span, img ...。
- block 區塊元素
  - 預設寬度會佔滿整行。
  - 和其他元素的關係：他之後的元素就會換到下一行。
  - 可以調整寬高及其他屬性不受限制。
  - 常見: div, h1, p ..。
- inline-block 行內區塊元素
  - 同時具有 inline 及 block 的特性。
  - 和其他元素的關係：可併排在同一行。
  - 可以調整寬高及其他屬性不受限制。
  - 常見: button, input, select。

## position

---

- static 靜態定位
  - 排版流的預設狀態
  - 從左上角開始畫，由上而下自動排列。
  - 此時指定上下左右屬性皆無效。
- relative 相對定位
  - 設定元素要由原本的位置 x, y 軸偏移多少的位置開始畫。
  - 它的特色是不會去擠壓到周邊的其他元素。
- absolute 絕對定位
  - 跳脫排版流，以「參考點」作為基準來畫。
  - 參考點會從設定絕對定位的這層元素開始往上找，第一個非 static 的元素就會成為參考點。若都找不到非 static，就會以 body 做為參考點 (左上角)。
- fixed 固定定位
  - 跳脫排版流，以瀏覽器的位置 (viewport) 來做定位。
  - 不會影響到周邊其他元素。

## font-face

---

引入自定義字型用的。

如下：

引用 `url` 引用 `.woff`, `opentype` 兩種字型檔案，定義 `font-family` 為 `nicefont`，即可使用這個 font-family。

用 `format` 可以告訴瀏覽器字型檔案的類型，瀏覽器看到後可以先判斷支不支援，而不需等到真正的字型檔案載入後才判斷。

```css
@font-face {
  font-family: 'nicefont';
  src: url(ideal-sans-serif.woff) format('woff'), url(basic-sans-serif.ttf)
      format('opentype');
}

body {
  // 第一順位套用 nicefont，不支援的話換用 serif
  font-family: 'nicefont', 'serif';
}
```

Reference:

https://blog.gtwang.org/web-development/css-font-face/

## 垂直與水平置中的作法

---

**文字 in div:**

- 垂直：

  - flex + align-items: center

    ```html
    <div class="container">
      <p>文字</p>
    </div>
    ```

    ```css
    .container {
      display: flex;
      align-items: center;
      height: 100px;
      border: 1px solid red;
      background-color: pink;
    }
    ```

  - line-height: 行高就是單行的高度，把他、設定為元素 height

    ```css
    .container {
      height: 100px;
    }
    
    p {
      line-height: 100px;
    }
    ```

- 水平：

  - flex + justify-content: center

    ```css
    .container {
      display: flex;
      justify-content: center;
      height: 100px;
      border: 1px solid red;
      background-color: pink;
    }
    ```

**Div in div**

- 垂直：
  - 外層 div dispaly: flex + align-items: center
  - 內層 div position: absolute + top: 50% + transform: translateY(-50%) （外層 div 不可為 position: static)
- 水平：
  - 外層 div display: flex + justify-content: center
  - 內層 div position: absolute + left: 50% + transform: translateX(-50%) （外層 div 不可為 position: static)
  - 內層 div margin: 0 auto (元素要記得設定寬度)

## CSS 優先級

---

在 CSS 當中有各種定義樣式的寫法，例如使用 id, class 或者直接用標籤名稱定義，瀏覽器會通過一個優先級分數的計算，最後呈現在畫面上的會是最高分者（如果有同分的，後面的會被套用）。

**優先級分數**

- 一般可分為三個位置計算 `X-Y-Z`:

  - X: id selector (`#`) 的數量

  - Y: class selector (`.`), attribute selector (`[a=b]`), pseudo-classes (`:`) 的數量

  - Z: element selector (ex: `div`), pseudo-elements (`::`) 的數量

- 優先級別高低分別是：X > Y > Z

  - 有兩個例外：`!important` 及 inline style。inline style 會優先於所有 selector ，`!important` 則可以保證絕對會被套用。

- Universal selector (`*`) 及 combinator (`+`, ` ~`, ` >`) ，不計分

**使用原則**

應該盡量比免使用 `!important` 來蓋過樣式，因為他會破壞計分規則，造成 debug 的困難。可以去考慮加上一些 selector 來讓樣式的指定更加明確以增加優先級

Reference:

https://specifishity.com/

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity#%E4%BC%98%E5%85%88%E7%BA%A7%E6%98%AF%E5%A6%82%E4%BD%95%E8%AE%A1%E7%AE%97%E7%9A%84%EF%BC%9F)



## CSS reset v.s. normalize

---

**reset**

清除元素的預設樣式，如 margin, padding。要注意瀏覽器渲染結果可能有差異

**Normalize**

CSS Normalize 是在保持有用預設樣式同時，盡量減少不同瀏覽器之間差異。

他為各元素提供基礎樣式，來建立更一致的起點，也修復了一些常見的樣式問題，使元素在各瀏覽器之前顯示更加一致。



## Common CSS solution

---

**SASS/SCSS**

CSS pre-processor，提供一些像是程式語言語法，例如：巢狀 class 定義、變數、迴圈等等，來幫助提升 CSS 可讀性、重用性。

仍然存在 CSS class 全域的問題，通常可以用一些 class 命名規範來解決，如：BEM 命名法

**CSS-in-JS**

將 CSS 撰寫在 JS 檔案裡面，增加 JS 動態控制樣式的能力，可以比較容易做出較複雜的動畫

- Styled-components
- CSS module
