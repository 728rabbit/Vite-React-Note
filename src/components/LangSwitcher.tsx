import { useCallback  } from 'react';
import { useI18n } from '../I18n';
import './LangSwitcher.css';

type Language = 'zh' | 'en';

export default function LangSwitcher() {
    const { lang, setLang } = useI18n();

    // Synchronize localStorage changes and triggered events
    const handleSwitch = useCallback((newLang: Language) => {
        // If the languages ​​are the same, do nothing.
        if (newLang === lang) { return; }
        
        // 1. How to set language preferences: 
        //    localStorage.setItem('app_default_language', 'zh');
        // 2. Trigger re-render:
        //    window.dispatchEvent(new CustomEvent('inputbox:languageChange'));
        setLang(newLang);
        localStorage.setItem('app_default_language', newLang);
        window.dispatchEvent(new CustomEvent('inputbox:languageChange', { detail: { language: newLang } }));
    }, [lang]);


    // Button configuration for easy expansion
    const buttons = [
        { code: 'en' as const, label: 'EN', title: 'English' },
        { code: 'zh' as const, label: '繁', title: '繁體中文' },
    ];

    return (
        <div className="lang-switcher">
            {buttons.map(({ code, label, title }) => (
                <button
                    key={code}
                    type="button"
                    {...(lang === code && { className: 'current' })}
                    onClick={() => handleSwitch(code)}
                    title={title}
                >{label}</button>
            ))}
        </div>
    );
}