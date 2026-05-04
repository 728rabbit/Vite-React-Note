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
}, [canSubmit, formData]);

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

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import './InputBox.css';

interface InputBoxProps {
    fieldLabel?: string;
    fieldName: string;
    fieldType?: 'text' | 'password' | 'datetime-local' | 'date' | 'time' | 'color' | 'tel' | 'email' | 'number' | 'textarea' | 'editor' | 'file';
    fieldId?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, isValid?: boolean) => void;
    placeholder?: string;
    disabled?: boolean;
    validation?: string;
    multiple?: boolean;
    min?: string,
    max?: string
}

// Extract validation rules as constants to avoid repeated creation
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

// Error message mapping - English
const ERROR_MESSAGES_EN: Record<string, string> = {
    required: 'Please fill out this field correctly.',
    password: 'Password must contain at least 6 characters, including uppercase, lowercase and numbers (e.g. Abc123).',
    email: 'Invalid email address format.',
    date: 'Invalid date format.',
    time: 'Invalid time format.',
    number: 'Invalid number format.',
    ge0: 'Value must be greater than or equal to 0.',
    gt0: 'Value must be greater than 0.',
};

// Error message mapping - Traditional Chinese
const ERROR_MESSAGES_ZH: Record<string, string> = {
    required: '請正確填寫此欄位。',
    password: '密碼必須包含至少 6 個字元，包括大寫字母、小寫字母和數字（例如：Abc123）。',
    email: '電子郵件地址格式無效。',
    date: '日期格式無效。',
    time: '時間格式無效。',
    number: '數字格式無效。',
    ge0: '數值必須大於或等於 0。',
    gt0: '數值必須大於 0。',
};

const getErrorMessage = (rule: string, langPreference?: string): string => {
    const isEnglish = ((langPreference || 'en') !== 'zh');
    const messages = isEnglish ? ERROR_MESSAGES_EN : ERROR_MESSAGES_ZH;
    return messages[rule] || (isEnglish ? 'Invalid format.' : '格式無效。');
};

const isValid = (value: string, validation?: string, langPreference?: string): string => {
    if (!validation) return '';

    const rules = validation.split('|');
    const hasRequired = rules.includes('required');
    
    // Return directly if there is no required rule and the value is empty
    if (!hasRequired && value.trim() === '') return '';

    for (const rule of rules) {
        // Built-in rules
        if (rule in VALIDATION_RULES) {
            if (VALIDATION_RULES[rule as keyof typeof VALIDATION_RULES](value)) {
                return getErrorMessage(rule, (langPreference || 'en'));
            }
            continue;
        }
        
        // Custom regex rule
        if (rule.startsWith('regex:')) {
            const pattern = rule.slice(6);
            try {
                if (!new RegExp(pattern).test(value)) {
                    return 'Invalid Regular format.';
                }
            } catch {
                return 'Invalid regular expression pattern.';
            }
        }
    }
    return '';
};

// Extract password toggle button SVG as constants
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

export default function InputBox({
    fieldLabel = '',
    fieldName,
    fieldType = 'text',
    fieldId = fieldName,
    value: externalValue,
    defaultValue = '',
    onChange,
    disabled = false,
    placeholder = '',
    validation,
    ...props
}: InputBoxProps) {
    const [langPreference, setLangPreference] = useState(() => (localStorage.getItem('app_default_language') || 'en'));

    const [internalValue, setInternalValue] = useState(defaultValue);
    const [passwordMode, setPasswordMode] = useState(true);
    const [isTouched, setIsTouched] = useState(false);
    const [forceDisplayError, setForceDisplayError] = useState(false);
    
    const isControlled = externalValue !== undefined;
    const currentValue = isControlled ? externalValue : internalValue;

    // Is this a required field?
    const isRequired = useMemo(() => {
        return validation?.split('|').includes('required') || false;
    }, [validation]);
    
    // Use ref to avoid unnecessary re-renders
    const validationRef = useRef(validation);
    validationRef.current = validation;

    // Validation function - use ref to ensure latest validation is used
    const validateValue = useCallback((value: string) => {
        return isValid(value, validationRef.current, langPreference);
    }, [langPreference]);

    // Validation result
    const validationResult = useMemo(() => {
        return validateValue(currentValue);
    }, [currentValue, validateValue, langPreference]);

    // Handle change for text inputs
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const result = validateValue(newValue);

        if (!isControlled) {
            setInternalValue(newValue);
        }

        if (!isTouched) {
            setIsTouched(true);
        }

        if (forceDisplayError) {
            setForceDisplayError(false);
        }

        onChange?.(newValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError]);

    // Handle color input specifically
    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Auto-complete # prefix
        if (newValue && !newValue.startsWith('#')) {
            newValue = '#' + newValue;
        }
        
        // Limit length to 7 characters (including #)
        if (newValue.length > 7) {
            newValue = newValue.slice(0, 7);
        }
        
        // Only allow # and valid hex characters
        const isValidColor = /^#?[0-9A-Fa-f]*$/.test(newValue);
        if (!isValidColor) return;

        const result = validateValue(newValue);

        if (!isControlled) {
            setInternalValue(newValue);
        }

        if (!isTouched) {
            setIsTouched(true);
        }

        if (forceDisplayError) {
            setForceDisplayError(false);
        }

        onChange?.(newValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched, forceDisplayError]);

    // Toggle password visibility
    const togglePasswordMode = useCallback(() => {
        setPasswordMode(prev => !prev);
    }, []);

    // Listen for global force validation event and language change event
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
    
    // Merge shared props for input/textarea elements
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

    // Memoize password toggle button to prevent unnecessary re-renders
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

    return (
        <div className={`iweby-input iweby-input-${fieldType}`}>
            {fieldLabel && (
                <label className="forinput" htmlFor={fieldId}>
                    {fieldLabel}
                    {isRequired && <span className="star"> *</span>}
                </label>
            )}
            <div style={{ position: 'relative', display: 'block' }}>
                {fieldType === 'textarea' || fieldType === 'editor' ? (
                    <textarea {...sharedProps} />
                ) : (
                    <>
                        <input
                            {...sharedProps}
                            type={fieldType === 'password' ? (passwordMode ? 'password' : 'text') : fieldType}
                        />
                        {fieldType === 'color' && (
                            <input 
                                type="text" 
                                className="colorcode" 
                                id={`color_${fieldId}`} 
                                value={!currentValue ? '#000000' : currentValue.toLowerCase()} 
                                onChange={handleColorChange} 
                                maxLength={7}
                            />
                        )}
                        {fieldType === 'password' && PasswordToggleButton}
                    </>
                )}
            </div>
            {showError && <small className="tips">{validationResult}</small>}
        </div>
    );
}