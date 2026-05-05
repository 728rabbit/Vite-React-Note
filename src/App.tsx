import { useState, useCallback } from 'react';
import { InputBox } from './components/InputBox';
import LangSwitcher from './components/LangSwitcher';
import { useI18n } from './I18n';
import './App.css';


export default function App() {
    const { plang } = useI18n();
    
    // ✅ 儲存檔案物件
    const [fileList, setFileList] = useState<FileList | null>(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        remark: '',
        gender: '',
        like: '',
        hobbies: '',
        tnc: 'yes',
        attachment: ''
    });
    
    const [fieldValidity, setFieldValidity] = useState({
        username: false,
        email: false,
        password: false,
        attachment: true  // ✅ 新增，預設為有效
    });

    const canSubmit = Object.values(fieldValidity).every(v => v === true);

    const handleFieldChange = useCallback((fieldName: string) => (value: string, isValid?: boolean, files?: FileList) => {
        // 更新表單數據
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
        
        // ✅ 儲存檔案物件
        if (fieldName === 'attachment' && files) {
            setFileList(files);
        }
        
        // 更新驗證狀態
        setFieldValidity(prev => ({
            ...prev,
            [fieldName]: isValid || false
        }));
    }, []);

    // ✅ 實際上傳檔案
    const handleSubmit = useCallback(async () => {
        // 觸發表單驗證
        window.dispatchEvent(new CustomEvent('inputbox:forceValidate'));

        if (!canSubmit) {
            console.log('表單驗證失敗');
            alert('請填寫所有必填欄位');
            return;
        }

        try {
            // 建立 FormData 物件
            const submitData = new FormData();
            
            // 添加一般表單欄位
            submitData.append('username', formData.username);
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);
            submitData.append('remark', formData.remark);
            submitData.append('gender', formData.gender);
            submitData.append('hobbies', formData.hobbies);
            submitData.append('tnc', formData.tnc);
            
            // ✅ 添加檔案
            if (fileList && fileList.length > 0) {
                for (let i = 0; i < fileList.length; i++) {
                    submitData.append('attachments', fileList[i]);
                }
                console.log(`上傳 ${fileList.length} 個檔案`);
            }
            
            // 發送到後端
            const response = await fetch('/api/submit', {
                method: 'POST',
                body: submitData  // ✅ 不要設定 Content-Type，瀏覽器會自動設定 multipart/form-data
            });
            
            if (response.ok) {
                console.log('提交成功:', formData);
                alert('提交成功！');
            } else {
                throw new Error('提交失敗');
            }
        } catch (error) {
            console.error('提交錯誤:', error);
            alert('提交失敗，請稍後再試');
        }
    }, [canSubmit, formData, fileList]);

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
                    fieldLabel="性別"
                    fieldName="gender"
                    fieldType="select"
                    value={formData.gender}
                    onChange={handleFieldChange('gender')}
                    options={[
                        {value: '', label: '請選擇'}, 
                        {value: 'M', label: '男'}, 
                        {value: 'F', label: '女'}
                    ]}
                    validation="required"/>
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldLabel="興趣"
                    fieldName="hobbies"
                    fieldType="checkbox"
                    options={[
                        { value: 'reading', label: '閱讀' },
                        { value: 'music', label: '音樂' },
                        { value: 'sports', label: '運動' }
                    ]}
                    value={formData.hobbies}
                    onChange={handleFieldChange('hobbies')}
                    validation="required"
                />
            </div>
            

            <div className="iweby-row">
                <InputBox
                    fieldLabel="性別"
                    fieldName="gender"
                    fieldType="radio"
                    value={formData.gender}
                    onChange={handleFieldChange('gender')}
                    options={[
                        {value: 'M', label: '男'}, 
                        {value: 'F', label: '女'}
                    ]}
                    validation="required"/>
            </div>

            <div className="iweby-row">
                <InputBox
                    fieldName="tnc"
                    fieldType="checkbox"
                    value={formData.tnc}
                    onChange={handleFieldChange('tnc')}
                    options={[
                        { value: 'yes', label: '本人已閲讀並同意相關條款及細則。' },
                    ]}
                    validation="required"
                />
            </div>

            <div className="iweby-row">
                <InputBox 
                    fieldLabel={plang('date_time')}
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
                    min="2026-03-15"
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
                    onChange={handleFieldChange('attachment')}
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