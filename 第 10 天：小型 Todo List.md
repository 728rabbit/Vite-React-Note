## 🎯 目標功能

1.  新增任務
    
2.  刪除任務
    
3.  勾選完成任務

🧩 完整範例：小型 Todo List

    import { useState } from "react";
    
    function App() {
      // 狀態：儲存所有任務
      const [todos, setTodos] = useState([
        { id: 1, text: "學習 React", done: false },
        { id: 2, text: "寫 Todo List", done: true },
      ]);
    
      const [input, setInput] = useState("");
    
      // ➕ 新增任務
      function addTodo(e) {
        e.preventDefault();
        if (!input.trim()) return; // 防止空白
        const newTodo = {
          id: Date.now(), // 用時間當唯一 ID
          text: input.trim(),
          done: false,
        };
        setTodos([...todos, newTodo]);
        setInput(""); // 清空輸入框
      }
    
      // ✅ 切換完成狀態
      function toggleTodo(id) {
        const newTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        );
        setTodos(newTodos);
      }
    
      // ❌ 刪除任務
      function deleteTodo(id) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    
      return (
        <div style={{ maxWidth: 400, margin: "30px auto", textAlign: "center" }}>
          <h1>📝 小型 Todo List</h1>
    
          <form onSubmit={addTodo}>
            <input
              type="text"
              placeholder="輸入新任務..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit">新增</button>
          </form>
    
          <ul style={{ listStyle: "none", padding: 0 }}>
            {todos.map((todo) => (
              <li key={todo.id} style={{ marginTop: "10px" }}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  style={{
                    textDecoration: todo.done ? "line-through" : "none",
                    marginLeft: "8px",
                  }}
                >
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ marginLeft: "10px" }}
                >
                  刪除
                </button>
              </li>
            ))}
          </ul>
    
          <p>
            ✅ 完成：{todos.filter((t) => t.done).length} / {todos.length}
          </p>
        </div>
      );
    }
    
    export default App;

