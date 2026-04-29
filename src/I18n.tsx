import { createContext, useContext, useState, type ReactNode } from 'react'; 

type Language = 'zh' | 'en';

const LANG_EN: Record<string, string> = {
    username: 'Username',
    username_tips: 'Please enter your username.',
    email_address: 'Email',
    email_address_tips: 'your@email.com',
    password: 'Password',
    password_tips: 'Please enter your password (E.g: Abc123).',
    date: 'Date',
    time: 'Time',
    color: 'Color',
    attachment: 'Attachment(s)',
    remark: 'Remark',
    btn_submit: 'Submit'
};

const LANG_ZH: Record<string, string> = {
    username: '帳戶名稱',
    username_tips: '請輸入您的帳戶名稱',
    email_address: '電郵地址',
    email_address_tips: 'your@email.com',
    password: '密碼',
    password_tips: '請輸入您的密碼（例如：Abc123）。',
    date: '日期',
    time: '時間',
    color: '顔色',
    attachment: '附件',
    remark: '備注',
    btn_submit: '提交'
};

interface I18nContextType {
    plang: (key: string) => string;
    lang: Language;
    setLang: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLang] = useState<Language>(() => 
        (localStorage.getItem('app_default_language') as Language) || 'en'
    );

    const translations = {
        en: LANG_EN,
        zh: LANG_ZH
    };

    const plang = (key: string) => translations[lang][key] || key;

    return (
        <I18nContext.Provider value={{ plang, lang, setLang }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18n must be used within I18nProvider');
    return ctx;
};