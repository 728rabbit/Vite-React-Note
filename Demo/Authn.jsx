import { createContext, useContext, useState } from "react";

const AuthnContext = createContext();

export function AuthnProvider({ children }) {
    const [authnToken, setAuthnToken] = useState(localStorage.getItem("authnToken") || "");
    const [authnInfo, setAuthnInfo] = useState(() => {
        return authnToken
            ? { id: 1, username: 'admin', displayname: '陳大文' } // 根據 token 生成登入資訊
            : null
    });
    
    const renewAuthnToken = (token) => {
        setAuthnToken(token);
        localStorage.setItem("authnToken", token);
        if(token) {
            setAuthnInfo({
                id: 1,
                username: 'admin',
                displayname: '陳大文'
            })
        }
        else {
            setAuthnInfo(null);
        }
    };

    return (
        <AuthnContext.Provider value={{ authnToken, authnInfo, renewAuthnToken }}>
            {children}
        </AuthnContext.Provider>
    );
}

export function useAuthn() {
    return useContext(AuthnContext);
}