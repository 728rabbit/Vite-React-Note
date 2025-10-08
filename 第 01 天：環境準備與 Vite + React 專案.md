
### 1️⃣ 安裝 Node.js

-   React 需要 Node.js 環境（包含 npm）
    
-   前往官方網站下載安裝：https://nodejs.org/
    
    -   推薦下載 **LTS（長期支援版）**
        

安裝完成後，打開終端機（Terminal / CMD / PowerShell），確認版本：

    node -v
    npm -v 

如果出現版本號，代表安裝成功。

----------

### 2️⃣ 建立 Vite + React 專案

在你想放專案的資料夾裡執行：

    npm create vite@latest my-app

 

-   它會問你：
    
    -   **Project name** → 可以輸入 `my-app` 或你喜歡的名字
        
    -   **Framework** → 選 `React`
        
    -   **Variant** → 選 `JavaScript`（新手先不要用 TypeScript）
        

完成後進入專案：

    cd my-app
    npm install

啟動開發伺服器：

    npm run dev

-   看到類似這樣的訊息：
    
    Local: http://localhost:5173/

-   用瀏覽器打開網址，你會看到 Vite + React 的範例頁面。🎉
    

----------

### 3️⃣ 認識專案結構

       my-app/
        ├─ index.html # 網頁入口 
        ├─ package.json # 專案依賴與指令 
        ├─ src/
        │   ├─ main.jsx # React 入口檔 │   
            ├─ App.jsx # App 主組件 
            │   
            └─ assets/ # 圖片、CSS 等 
        └─ vite.config.js # Vite 設定檔

今天的目標完成：

-   Node.js 安裝成功
    
-   Vite + React 專案建立完成
    
-   可以在瀏覽器看到 React 頁面
