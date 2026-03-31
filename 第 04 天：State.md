

## 🧠 一、什麼是狀態（state）？

-   React 組件裡的畫面是由 **資料（state）** 決定的。
    
-   當 state 改變，React 會自動**重新渲染畫面**。
    

📖 用一句話記：

> 「state 代表畫面的當前狀態，改變 state = 改變畫面。」

----------

## ⚙️ 二、useState 是什麼？

`useState` 是 React 的一個 **Hook（鉤子）**，  
用來在 Function 組件裡創建「可變的狀態」。

基本用法：

`const [變數名, 修改函式] = useState(初始值);` 

例如：

`const [count, setCount] = useState(0);` 

意思是：

-   `count`：當前數值
    
-   `setCount`：用來更新 `count`
    
-   `0`：初始值
    

----------

## 🧩 三、練習：建立一個簡單的「計數器」

打開 `src/App.jsx`，改成以下程式：

    import { useState } from 'react';
    
    function App() {
      // 宣告一個 count 狀態，初始值是 0
      const [count, setCount] = useState(0);
    
      // 點擊按鈕時執行的函式
      function handleClick() {
        setCount(count + 1); // 改變狀態
      }
    
      return (
        <div>
          <h1>第 4 天：useState 計數器</h1>
          <p>目前數字：{count}</p>
          <button onClick={handleClick}>點我 +1</button>
        </div>
      );
    }
    
    export default App;


儲存後打開瀏覽器，試著點按鈕 🔘  
➡️ 你會看到數字每點一次就加一。

這就是 **state 改變 → React 重新渲染畫面** 的魔法。✨

----------

## 🧩 四、進階：減少、重設功能

我們再加兩個按鈕：

    import { useState } from 'react';
    
    function App() {
      const [count, setCount] = useState(0);
    
      return (
        <div>
          <h1>計數器</h1>
          <p>目前數字：{count}</p>
          <button onClick={() => setCount(count + 1)}>+1</button>
          <button onClick={() => setCount(count - 1)}>-1</button>
          <button onClick={() => setCount(0)}>重設</button>
        </div>
      );
    }
    
    export default App;


現在你就有一個完整的「加減計數器」！

複合參數使用 typescript, 則需要定明類型， 使用類似以下格式修改

useState_func_name (prev => ({ ...prev, 參數名稱: prev.參數名稱:+ num }));

    import { useState } from 'react'
    import './App.css'
    import Hello from './components/Hello'
    
    function App() {
      const [mixed, setMixed] = useState({'count': 0, text: ''});
    
      const setCount = (num: number) => {
        setMixed(prev => ({ ...prev, count: prev.count + num }));
      }
    
      const setText = (str: string) => {
        setMixed(prev => ({ ...prev, text: str }));
      }
    
      return (
        <>
          <h1>Hello Vite + React!</h1>
          <button onClick={() => setCount(1)}>{mixed.count}</button>
          
          <Hello name="petter"></Hello>
    
          <input
            type="text"
            placeholder="輸入文字..."
            value={mixed.text}
            onChange={(e) => setText(e.target.value)} // 監聽輸入
          />
          <p>你輸入的是：{mixed.text}</p>
        </>
      )
    }
    
    export default App
