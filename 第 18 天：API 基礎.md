## 🎯 今日目標

1.  理解 **fetch / axios** 基本用法
    
2.  在 React 裡使用 **useEffect** 抓取資料
    
3.  練習顯示列表資料
    
4.  處理 loading 與錯誤狀態
    

----------

## 🧩 一、fetch 基本用法

    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));


-   `.then()` → 處理成功結果
    
-   `.catch()` → 捕捉錯誤
    

----------

## 🧩 二、React 裡抓 API

    import { useState, useEffect } from "react";
    
    export default function App() {
      const [todos, setTodos] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
          .then((res) => res.json())
          .then((data) => {
            setTodos(data);
            setLoading(false);
          })
          .catch((err) => {
            setError(err.message);
            setLoading(false);
          });
      }, []); // 空陣列 → 只在組件掛載時執行一次
    
      if (loading) return <p>讀取中...</p>;
      if (error) return <p>發生錯誤：{error}</p>;
    
      return (
        <div>
          <h1>Todo List 從 API</h1>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.title} {todo.completed ? "✅" : "❌"}
              </li>
            ))}
          </ul>
        </div>
      );
    }

-   `useEffect` → 觸發 API 請求
    
-   `loading` → 顯示讀取狀態
    
-   `error` → 顯示錯誤訊息
    
-   `todos` → 顯示資料列表
    

----------

## 🧩 三、axios 使用方式（選擇性）

    npm install axios

    import axios from "axios";
    import { useState, useEffect } from "react";
    
    export default function App() {
      const [todos, setTodos] = useState([]);
    
      useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/todos?_limit=5")
          .then(res => setTodos(res.data))
          .catch(err => console.error(err));
      }, []);
    
      return (
        <ul>
          {todos.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
      );
    }

-   axios 語法更簡單，會自動轉 JSON
    
-   可處理 POST、PUT、DELETE 請求
