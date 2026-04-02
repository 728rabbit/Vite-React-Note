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
    fieldType?: 'text' | 'password' | 'datetime-local' | 'date' | 'time' | 'color' | 'tel' | 'email' | 'number' | 'textarea' | 'editor';
    fieldId?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, isValid?: boolean) => void;
    placeholder?: string;
    disabled?: boolean;
    validation?: string;
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

// Error message mapping
const ERROR_MESSAGES: Record<string, string> = {
    required: 'Please fill out this field correctly.',
    password: 'Password must contain at least 6 characters, including upper/lowercase and numbers (e.g. Abc123).',
    email: 'Invalid email address format.',
    date: 'Invalid date format.',
    time: 'Invalid time format.',
    number: 'Invalid number format.',
    ge0: 'Value must be greater than or equal to 0.',
    gt0: 'Value must be greater than 0.',
};

const getErrorMessage = (rule: string): string => {
    return ERROR_MESSAGES[rule] || 'Invalid format.';
};

const isValid = (value: string, validation?: string): string => {
    if (!validation) return '';

    const rules = validation.split('|');
    const hasRequired = rules.includes('required');
    
    // Return directly if there is no required rule and the value is empty
    if (!hasRequired && value.trim() === '') return '';

    for (const rule of rules) {
        // Built-in rules
        if (rule in VALIDATION_RULES) {
            if (VALIDATION_RULES[rule as keyof typeof VALIDATION_RULES](value)) {
                return getErrorMessage(rule);
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

// Extract password toggle button SVG as constant
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
        return isValid(value, validationRef.current);
    }, []); // Empty dependency, because changes to validationRef.current do not require recreating the function.

    // Validation result
    const validationResult = useMemo(() => {
        return validateValue(currentValue);
    }, [currentValue, validateValue]);

    // Handle change
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

    const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        // Auto-completion #
        if (newValue && !newValue.startsWith('#')) {
            newValue = '#' + newValue;
        }
        
        // Length is limited to 7 (including #)
        if (newValue.length > 7) {
            newValue = newValue.slice(0, 7);
        }
        
        // Only # and 0-9, A-F, a-f are allowed
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

    // Listen for global force validation event
    useEffect(() => {
        const handleForceValidate = () => setForceDisplayError(true);
        window.addEventListener('inputbox:forceValidate', handleForceValidate);
        return () => window.removeEventListener('inputbox:forceValidate', handleForceValidate);
    }, []);

    const showError = (isTouched || forceDisplayError) && validationResult;
    
    // Merge shared props
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
                            <input type="text" className="colorcode" id={`color_${fieldId}`} value={!currentValue ? '#000000': currentValue.toLowerCase()} onChange={handleColorChange} maxLength={7}/>
                        )}
                        {fieldType === 'password' && PasswordToggleButton}
                    </>
                )}
            </div>
            {showError && <small className="tips">{validationResult}</small>}
        </div>
    );
}