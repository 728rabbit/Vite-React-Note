import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
    const [pageExpand, setPageExpand] = useState(false);
    const [pagePath, setPagePath] = useState([]);

    return (
        <LayoutContext.Provider value={{ pageExpand, setPageExpand, pagePath ,setPagePath }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}