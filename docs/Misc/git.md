---
enableComments: true
---

# Git 常用指令

## merge

---

用於合併分支。依照與合併的標的沒無衝突可以分兩種：

- 無衝突：預設使用 `fast-forward` 參數選項，由 git 自動處理合併，新的 HEAD 就指到合併來源的最後一個 commit。

  > 執行合併時，使用 non fast-forward 參數選項，即使是可以 fast-forward 的合併也會建立新的 commit。

- 有衝突： 預設使用 `non fast-forward` 參數選項，需要先解完衝突後才可以合併。過程中會產生一個新 commit，新的 HEAD 就指到這新的 commit。

## Rebase

---

1. 用於合併分支。與合併的標的沒無衝突可以分兩種：

   - 無衝突：新的 HEAD 就指到合併來源的最後一個 commit。

   - 有衝突：分之中的 commit，需要一個個逐一解決衝突，新的 HEAD 就指到解完衝突的合併來源的最後一個 commit。

     > 解過衝突的 commit id 會跟原本不一樣

2. 合併 commit

   - 使用 `-i` flag 可以在 `push` 之前整理合併 commit 成一個

     `git rebase -i 9ae53`

## Cherry-pick

---

用來讓你選擇性地將特定的 commit 從一個分支複製到另一個分支，而不影響原始分支的歷史記錄。這適用於只想要一個或少數幾個 commit 的情況。

## Reference

---

https://backlog.com/git-tutorial/tw/stepup/stepup1_4.html

https://medium.com/starbugs/git-%E6%88%91%E4%BB%A5%E7%82%BA%E7%9A%84-git-rebase-%E8%88%87%E5%92%8C-git-merge-%E5%81%9A%E5%90%88%E4%BD%B5%E5%88%86%E6%94%AF%E7%9A%84%E5%B7%AE%E7%95%B0-cacd3f45294d
