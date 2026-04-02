import { useState, useCallback } from 'react';
import './App.css';
import InputBox from './components/InputBox';

export default function App() {
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
            <div className="iweby-row">
                <InputBox 
                    fieldLabel='用戶名'
                    fieldName="username" 
                    fieldType="text" 
                    value={formData.username} 
                    onChange={handleFieldChange('username')} 
                    placeholder="請輸入用戶名" 
                    validation="required"
                />
            </div>
            
            <div className="iweby-row">
                <InputBox 
                    fieldLabel='電郵'
                    fieldName="email" 
                    fieldType="email" 
                    value={formData.email} 
                    onChange={handleFieldChange('email')} 
                    placeholder="your@email.com" 
                    validation="required|email"
                />
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldLabel='密碼'
                    fieldName="password"
                    fieldType="password"
                    value={formData.password}
                    onChange={handleFieldChange('password')}
                    placeholder="請輸入密碼"
                    validation="required|password"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel='日期+時間'
                    fieldName="local" 
                    fieldType="datetime-local"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel='日期'
                    fieldName="date" 
                    fieldType="date"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel='時間'
                    fieldName="time" 
                    fieldType="time"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel='顔色'
                    fieldName="color" 
                    fieldType="color"
                    defaultValue="#872121"
                />
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldLabel='附件'
                    fieldName="file"
                    fieldType="file"
                    multiple
                    onChange={handleFieldChange('file')}
                />
            </div>


            <div className="iweby-row">
                <InputBox
                    fieldLabel='備注'
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
                    提交
                </button>
            </div>
        </>
    )
}