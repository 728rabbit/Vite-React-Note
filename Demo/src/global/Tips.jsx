import { createContext, useContext, useState } from 'react';

const TipsContext = createContext();

export function TipsProvider({ children }) {
    const [tipsMessage, setTipsMessage] = useState({ type: 'default', text: '' });

    return (
        <TipsContext.Provider value={{ tipsMessage, setTipsMessage}}>
            {children}
        </TipsContext.Provider>
    );
}

export function useTips() {
    return useContext(TipsContext);
}