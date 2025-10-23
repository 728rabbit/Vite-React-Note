import { createContext, useContext, useState, useEffect } from 'react';

const TipsContext = createContext();

export function TipsProvider({ children }) {
    const [tipsMessage, setTipsMessage] = useState({ type: 'default', text: '' });

    // Read information from localStorage when the component is mounted
    useEffect(() => {
        const storedMessage = localStorage.getItem('tipsMessage');
        if (storedMessage) {
            try {
                const parsedMessage = JSON.parse(storedMessage);
                setTipsMessage(parsedMessage);
                localStorage.removeItem('tipsMessage');
            } catch (error) {
                console.error('Parsing tipsMessage failed:', error);
                localStorage.removeItem('tipsMessage');
            }
        }
    }, []);

    // Customized setTipsMessage, you can choose whether to store it in localStorage
    const setTips = (message, persist = false) => {
        setTipsMessage(message);
        if (persist) {
            localStorage.setItem('tipsMessage', JSON.stringify(message));
        }
    };

    return (
        <TipsContext.Provider value={{ tipsMessage, setTipsMessage: setTips }}>
            {children}
        </TipsContext.Provider>
    );
}

export function useTips() {
    return useContext(TipsContext);
}