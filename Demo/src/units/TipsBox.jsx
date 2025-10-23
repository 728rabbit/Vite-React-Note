import { useEffect, useState } from 'react';

export function TipsBox({ type = 'default', text = '' }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!text) {
            setVisible(false);
        }
        else {
            setVisible(true);
        }
    }, [type, text]);

    return (
        <div className={`page-message iweb-tips-message ${type}`}>
            { visible && (
            <div>
                <span>{text}</span>
                <a href="#" onClick={(e) => { e.preventDefault(); setVisible(false); }} className="close">×</a>
            </div>
            )}
        </div>
    );
}