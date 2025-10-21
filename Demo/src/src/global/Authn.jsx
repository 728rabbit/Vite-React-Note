import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from './Config.jsx';

const AuthnContext = createContext();

export function AuthnProvider({ children }) {
    const [authnToken, setAuthnToken] = useState(localStorage.getItem('authnToken') || '');
    const [authnInfo, setAuthnInfo] = useState(null);
    const [authnLoading, setAuthnLoading] = useState(true);

    // When the token has a value, automatically obtain user information from the API
    useEffect(() => {
        if (!authnToken) {
            setAuthnInfo(null);
            setAuthnLoading(false);
            return;
        }

        if(!authnInfo) {
            setAuthnLoading(true);
            const fetchAuthnInfo = async () => {
                try {
                    const formData = new FormData();
                    formData.append('action_index', 'getprofile');
                    const res = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${authnToken}`
                        },
                        body: formData
                    });
                    const responseData = await res.json();
                    if (responseData.status === 200) {
                        setAuthnInfo(responseData.user);
                    } else {
                        renewAuthnToken('');
                    }
                } catch (ex) {
                    console.error(ex);
                    renewAuthnToken('');
                } finally {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    setAuthnLoading(false);
                }
            };
            fetchAuthnInfo();
        }
    }, [authnToken]);

    const renewAuthnToken = (token) => {
        setAuthnToken(token);
        localStorage.setItem('authnToken', token);
        if (!token) setAuthnInfo(null);
    };

    const renewAuthnInfo = (userData) => {
        setAuthnInfo(userData);
    };

    return (
        <AuthnContext.Provider value={{ authnToken, authnInfo, authnLoading, renewAuthnToken, renewAuthnInfo }}>
            {children}
        </AuthnContext.Provider>
    );
}

export function useAuthn() {
    return useContext(AuthnContext);
}