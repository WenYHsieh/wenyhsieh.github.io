### npm install v.s. npm ci

- npm install

  基於 package.json 安裝還原套件，有機會動到 package.lock.json

- npm ci

  基於 package.lock.json 安裝還原套件

> 基本上這兩個指令都有屬於它的使用時機，當你想要還原專案並更新套件時就使用 `npm install`，若你想要統一版本而不想修改到 package-lock.json 的話就是使用 `npm ci`，除此之外如果是要用於 CI/CD 的話則會建議使用 `npm ci` 取代 `npm install` 會更好更穩定。