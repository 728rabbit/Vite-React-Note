import { useEffect, useState } from 'react';

export function TipsBox({ type = 'none', text = ''}) {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        if (!text) {
            setVisible(false);
            return;
        }
        setVisible(true);
    }, [text]);

    if(visible) {
        return (
            <div className={`page-message iweb-tips-message ${type}`}>
                <div>
                    <span>{text}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); setVisible(false); }} className="close">×</a>
                </div>
            </div>
        );
    }
    else {
        return (
            <div className={`page-message iweb-tips-message`}></div>
        );
    }
}