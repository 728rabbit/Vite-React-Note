import { useCallback, useState, useEffect } from 'react';
import './LangSwitcher.css';

type Language = 'zh' | 'en';

interface LangSwitcherProps {
    defaultLang?: Language;
    onLanguageChange?: (lang: Language) => void;
}

export default function LangSwitcher({ defaultLang, onLanguageChange }: LangSwitcherProps = {}) {
    const [lang, setLang] = useState<Language>(() => {
        // Prioritizes using the defaultLang prop, then reads from localStorage, and finally defaults to 'en'.
        if (defaultLang) return defaultLang;
        const stored = localStorage.getItem('app_default_language');
        return (stored === 'zh' || stored === 'en') ? stored : 'en';
    });

    // Synchronize localStorage changes and triggered events
    const handleSwitch = useCallback((newLang: Language) => {
        if (newLang === lang) return; // If the languages ​​are the same, do nothing.
        
        setLang(newLang);
        localStorage.setItem('app_default_language', newLang);
        window.dispatchEvent(new CustomEvent('inputbox:languageChange', { detail: { language: newLang } }));
        onLanguageChange?.(newLang);
    }, [lang, onLanguageChange]);

    // Listen for language changes in other tabs (optional)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'app_default_language' && e.newValue) {
                const newLang = e.newValue as Language;
                if (newLang === 'zh' || newLang === 'en') {
                    setLang(newLang);
                }
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

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
                    className={lang === code ? 'current' : ''}
                    onClick={() => handleSwitch(code)}
                    title={title}
                >{label}</button>
            ))}
        </div>
    );
}