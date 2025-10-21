import { useEffect } from 'react';
import { useLayout } from '../global/Layout.jsx';
import { useLang } from '../global/Language.jsx';
import { useTips } from '../global/Tips.jsx';

export function Home() {
    // Global value
    const { transLang } = useLang();
    const { tipsMessage, setTipsMessage } = useTips();
    const { setPageExpand, setPagePath } = useLayout();

    // Init
    useEffect(() => {
        setPageExpand(false);
        setPagePath([{ name: transLang('dashBoard'), url: '/'}]);
    }, []);

    return (
        <>
            <h1>首頁</h1>
        </>
    );
}