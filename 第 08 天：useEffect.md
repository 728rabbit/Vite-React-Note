
## 🧠 一、什麼是 useEffect？

-   React 的函式組件本身只負責渲染畫面
    
-   **useEffect** 可以讓你在組件渲染後執行其他程式碼
    
-   語法：
    
`useEffect(() => { // 這裡放副作用程式碼 }, [依賴的 state 或 props]);` 

-   第二個參數是 **依賴陣列**：
    
    -   `[]` → 只在組件第一次渲染時執行
        
    -   `[count]` → 每次 `count` 改變時執行
        
    -   不填 → 每次渲染都執行
        

----------

## 🧩 二、練習 1：監聽 state 變化

    import { useState, useEffect } from 'react';
    
    function App() {
      const [count, setCount] = useState(0);
    
      // 每次 count 改變時執行
      useEffect(() => {
        console.log(`目前數字是 ${count}`);
      }, [count]);
    
      return (
        <div>
          <h1>useEffect 練習</h1>
          <p>目前數字：{count}</p>
          <button onClick={() => setCount(count + 1)}>+1</button>
        </div>
      );
    }
    
    export default App;


-   點擊按鈕，瀏覽器 console 會印出數字
    
-   可以看到 **畫面更新 + 副作用同步執行**
    

----------

## 🧩 三、練習 2：組件初始化時執行一次

    import { useEffect } from 'react';
    
    function App() {
      useEffect(() => {
        console.log('組件第一次渲染完成！');
      }, []); // 空陣列 → 只執行一次
    
      return (
        <div>
          <h1>第一次渲染訊息</h1>
        </div>
      );
    }
    
    export default App;


-   用途：初始化資料、訂閱事件、API 請求等
