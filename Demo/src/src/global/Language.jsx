import { createContext, useContext, useState } from "react";

const language = {
    en: {
        pleaseSelect: 'Please Select',
        noRecordFound: 'No record found',
        btnConfirm: 'OK',
        btnYes: 'Yes',
        btnNo: 'No',
        errorFileType: 'File type is not allowed.',
        errorMaxFileSize: 'Maximum allowed file size is {num}M.',
        errorRequiredAll: 'Please fill out all required fields correctly.',
        errorRequired: 'Please fill out this field correctly.',
        errorPasswordFormat: 'Password must contain at least 6 characters, including upper/lowercase and numbers (e.g. Abc123).',
        errorEmailFormat: 'Invalid email address format.',
        errorNumberFormat: 'Invalid number format.',
        errorDateFormat: 'Invalid date format.',
        errorTimeFormat: 'Invalid time format.',
        errorGE0: 'Value must be greater than or equal to 0.',
        errorGT0: 'Value must be greater than 0.',

        panelName: 'AdminHub',
        userName: 'User ID',
        displayName: 'Display Name',
        password: 'Password',
        rememberMe: 'Remember Me?',
        loginNow: 'Login',
        forgotPwd: 'Forgot Password?',
        forgotPwdTxt: 'Please enter your registered email address below and you will receive a one-time password reset token.',
        resetPwd: 'Reset Password',
        resetPwdOK: 'Your new password has taken effect, please log in again.',
   
        profile: 'Profile',
        email: 'Email',
        telephone: 'Telephone',
        repeatPassword: 'Repeat Password',
        passwordNotMath: 'The password and repeat password do not match.',
        remark: 'Remark',

        btnReset: 'Reset',
        btnSave: 'Save',
        btnSubmit: 'Submit',
        btnSend: 'Send',
        btnBack: 'Back',

        dashBoard: 'DashBoard',
        themeColor: 'Theme color'
    },
    zh_hant: {
        pleaseSelect: '請選擇',
        noRecordFound: '找不到相關記錄',
        btnConfirm: '確定',
        btnYes: '是',
        btnNo: '否',
        errorFileType: '不允許的檔案類型。',
        errorMaxFileSize: '檔案大小不能超過{num}M。',
        errorRequiredAll: '請正確填寫所有必須欄位。',
        errorRequired: '請正確填寫此欄位。',
        errorPasswordFormat: '密碼必須至少包含6個字符，包括大寫/小寫和數字(例如Abc123)。',
        errorEmailFormat: '無效的郵件地址格式。',
        errorNumberFormat: '無效的數字格式。',
        errorDateFormat: '無效的日期格式。',
        errorTimeFormat: '無效的時間格式。',
        errorGE0: '數值必須大於或等於 0。',
        errorGT0: '數值必須大於 0。',

        panelName: '系統管理中心',
        userName: '帳戶ID',
        displayName: '顯示名稱',
        password: '密碼',
        rememberMe: '保持登入狀態？',
        loginNow: '登入',
        forgotPwd: '忘記密碼？',
        forgotPwdTxt: '請在下面輸入您登記的電郵地址，您將收到一次性密碼重設Token。',
        resetPwd: '重設密碼',
        resetPwdOK: '您的新密碼已生效，請重新登入。',

        profile: '個人資料',
        email: '電郵',
        telephone: '電話',
        repeatPassword: '重複密碼',
        passwordNotMath: '密碼與重複密碼不一致。',
        remark: '備注',

        btnReset: '重設',
        btnSave: '儲存',
        btnSubmit: '提交',
        btnSend: '發送',
        btnBack: '返回',

        dashBoard: '儀表板',
        themeColor: '主題色'
    }
};

const LangContext = createContext();

export function LangProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('appLang') || 'zh_hant');

    // Switch language
    const changeLang = (langCode) => {
        if(langCode === 'en' || langCode === 'zh_hant') {
            setLang(langCode);
            localStorage.setItem('appLang', langCode);
        }
    };

    // Translation function
    const transLang = (key, vars = {}) => {
        const dict = language[lang] || language.en;
        let text = dict[key] || key;
        for (const k in vars) {
            text = text.replace(`{${k}}`, vars[k]);
        }
        return text;
    };

    return (
        <LangContext.Provider value={{ lang, changeLang, transLang }}>
            {children}
        </LangContext.Provider>
    );
}

export function useLang() {
    return useContext(LangContext);
}