export function appLang(currentLangCode = 'en') {
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
            errorGT0: 'Value must be greater than 0.'
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
            errorGT0: '數值必須大於 0。'
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
            errorGT0: '数值必须大於 0。'
        }
    }
}