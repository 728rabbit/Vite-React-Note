## 🎯 今日目標

1.  理解 `useReducer` 與 `useState` 的差別
    
2.  學會定義 **reducer 函數** 與 **dispatch 動作**
    
3.  練習 Todo List 進階管理
    

----------

## 🧩 一、useReducer 基本概念

    const [state, dispatch] = useReducer(reducer, initialState);

-   **state** → 當前狀態
    
-   **dispatch(action)** → 觸發 reducer 更新狀態
    
-   **reducer(state, action)** → 根據 action 決定新的 state
    

----------

## 🧩 二、簡單計數器範例

    import { useReducer } from "react";
    
    function reducer(state, action) {
      switch (action.type) {
        case "increment":
          return state + 1;
        case "decrement":
          return state - 1;
        default:
          return state;
      }
    }
    
    export default function Counter() {
      const [count, dispatch] = useReducer(reducer, 0);
    
      return (
        <div>
          <p>Count: {count}</p>
          <button onClick={() => dispatch({ type: "increment" })}>+1</button>
          <button onClick={() => dispatch({ type: "decrement" })}>-1</button>
        </div>
      );
    }


-   `dispatch({ type: "increment" })` → 告訴 reducer 要做什麼動作
    
-   reducer 根據 action 回傳新 state
    

----------

## 🧩 三、Todo List 使用 useReducer

### 1️⃣ 定義 reducer

    function todoReducer(state, action) {
      switch (action.type) {
        case "add":
          return [...state, { id: Date.now(), text: action.payload, done: false }];
        case "toggle":
          return state.map((todo) =>
            todo.id === action.payload ? { ...todo, done: !todo.done } : todo
          );
        case "delete":
          return state.filter((todo) => todo.id !== action.payload);
        default:
          return state;
      }
    }


----------

### 2️⃣ 父組件：Todo.jsx

    import { useReducer } from "react";
    import TodoInput from "../components/TodoInput";
    import TodoList from "../components/TodoList";
    import { todoReducer } from "../reducers/todoReducer";
    
    export default function Todo() {
      const [todos, dispatch] = useReducer(todoReducer, []);
    
      function addTodo(text) {
        dispatch({ type: "add", payload: text });
      }
    
      function toggleTodo(id) {
        dispatch({ type: "toggle", payload: id });
      }
    
      function deleteTodo(id) {
        dispatch({ type: "delete", payload: id });
      }
    
      return (
        <div>
          <h1>Todo List（useReducer 版）</h1>
          <TodoInput onAdd={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
          <p>
            ✅ 完成：{todos.filter((t) => t.done).length} / {todos.length}
          </p>
        </div>
      );
    }


----------

### 🔍 重點說明

| 功能 | 說明 |
|--|--|
| reducer |  根據 action 決定如何更新 state |
| dispatch |  發送 action 給 reducer |
| action |  通常有 `type` 和可選的 `payload` |
| 優點 |  適合管理複雜 state，邏輯集中，容易維護 |
