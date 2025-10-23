import { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
    const [pageIndex, setPageIndex] = useState('home');
    const [pagePath, setPagePath] = useState([]);
    const [pageExpand, setPageExpand] = useState(false);

    return (
        <LayoutContext.Provider value={{ pageIndex, setPageIndex, pagePath ,setPagePath, pageExpand, setPageExpand }}>
            {children}
        </LayoutContext.Provider>
    );
}

export function useLayout() {
    return useContext(LayoutContext);
}