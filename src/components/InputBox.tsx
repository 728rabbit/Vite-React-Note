/*
Universal Input Component, supports both controlled and uncontrolled modes

@example - Uncontrolled mode
    <InputBox fieldName="username" defaultValue="Default value" onChange={(v) => console.log(v)} />

@example - Controlled mode
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="Please enter email" />

@example - Form Validation
const [formData, setFormData] = useState({
    username: '',
    password: ''
});

const [fieldValidity, setFieldValidity] = useState({
    username: false,
    password: false
});

// All required fields must be valid before submission
const canSubmit = Object.values(fieldValidity).every(v => v === true);

const handleFieldChange = useCallback((fieldName: string) => (value: string, isValid?: boolean) => {
    setFormData(prev => ({
        ...prev,
        [fieldName]: value
    }));

    if (fieldName === 'attachment' && files) {
        setFileList(files);
    }

    setFieldValidity(prev => ({
        ...prev,
        [fieldName]: isValid || false
    }));
}, []);

const handleSubmit = useCallback(() => {
    // Force display of error messages in all input fields
    window.dispatchEvent(new CustomEvent('inputbox:forceValidate'));
    
    if (canSubmit) {
        console.log('Form validation passed, submit data:', formData);
        // Submit logic...
    } else {
        console.log('Form validation failed, please check your input.');
    }
}, [canSubmit, formData, fileList]);

return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <InputBox 
            fieldLabel="Username"
            fieldName="username" 
            value={formData.username} 
            onChange={handleFieldChange('username')} 
            placeholder="Please enter your username." 
            validation="required"
        />
        <InputBox 
            fieldLabel="Password"
            fieldName="password" 
            fieldType="password"
            value={formData.password} 
            onChange={handleFieldChange('password')} 
            placeholder="Please enter your password." 
            validation="required|password"
        />
        <button type="submit" disabled={!canSubmit}>Submit</button>
    </form>
)
*/

/*
Universal Input Component, supports both controlled and uncontrolled modes

@example - Uncontrolled mode
    <InputBox fieldName="username" defaultValue="Default value" onChange={(v) => console.log(v)} />

@example - Controlled mode
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="Please enter email" />

@example - Form Validation (see original comments)
*/

/*
Universal Input Component, supports both controlled and uncontrolled modes

@example - Uncontrolled mode
    <InputBox fieldName="username" defaultValue="Default value" onChange={(v) => console.log(v)} />

@example - Controlled mode
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="Please enter email" />

@example - Form Validation (see original comments)
*/

/*
Universal Input Component, supports both controlled and uncontrolled modes

@example - Uncontrolled mode
    <InputBox fieldName="username" defaultValue="Default value" onChange={(v) => console.log(v)} />

@example - Controlled mode
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="Please enter email" />

@example - Form Validation (see original comments)
*/

/*
Universal Input Component, supports both controlled and uncontrolled modes

@example - Uncontrolled mode
    <InputBox fieldName="username" defaultValue="Default value" onChange={(v) => console.log(v)} />

@example - Controlled mode
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="Please enter email" />

@example - Form Validation (see original comments)
*/

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import './InputBox.css';

interface OptionProps {
    value: string;
    label: string;
}

interface InputBoxProps {
    fieldLabel?: string;
    fieldName: string;
    fieldType?: ('text' | 'password' | 'datetime-local' | 'date' | 'time' | 'color' | 'tel' | 'email' | 'number' | 'textarea' | 'editor' | 'file' | 'select' | 'checkbox' | 'radio');
    fieldId?: string;
    value?: string;
    defaultValue?: string;
    options?: OptionProps[];
    onChange?: (value: string, isValid?: boolean, files?: FileList) => void; 
    placeholder?: string;
    disabled?: boolean;
    validation?: string;
    multiple?: boolean;
    min?: string;
    max?: string;
}

// Validation rule functions (return true if INVALID)
const VALIDATION_RULES = {
    required: (value: string) => value.trim() === '',
    password: (value: string) => !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value),
    email: (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    date: (value: string) => !/^\d{4}-\d{2}-\d{2}$/.test(value),
    time: (value: string) => !/^\d{2}:\d{2}$/.test(value),
    number: (value: string) => isNaN(Number(value)) || value.trim() === '',
    ge0: (value: string) => isNaN(Number(value)) || Number(value) < 0,
    gt0: (value: string) => isNaN(Number(value)) || Number(value) <= 0,
};

// English error messages
const ERROR_MESSAGES_EN: Record<string, string> = {
    required: 'Please fill out this field correctly.',
    password: 'Password must contain at least 6 characters, including uppercase, lowercase and numbers (e.g. Abc123).',
    email: 'Invalid email address format.',
    date: 'Invalid date format.',
    time: 'Invalid time format.',
    number: 'Invalid number format.',
    ge0: 'Value must be greater than or equal to 0.',
    gt0: 'Value must be greater than 0.',
    regex: 'Invalid format.',
    regexPattern: 'Invalid regular expression pattern.',
};

// Traditional Chinese error messages
const ERROR_MESSAGES_ZH: Record<string, string> = {
    required: '請正確填寫此欄位。',
    password: '密碼必須包含至少 6 個字元，包括大寫字母、小寫字母和數字（例如：Abc123）。',
    email: '電子郵件地址格式無效。',
    date: '日期格式無效。',
    time: '時間格式無效。',
    number: '數字格式無效。',
    ge0: '數值必須大於或等於 0。',
    gt0: '數值必須大於 0。',
    regex: '格式無效。',
    regexPattern: '正則表達式模式無效。',
};

const getErrorMessage = (rule: string, langPreference?: string): string => {
    const isEnglish = ((langPreference || 'en') !== 'zh');
    const messages = isEnglish ? ERROR_MESSAGES_EN : ERROR_MESSAGES_ZH;
    return messages[rule] || (isEnglish ? 'Invalid format.' : '格式無效。');
};

const isValid = (value: string, validation?: string, langPreference?: string, min?: string, max?: string): string => {
    if (!validation) return '';

    const rules = validation.split('|');
    const hasRequired = rules.includes('required');
    
    if (!hasRequired && value.trim() === '') return '';

    for (const rule of rules) {
        if (rule in VALIDATION_RULES) {
            if (VALIDATION_RULES[rule as keyof typeof VALIDATION_RULES](value)) {
                return getErrorMessage(rule, langPreference);
            }
            continue;
        }
        
        if (rule.startsWith('regex:')) {
            const pattern = rule.slice(6);
            try {
                if (!new RegExp(pattern).test(value)) {
                    return getErrorMessage('regex', langPreference);
                }
            } catch {
                return getErrorMessage('regexPattern', langPreference);
            }
        }
    }

    if (min !== undefined && value.trim() !== '') {
        const num = Number(value);
        if (!isNaN(num) && num < Number(min)) {
            return getErrorMessage('ge0', langPreference).replace('0', min);
        }
    }
    if (max !== undefined && value.trim() !== '') {
        const num = Number(value);
        if (!isNaN(num) && num > Number(max)) {
            return getErrorMessage('gt0', langPreference).replace('0', max);
        }
    }

    return '';
};

// Eye icons for password toggle
const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
);

const EyeOffIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
        <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
);

export function InputBox({
    fieldLabel = '',
    fieldName,
    fieldType = 'text',
    fieldId = fieldName,
    value: externalValue,
    defaultValue = '',
    options = [],
    onChange,
    disabled = false,
    placeholder = '',
    validation,
    multiple = false,
    min,
    max,
    ...props
}: InputBoxProps) {
    const [langPreference, setLangPreference] = useState(() => (localStorage.getItem('app_default_language') || 'en'));
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [passwordMode, setPasswordMode] = useState(true);
    const [isTouched, setIsTouched] = useState(false);
    const [forceDisplayError, setForceDisplayError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isControlled = externalValue !== undefined;
    const currentValue = isControlled ? externalValue : internalValue;
    const currentValueRef = useRef(currentValue);
    useEffect(() => {
        currentValueRef.current = currentValue;
    }, [currentValue]);

    // Sync defaultValue when it changes (uncontrolled mode)
    useEffect(() => {
        if (!isControlled) {
            setInternalValue(defaultValue);
        }
    }, [defaultValue, isControlled]);

    const isRequired = useMemo(() => {
        return validation?.split('|').includes('required') || false;
    }, [validation]);
    
    const validationRef = useRef(validation);
    validationRef.current = validation;
    const minRef = useRef(min);
    minRef.current = min;
    const maxRef = useRef(max);
    maxRef.current = max;

    const validateValue = useCallback((value: string) => {
        return isValid(value, validationRef.current, langPreference, minRef.current, maxRef.current);
    }, [langPreference]);

    const validationResult = useMemo(() => {
        return validateValue(currentValue);
    }, [currentValue, validateValue, langPreference]);

    // Generic change handler for text, textarea, checkbox, radio
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        let newValue = target.value;

        // Checkbox group (multiple checkboxes with same name)
        if (target.type === 'checkbox' && fieldType === 'checkbox' && options && options.length > 0) {
            const latestValue = currentValueRef.current;
            const currentValues = (latestValue && typeof latestValue === 'string' && latestValue !== '') ? latestValue.split(',') : [];
    
            if (target.checked) {
                if (!currentValues.includes(target.value)) {
                    newValue = [...currentValues, target.value].join(',');
                } else {
                    newValue = currentValues.join(',');
                }
            } else {
                newValue = currentValues.filter(v => v !== target.value).join(',');
            }
        }
        // Single checkbox (boolean)
        else if (target.type === 'checkbox' && fieldType === 'checkbox' && (!options || options.length === 0)) {
            newValue = target.checked ? 'true' : '';
        }
        // Radio group
        else if (target.type === 'radio' && fieldType === 'radio') {
            newValue = target.checked ? target.value : '';
        }

        const result = validateValue(newValue);
        if (!isControlled) setInternalValue(newValue);
        if (!isTouched) setIsTouched(true);
        if (forceDisplayError) setForceDisplayError(false);
        onChange?.(newValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError, fieldType, options]);

    // File input handler – supports single and multiple files
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            onChange?.('', true, undefined); 
            if (!isControlled) setInternalValue('');
            if (!isTouched) setIsTouched(true);
            if (forceDisplayError) setForceDisplayError(false);
            return;
        }

        let fileValue: string;
        if (multiple && files.length > 1) {
            const fileNames = Array.from(files).map(f => f.name).join(',');
            fileValue = `files:${fileNames}`;
        } else {
            const file = files[0];
            fileValue = `file:${file.name}`;
        }

        const result = validateValue(fileValue);
        if (!isControlled) setInternalValue(fileValue);
        if (!isTouched) setIsTouched(true);
        if (forceDisplayError) setForceDisplayError(false);
        onChange?.(fileValue, result === '', files);
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError, multiple]);

    // Color: native picker change (always produces a valid 7-char hex)
    const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        if (!newValue.startsWith('#')) newValue = '#' + newValue;
        const result = validateValue(newValue);
        if (!isControlled) setInternalValue(newValue);
        if (!isTouched) setIsTouched(true);
        if (forceDisplayError) setForceDisplayError(false);
        onChange?.(newValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError]);

    // Color: text input – real‑time sync (allow any input, update immediate)
    const handleColorTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;
        if (rawValue && !rawValue.startsWith('#')) {
            rawValue = '#' + rawValue;
        }
        if (rawValue.length > 7) {
            rawValue = rawValue.slice(0, 7);
        }
        const result = validateValue(rawValue);
        if (!isControlled) setInternalValue(rawValue);
        if (!isTouched) setIsTouched(true);
        if (forceDisplayError) setForceDisplayError(false);
        onChange?.(rawValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError]);

    // For the native color picker, only pass a fully valid 6‑digit hex (or fallback)
    const safeColorValue = useMemo(() => {
        if (/^#[0-9A-Fa-f]{6}$/i.test(currentValue)) {
            return currentValue.toLowerCase();
        }
        return '#000000';
    }, [currentValue]);

    const togglePasswordMode = useCallback(() => {
        setPasswordMode(prev => !prev);
    }, []);

    // Global events: force validation and language change
    useEffect(() => {
        const handleForceValidate = () => setForceDisplayError(true);
        const handleLanguageChange = () => setLangPreference(localStorage.getItem('app_default_language') || 'en');
        window.addEventListener('inputbox:forceValidate', handleForceValidate);
        window.addEventListener('inputbox:languageChange', handleLanguageChange);
        return () => {
            window.removeEventListener('inputbox:forceValidate', handleForceValidate);
            window.removeEventListener('inputbox:languageChange', handleLanguageChange);
        };
    }, []);

    const showError = (isTouched || forceDisplayError) && validationResult;
    
    // Shared props for most input types (except select, file, color)
    const sharedProps = {
        id: fieldId,
        name: fieldName,
        value: currentValue,
        onChange: handleChange,
        disabled,
        placeholder,
        className: showError ? 'error' : '',
        autoComplete: 'off' as const,
        ...props,
    };

    const PasswordToggleButton = useMemo(() => (
        <button
            type="button"
            style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#222',
            }}
            onClick={togglePasswordMode}
            tabIndex={-1}
            aria-label={passwordMode ? 'Show password' : 'Hide password'}
        >
            {passwordMode ? <EyeIcon /> : <EyeOffIcon />}
        </button>
    ), [passwordMode, togglePasswordMode]);

    const selectOptions = useMemo(() => {
        if (options.length === 0) {
            return [<option key="__placeholder" value="" disabled>No options available</option>];
        }
        return options.map((option: OptionProps) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ));
    }, [options]);

    return (
        <div className={`iweby-input iweby-input-${fieldType}`}>
            {fieldLabel && (
                <label className="forinput" htmlFor={fieldId}>
                    {fieldLabel}
                    : 
                    {isRequired && <strong className="mask-required"> *</strong>}
                </label>
            )}
            <div style={{ position: 'relative', display: 'block' }}>
                {fieldType === 'select' ? (
                    <select {...sharedProps}>{selectOptions}</select>
                ) : (fieldType === 'checkbox' || fieldType === 'radio') && options && options.length > 0 ? (
                    <div className="options-group">
                        {options.map((option: OptionProps) => {
                            let isChecked = false;
                            if (fieldType === 'radio') {
                                isChecked = currentValue === option.value;
                            } else {
                                const checkedValues = currentValue ? currentValue.split(',') : [];
                                isChecked = checkedValues.includes(option.value);
                            }
                            const base64Id = btoa(encodeURIComponent(option.value));
                            const inputId = `${fieldName}_${base64Id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20).toLowerCase()}`;

                            return (
                                <label htmlFor={inputId} key={inputId} >
                                    <input
                                        type={fieldType}
                                        id={inputId}
                                        value={option.value}
                                        checked={isChecked}
                                        onChange={handleChange}
                                        disabled={disabled}
                                        className={showError ? 'error' : ''}
                                    />
                                    <span>{option.label}{(!fieldLabel && isRequired) && <strong className="mask-required"> *</strong>}</span>
                                </label>
                            );
                        })}
                    </div>
                ) : (fieldType === 'textarea' || fieldType === 'editor') ? (
                    <textarea {...sharedProps} />
                ) : fieldType === 'file' ? (
                    <input
                        type="file"
                        id={fieldId}
                        name={fieldName}
                        multiple={multiple}
                        disabled={disabled}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className={showError ? 'error' : ''}
                        {...props}
                    />
                ) : fieldType === 'color' ? (
                    <>
                        <input
                            type="color"
                            id={fieldId}
                            name={fieldName}
                            value={safeColorValue}
                            onChange={handleColorPickerChange}
                            disabled={disabled}
                            className={showError ? 'error' : ''}
                            {...props}
                        />
                        <input
                            type="text"
                            className="colorcode"
                            id={`color_${fieldId}`}
                            value={currentValue || '#000000'}
                            onChange={handleColorTextChange}
                            maxLength={7}
                            disabled={disabled}
                            placeholder="#RRGGBB"
                        />
                    </>
                ) : (
                    <>
                        <input
                            {...sharedProps}
                            type={fieldType === 'password' ? (passwordMode ? 'password' : 'text') : fieldType}
                            min={fieldType === 'number' ? min : undefined}
                            max={fieldType === 'number' ? max : undefined}
                        />
                        {fieldType === 'password' && PasswordToggleButton}
                    </>
                )}
            </div>
            {showError && <small className="tips">{validationResult}</small>}
        </div>
    );
}