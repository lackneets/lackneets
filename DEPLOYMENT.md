# Deployment Guide — lackneets.tw

這份文件記錄目前 `lackneets.tw` 的 GitHub Pages 部署方式。

## 目前架構

- 正式站來源：`stage/`
- Git branch：`main`
- GitHub Pages 部署方式：**GitHub Actions**
- Custom domain：`lackneets.tw`
- `stage/CNAME` 已存在，內容為：`lackneets.tw`
- workflow 檔案：`.github/workflows/deploy-pages.yml`

也就是說：

- 平常改網站內容 → 改 `stage/` 裡的檔案
- commit 後 push 到 `main`
- GitHub Actions 會先把 `stage/` 複製成乾淨的 Pages artifact（排除 GitHub Pages 不接受的 symlink / server-side 殘留）
- 然後自動部署到 GitHub Pages

---

## 你需要在 GitHub 上做的設定（只要做一次）

進入 repo：

`https://github.com/lackneets/lackneets`

然後：

### 1. 開啟 GitHub Pages

到：

- `Settings`
- `Pages`

在 **Build and deployment** 裡確認：

- **Source** = `GitHub Actions`

如果不是，改成 `GitHub Actions`。

> 目前這個 repo 不是用 `gh-pages` branch，也不是用 `docs/`。
> 是靠 GitHub Actions 把 `stage/` deploy 上去。

### 2. 確認 Custom domain

同一頁面確認：

- **Custom domain** = `lackneets.tw`

如果空白，就填入：

`lackneets.tw`

然後儲存。

### 3. 等待第一次 workflow 完成

到：

- `Actions`

確認 `Deploy GitHub Pages` workflow 有成功。

成功後，`lackneets.tw` 才會真正掛起來。

---

## 平常怎麼手動部署

### 最簡單流程

```bash
cd /Users/openclaw/lackneets.tw
git status
git add .
git commit -m "你的更新內容"
git push origin main
```

push 之後：

- GitHub Actions 會自動部署 `stage/`
- 不需要另外手動 build
- 不需要另外切 `gh-pages` branch

---

## 手動重新觸發 deploy

如果你只是想重跑一次部署，不改內容也可以：

1. 打開 GitHub repo 的 `Actions`
2. 點 `Deploy GitHub Pages`
3. 點 `Run workflow`
4. branch 選 `main`
5. 執行

---

## 本機預覽

如果要先在本機看：

```bash
cd /Users/openclaw/lackneets.tw/stage
python3 -m http.server 8080
```

然後打開：

- `http://127.0.0.1:8080`

如果是透過 Cloudflare / 外部網址預覽，記得可能會遇到 cache。

---

## 內容編輯原則

### 正式站內容改哪裡？

改 `stage/`。

常用檔案：

- 首頁：`stage/index.html`
- 首頁 JS：`stage/js/main.js`
- portfolio 中文：`stage/portfolio/index.html`
- portfolio 英文：`stage/portfolio/en.html`
- 首頁 icon 字型：`stage/vendor/fontello/`
- portfolio icon 字型：`stage/portfolio/vendor/fontello/`

### Custom domain

不要刪掉：

- `stage/CNAME`

內容應該保持：

```txt
lackneets.tw
```

### Jekyll

不要刪掉：

- `stage/.nojekyll`

### GitHub Pages artifact 例外項目

目前 workflow 會在 deploy 前排除這些 `stage/` 內的 symlink / 非靜態殘留：

- `stage/tubetunnel`
- `stage/cloud`
- `stage/invoice`
- `stage/babel.php`
- `stage/lessc.php`

原因：GitHub Pages artifact 不接受這些 symlink 類內容，會讓 `upload-pages-artifact` 直接失敗。

---

## 常見問題

### 1. 網站是 404 / There isn't a GitHub Pages site here

通常代表：

- GitHub Pages 還沒開
- `Settings > Pages` 沒設成 `GitHub Actions`
- workflow 還沒成功

### 2. push 成功了但網站還是舊的

先看：

- GitHub Actions 是否完成
- Cloudflare / browser cache 是否還沒更新

### 3. 要不要用 `gh-pages` branch？

目前 **不用**。

現在這個 repo 的正式方式是：

- `main` branch
- GitHub Actions deploy `stage/`

---

## 這次部署相關 commit（參考）

- `1b90305` — prepare static site for GitHub Pages deployment
- `c472fee` — refresh portfolio bilingual content and recent hardware interests
- `8e36664` — restore npm packages item in portfolio other works
- `b2a96b5` — add instagram icon class and reorganize site social links
- `3170a38` — regenerate fontello assets and finalize social link updates

---

## 之後可以整理的方向

目前首頁與 portfolio 的依賴幾乎是兩套分開的。
之後如果要整理，可以考慮：

1. 共用 icon / social links / asset pipeline
2. 抽共用資料來源
3. 最後再一起整合進 Astro
