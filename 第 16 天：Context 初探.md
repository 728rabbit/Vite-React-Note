## 🎯 今日目標

1.  理解 Context 的用途與概念
    
2.  學會建立 Context、提供值、在子組件使用
    
3.  練習簡單範例：跨多層組件傳資料
    

----------

## 🧩 一、Context 基本概念

-   **Context** 就像 React 的「全局資料池」
    
-   可以讓多個組件 **直接取得共享資料**，不需要從父層層傳 props
    
-   常用於：
    
    -   主題切換（dark/light）
        
    -   登入狀態 / 使用者資訊
        
    -   多層共享設定
        

----------

## 🧩 二、範例：主題切換

### 1️⃣ 建立 Context

    import { createContext } from "react";
    
    export const ThemeContext = createContext();

----------

### 2️⃣ 父組件提供 Context

    import { useState } from "react";
    import { ThemeContext } from "./ThemeContext";
    import Toolbar from "./Toolbar";
    
    export default function App() {
      const [theme, setTheme] = useState("light");
    
      function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
      }
    
      return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <div style={{ padding: 20, background: theme === "light" ? "#fff" : "#333", color: theme === "light" ? "#000" : "#fff" }}>
            <h1>Context 主題切換範例</h1>
            <Toolbar />
          </div>
        </ThemeContext.Provider>
      );
    }


-   `<ThemeContext.Provider>` 包住需要共享的組件
    
-   `value` → 傳入要共享的資料與方法
    

----------

### 3️⃣ 子組件使用 Context

    import { useContext } from "react";
    import { ThemeContext } from "./ThemeContext";
    
    export default function Toolbar() {
      const { theme, toggleTheme } = useContext(ThemeContext);
    
      return (
        <div>
          <p>目前主題：{theme}</p>
          <button onClick={toggleTheme}>切換主題</button>
        </div>
      );
    }


-   `useContext(ThemeContext)` → 取得 Provider 傳下來的資料
    
-   子組件可以直接讀取 & 呼叫方法
    

----------

### 🔍 小結

|  功能 |  說明 |
|--|--|
|  createContext() | 建立 Context |
|  Provider | 父組件包住需要共享的部分，傳入 value |
|  useContext() | 子組件使用 Context，讀取資料或呼叫方法 |
|  適合 | 全局狀態、設定、登入資訊、主題切換等 |
