import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TxtBox({name, value = '', onChange = null, extra = {}}) {
    // init
    const { type = "text", id = name, alias, validation, regex, placeholder, translation } = extra;
    if(type === 'color' && value === '') {
        value = '#585d93';
    }
    const [defaultValue, setValue] = useState(value);
    const [passwordMode, setPasswordMode] = useState(true);
    
    // Synchronize external value
    useEffect(() => {
        setValue(value);
    }, [value]);

    // functions
    function handleChange(e) {
        const parentElement = e.target.closest('div.iweb-input');
        parentElement.classList.remove('error');
        const existingErrors = parentElement.querySelectorAll('small.tips');
        existingErrors.forEach(err => err.remove());
        if (onChange) { 
            onChange(e.target.value) 
        }
        else {
            setValue(e.target.value);
        }
    };

    function switchPwdMode() {
        setPasswordMode(!passwordMode);
    }

    // view
    const commonProps = {
        id,
        name,
        value: (onChange ? value: defaultValue),
        onChange: handleChange,
        autoComplete: 'off',
        ...(placeholder && { placeholder }),
        ...(validation && { "data-validation": validation }),
        ...(regex && { "data-regex": regex }),
        ...(translation && { "data-translation": translation }),
        style: { display: 'block', width: '100%' }
    };

    return (
        <>
            {alias && <label htmlFor={id} className="name">{alias}</label>}
            <div style={{ position: 'relative' }}>
                <div className={`iweb-input iweb-input-${type === 'editor' ? 'textarea editor' : type}`}>
                    {
                        (type === 'textarea' || type === 'editor') ?
                            (
                                <textarea {...commonProps} className={type === 'editor' ? 'editor' : ''} />
                            ) : 
                            (
                                <>
                                    <input type={type === 'password' ? (passwordMode ? 'password' : 'text') : type} {...commonProps} />
                                    { 
                                        type === 'color' && 
                                        ( 
                                            <input type="text" value={defaultValue} maxLength={7} onChange={handleChange}/> 
                                        ) 
                                    }
                                    {   
                                        type === 'password' && 
                                        (
                                            <button type="button" className="switch-pwd-type" onClick={switchPwdMode}>
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