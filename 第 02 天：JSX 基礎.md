
## **什麼是 JSX？**

-   JSX 是 **JavaScript + HTML 語法結合**
-   React 內部會把 JSX 轉成 JavaScript 語法
-   讓我們可以像寫 HTML 一樣寫界面
    
> 注意：
> 
> -   JSX 標籤必須閉合 `<div></div>` 或 `<img />`
>     
> -   JSX 只能有 **一個父元素**（可以用 `<div>` 或 `<></>` 包起來）


## **實作練習**

打開專案的 `src/App.jsx`，你會看到類似這個內容：

    function  App() { 
		  return ( 
		    <div className="App">
			    <h1>Hello Vite + React!</h1>
		    </div>
		  );
    } 
    export  default  App
