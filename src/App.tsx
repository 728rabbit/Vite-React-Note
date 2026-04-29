import { useState, useCallback } from 'react';
import InputBox from './components/InputBox';
import LangSwitcher from './components/LangSwitcher';
import { useI18n } from './I18n';
import './App.css';


export default function App() {
    const { plang } = useI18n();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        remark: ''
    });
    
    // ✅ 儲存每個欄位的驗證狀態
    const [fieldValidity, setFieldValidity] = useState({
        username: false,
        email: false,
        password: false
    });

    // ✅ 全部 true 就可以提交
    const canSubmit = Object.values(fieldValidity).every(v => v === true);

    const handleFieldChange = useCallback((fieldName: string) => (value: string, isValid?: boolean) => {
        // 更新表單數據
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
        
        // 更新驗證狀態
        setFieldValidity(prev => ({
            ...prev,
            [fieldName]: isValid || false
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        // Triggering all InputBoxes to display an error
        window.dispatchEvent(new CustomEvent('inputbox:forceValidate'));

        alert('do submit');
        if (canSubmit) {
            console.log('提交成功:', formData);
            alert('提交成功！');
        }
    }, [canSubmit, formData]);

    
     

    return (
        <>
            <div><LangSwitcher/></div>
            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('username')}
                    fieldName="username" 
                    fieldType="text" 
                    value={formData.username} 
                    onChange={handleFieldChange('username')} 
                    placeholder={plang('username_tips')} 
                    validation="required"
                />
            </div>
            
            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('email_address')}
                    fieldName="email" 
                    fieldType="email" 
                    value={formData.email} 
                    onChange={handleFieldChange('email')} 
                    placeholder={plang('email_address_tips')}
                    validation="required|email"
                />
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldLabel={plang('password')}
                    fieldName="password"
                    fieldType="password"
                    value={formData.password}
                    onChange={handleFieldChange('password')}
                    placeholder={plang('password_tips')}
                    validation="required|password"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('datetime')}
                    fieldName="local" 
                    fieldType="datetime-local"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('date')}
                    fieldName="date" 
                    fieldType="date"
                    validation="required|date"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('time')}
                    fieldName="time" 
                    fieldType="time"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('color')}
                    fieldName="color" 
                    fieldType="color"
                    defaultValue="#872121"
                />
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldLabel={plang('attachment')}
                    fieldName="file"
                    fieldType="file"
                    multiple
                    onChange={handleFieldChange('file')}
                />
            </div>


            <div className="iweby-row">
                <InputBox
                    fieldLabel={plang('remark')}
                    fieldName="remark"
                    fieldType="textarea"
                    value={formData.remark}
                    onChange={handleFieldChange('remark')}
                />
            </div>

            <div className="iweby-row">
                <button 
                    onClick={handleSubmit}
                    //disabled={!canSubmit}
                    style={{ opacity: canSubmit ? 1 : 0.5 }}
                >
                    {plang('btn_submit')}
                </button>
            </div>
        </>
    )
}