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
        forgotPwd: 'Forgot password?',
        loginNow: 'Login',
   
        profile: 'Profile',
        email: 'Email',
        repeatPassword: 'Repeat Password',
        passwordNotMath: 'The password and repeat password do not match.',

        btnReset: 'Reset',
        btnSave: 'Save',
        btnSubmit: 'Submit',

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
        forgotPwd: '忘記密碼？',
        loginNow: '登入',

        profile: '個人資料',
        email: '電郵',
        repeatPassword: '重複密碼',
        passwordNotMath: '密碼與重複密碼不一致。',

        btnReset: '重設',
        btnSave: '儲存',
        btnSubmit: '提交',

        themeColor: '主題色'
    },
    zh_hans: {
        pleaseSelect: '请选择',
        noRecordFound: '找不到相关记录',
        btnConfirm: '确定',
        btnYes: '是',
        btnNo: '否',
        errorFileType: '不允许的档案类型。',
        errorMaxFileSize: '档案大小不能超过{num}M。',
        errorRequiredAll: '请正确填写所有必须栏位。',
        errorRequired: '请正确填写此栏位。',
        errorPasswordFormat: '密码必须至少包含6个字符，包括大写/小写和数字(例如Abc123)。',
        errorEmailFormat: '无效的邮件地址格式。',
        errorNumberFormat: '无效的数字格式。',
        errorDateFormat: '无效的日期格式。',
        errorTimeFormat: '无效的时间格式。',
        errorGE0: '数值必须大於或等於 0。',
        errorGT0: '数值必须大於 0。',

        panelName: '系统管理中心',
        userName: '帐户ID',
        displayName: '显示名称',
        password: '密码',
        rememberMe: '保持登入状态？',
        forgotPwd: '忘记密码？',
        loginNow: '登入',

        profile: '个人资料',
        email: '电邮',
        repeatPassword: '重复密码',
        passwordNotMath: '密码与重复密码不一致。',

        btnReset: '重设',
        btnSave: '储存',
        btnSubmit: '提交',

        themeColor: '主题色'
    }
};

const LangContext = createContext();

export function LangProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem("appLang") || "zh_hant");

    // Switch language
    const changeLang = (langCode) => {
        setLang(langCode);
        localStorage.setItem("appLang", langCode);
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