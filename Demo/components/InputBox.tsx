/*
通用輸入框元件, 支援受控和非受控兩種模式

@example 非受控模式
    <InputBox fieldName="username" defaultValue="預設值" onChange={(v) => console.log(v)} />

@example 受控模式
    <InputBox fieldName="email" value={email} onChange={setEmail} placeholder="請輸入 email" />

@example 完整屬性
    <InputBox
    fieldName="password"
    fieldType="password"
    value={password}
    onChange={setPassword}
    placeholder="請輸入密碼"
    validation="required|password"
/>
*/

import { useCallback, useMemo, useState } from 'react';
import './InputBox.css';

interface InputBoxProps {
    fieldName: string;
    fieldType?: string;
    fieldId?: string;
    value?: string; // Support controlled components
    defaultValue?: string;  // Support for uncontrolled components
    onChange?: (value: string, isValid?: boolean) => void;
    placeholder?: string;
    disabled?: boolean;
    validation?: string
}

const isValid = (value: string, validation?: string): string => {
    if (validation) {
        const rules = validation.split('|');
        
        // If there is no required rule and the value is empty, return an empty string directly (no error).
        const hasRequired = rules.includes('required');
        if (!hasRequired && value.trim() === '') {
            return '';
        }

        // Helper function: Check if it is a valid number
        const isValidNumber = (val: string): boolean => {
            return !isNaN(Number(val)) && val.trim() !== '';
        };
        
        for (const rule of rules) {
            switch (rule) {
                case 'required':
                    if (!value.trim()) { 
                        return 'Please fill out this field correctly.'; 
                    }
                    break;
                case 'password':
                    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value)) {
                        return 'Password must contain at least 6 characters, including upper/lowercase and numbers (e.g. Abc123).'; 
                    }
                    break;
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                       return 'Invalid email address format.'; 
                    }
                    break;
                case 'date':
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        return 'Invalid date format.'; 
                    }
                    break;
                case 'time':
                    if (!/^\d{2}:\d{2}$/.test(value)) {
                        return 'Invalid time format.'; 
                    }
                    break;
                case 'number':
                    if (!isValidNumber(value)) {
                        return 'Invalid number format.'; 
                    }  
                    break;
                case 'ge0':
                    if (!isValidNumber(value)) {
                        return 'Invalid number format.';
                    }
                    if (Number(value) < 0) {
                        return 'Value must be greater than or equal to 0.'; 
                    }  
                    break;
                case 'gt0':
                    if (!isValidNumber(value)) {
                        return 'Invalid number format.';
                    }
                    if (Number(value) <= 0) {
                        return 'Value must be greater than 0.'; 
                    }  
                    break;
                default:
                    if (rule.startsWith('regex:')) {
                        const pattern = rule.replace('regex:', '');
                        try {
                            const regex = new RegExp(pattern);
                            if (!regex.test(value)) {
                                return 'Invalid Regular format.'; 
                            }
                        } catch (e) {
                            return 'Invalid regular expression pattern.';
                        }
                    }
            }
        }
    }
    return '';
}

export default function InputBox({
    fieldName,
    fieldType = 'text',
    fieldId = fieldName,
    value: externalValue,
    defaultValue = '',
    onChange,
    ...props
}: InputBoxProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [passwordMode, setPasswordMode] = useState(true);
    const [isTouched, setIsTouched] = useState(false); 
  
    const isControlled = externalValue !== undefined;
    const currentValue = isControlled ? externalValue : internalValue;

    // useCallback: caches the validation function to avoid creating it on every render.
    const validateValue = useCallback((value: string) => {
        return isValid(value, props.validation);
    }, [props.validation]);  // Recreate only when validation changes

    // useMemo: Caches validation results to avoid duplicate calculations
    const validationResult = useMemo(() => {
        return validateValue(currentValue);
    }, [currentValue, validateValue]);

    // useCallback: cached event handling function
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const result = validateValue(newValue);

        if (!isControlled) {
            setInternalValue(newValue);
        }

        if (!isTouched) {
            setIsTouched(true);
        }
        
        onChange?.(newValue, result === '');
    }, [isControlled, validateValue, onChange, isTouched]);

    // useCallback: Cache password switching function
    const togglePasswordMode = useCallback(() => {
        setPasswordMode(prev => !prev);
    }, []);

    // output
    return (
        <div className={`iweby-input iweby-input-${fieldType}`}>
            <div style={{position: 'relative', display: 'block'}}>
                {
                    (fieldType === 'textarea' || fieldType === 'editor') ? 
                    (
                        <textarea
                            className={(isTouched && validationResult) ? 'error' : ''}
                            id={fieldId}
                            name={fieldName}
                            value={currentValue}
                            onChange={handleChange}
                            {...props}
                            autoComplete="off"/>
                    )
                    : 
                    (
                        <>
                            <input
                            className={(isTouched && validationResult) ? 'error' : ''}
                            type={(fieldType === 'password') ? (passwordMode ? 'password' : 'text') : fieldType}
                            id={fieldId}
                            name={fieldName}
                            value={currentValue}
                            onChange={handleChange}
                            {...props}
                            autoComplete="off"/>
                            {
                                (fieldType === 'password') && (
                                    <button type="button" 
                                        style={{
                                            position: 'absolute',
                                            right: '0px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#222'
                                        }}
                                        onClick={togglePasswordMode}>
                                        {
                                            passwordMode ? 
                                            (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                                                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                                                </svg>
                                            ) : 
                                            (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="currentColor"/>
                                                    <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    <circle cx="12" cy="12" r="3" fill="currentColor"/>
                                                </svg>
                                            )
                                        }
                                    </button>
                                )
                            }

                        </>
                    )
                }
            </div>
            {
                (isTouched && validationResult) && (
                    <small className="tips">{validationResult}</small>
                )
            }
        </div>
    );
}