## 🧩 一、useRef 控制 DOM / 存值

`useRef` 可以做兩件事：

1.  **存放 DOM 元素引用**（操作原生 DOM）
    
2.  **存放不會觸發重渲染的資料**
    

----------

### 1️⃣ DOM 操作範例：輸入框自動聚焦

    import { useRef } from 'react';
    
    function App() {
      const inputRef = useRef(null);
    
      function focusInput() {
        inputRef.current.focus(); // 操作 DOM 聚焦
      }
    
      return (
        <div>
          <h1>useRef 練習</h1>
          <input ref={inputRef} placeholder="點按按鈕聚焦" />
          <button onClick={focusInput}>聚焦輸入框</button>
        </div>
      );
    }

export default App;


-   點擊按鈕後，輸入框會自動獲得焦點
    
-   `ref={inputRef}` 將 DOM 元素綁到 `inputRef.current`
    

----------

### 2️⃣ 存值而不觸發重渲染

    import { useRef, useState } from 'react';
    
    function App() {
      const countRef = useRef(0);
      const [renderCount, setRenderCount] = useState(0);
    
      function increaseRef() {
        countRef.current += 1;
        console.log('countRef:', countRef.current);
      }
    
      function triggerRender() {
        setRenderCount(renderCount + 1);
      }
    
      return (
        <div>
          <h1>useRef 存值練習</h1>
          <p>重渲染次數：{renderCount}</p>
          <button onClick={increaseRef}>增加 ref 值（不重渲染）</button>
          <button onClick={triggerRender}>觸發重渲染</button>
        </div>
      );
    }
    
    export default App;


-   點擊 `增加 ref 值` → console 會看到 `countRef` 變化，但畫面不變
    
-   `useRef` 很適合存「不需要畫面立即更新」的值
    

----------

## 🧩 二、useMemo 優化計算

`useMemo` 可以 **記住計算結果，避免每次渲染都重算**。

    import { useState, useMemo } from 'react';
    
    function App() {
      const [num, setNum] = useState(1);
      const [count, setCount] = useState(0);
    
      // 假設一個費時計算
      const factorial = useMemo(() => {
        console.log('計算 factorial...');
        let result = 1;
        for (let i = 1; i <= num; i++) {
          result *= i;
        }
        return result;
      }, [num]); // 只有 num 變化才重新計算
    
      return (
        <div>
          <h1>useMemo 練習</h1>
          <p>Num: {num}</p>
          <p>Factorial: {factorial}</p>
          <button onClick={() => setNum(num + 1)}>Num +1</button>
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Count +1</button>
        </div>
      );
    }
    
    export default App;

-   只有當 `num` 變化時，才會重新計算 factorial
    
-   點擊 `Count +1` 不會觸發 factorial 計算 → 提升效能
