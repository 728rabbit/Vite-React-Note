import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { LayoutProvider } from './global/Layout.jsx';
import { LangProvider } from './global/Language.jsx';
import { TipsProvider } from './global/Tips.jsx';
import { AuthnProvider } from './global/Authn.jsx';
import App from './App.jsx';
library.add(fas, far);
import './style/Index.css';
import './style/App.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LayoutProvider>
            <LangProvider>
                <TipsProvider>
                    <AuthnProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </AuthnProvider>
                </TipsProvider>
            </LangProvider>
        </LayoutProvider>
    </StrictMode>
)
