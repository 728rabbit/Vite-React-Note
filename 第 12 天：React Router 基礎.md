## 🧩 一、安裝 React Router

在專案資料夾終端機輸入：

`npm install react-router-dom` 

> 注意：React Router 6 以後的版本語法跟以前有差別，我們用最新版本。

----------

## 🧩 二、基本設定

    // index.jsx
    import React from "react";
    import ReactDOM from "react-dom/client";
    import { BrowserRouter } from "react-router-dom";
    import App from "./App";
    
    ReactDOM.createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );


-   用 `<BrowserRouter>` 包住 App
    
-   這是路由的基礎容器
    

----------

## 🧩 三、定義路由

    // App.jsx
    import { Routes, Route, Link } from "react-router-dom";
    
    function Home() {
      return <h1>首頁</h1>;
    }
    
    function About() {
      return <h1>關於我們</h1>;
    }
    
    function Contact() {
      return <h1>聯絡我們</h1>;
    }
    
    function App() {
      return (
        <div>
          <nav>
            <Link to="/">首頁</Link> |{" "}
            <Link to="/about">關於</Link> |{" "}
            <Link to="/contact">聯絡</Link>
          </nav>
    
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      );
    }
    
    export default App;


-   `<Link to="/路徑">` → 替代 `<a>`，SPA 無刷新
    
-   `<Routes>` + `<Route path="..." element={組件}>` → 設定路由
    
-   `element={<Component />}` → 對應顯示的組件
    

----------

## 🧩 四、動態路由與參數

    function User({ name }) {
      return <h1>使用者：{name}</h1>;
    }
    
    // App.jsx 內
    <Route path="/user/:username" element={<UserWrapper />} />
    
    // 包裝組件拿參數
    import { useParams } from "react-router-dom";
    
    function UserWrapper() {
      const { username } = useParams();
      return <User name={username} />;
    }


-   `:username` → 動態路由
    
-   `useParams()` → 取得路由參數
    

訪問 `/user/Ken` → 畫面顯示 `使用者：Ken`
