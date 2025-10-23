import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function TextBox({ name, value = '', extra = {}, onChange = null }) {
    // init
    const { 
        type = 'text', 
        id = name, 
        alias, 
        placeholder, 
        multiple, 
        validation, 
        regex, 
        isReadonly, 
        isDisabled, 
        translation 
    } = extra;
    const [passwordMode, setPasswordMode] = useState(true);
    const [internalValue, setInternalValue] = useState((type === 'color' && value === '' ? '#585d93' : value));

    // Synchronize 
    useEffect(() => {
        setInternalValue(value);
    }, [value]);
    
    // Functions
    const handleChange = (e) => {
        const parentElement = e.target.closest('div.iweb-input');
        parentElement.classList.remove('error');
        const existingErrors = parentElement.querySelectorAll('small.tips');
        existingErrors.forEach(err => err.remove());

        if (onChange) { 
            if (type === 'file') {
                onChange(e.target.files);
            } else {
                onChange(e.target.value);
            }
        } else {
            setInternalValue(e.target.value);
        }
    };

    const switchPwdMode = () => {
        setPasswordMode(!passwordMode);
    }

    // View
    const commonProps = {
        id,
        name,
        ...(type !== 'file' && { value: (onChange ? value : internalValue) }),
        onChange: handleChange,
        autoComplete: 'off',
        readOnly: isReadonly,
        disabled: isDisabled,
        ...(type === 'file' && multiple && { multiple: true }),
        ...(placeholder && { placeholder }),
        ...(validation && { 'data-validation': validation }),
        ...(regex && { 'data-regex': regex }),
        ...(translation && { 'data-translation': translation }),
        style: { display: 'block', width: '100%' }
    };

    return (
        <>
            {alias && <label htmlFor={ id } className="name">{ alias }</label>}
            <div style={{ position: 'relative' }}>
                <div className={`iweb-input iweb-input-${ type === 'editor' ? 'textarea editor' : type }`}>
                    {
                        (type === 'textarea' || type === 'editor') ?
                        (
                            <textarea { ...commonProps } className={ type === 'editor' ? 'editor' : '' } />
                        ) : 
                        (
                            <>
                                <input type={ type === 'password' ? (passwordMode ? 'password' : 'text') : type } { ...commonProps } />
                                { 
                                    type === 'color' && 
                                    ( 
                                        <input type="text" value={ internalValue } maxLength="7" onChange={ handleChange }/> 
                                    ) 
                                }
                                {   
                                    type === 'password' && 
                                    (
                                        <button type="button" className="switch-pwd-type" onClick={ switchPwdMode }>
                                            {passwordMode ? <FontAwesomeIcon icon="fa-eye-slash"/> : <FontAwesomeIcon icon="fa-eye"/>}
                                        </button>
                                    )
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    );
}