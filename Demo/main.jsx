import { StrictMode, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import './style/Index.css';
import './style/App.css';
import App from './App.jsx';
import { LangProvider } from './Language.jsx';
import { AuthnProvider } from './Authn.jsx';
library.add(fas, far);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthnProvider>
            <LangProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </LangProvider>
        </AuthnProvider>
    </StrictMode>
)
