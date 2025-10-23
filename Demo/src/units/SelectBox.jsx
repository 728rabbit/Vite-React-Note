import { useState, useEffect } from 'react';

export default function SelectBox({ name, options = [], value = '', extra = {}, onChange = null }) {
    // Init
    const {
        type = 'select', 
        id = name, 
        alias, 
        validation, 
        regex, 
        isReadonly, 
        isDisabled, 
        translation
    } = extra;
    const [internalValue, setInternalValue] = useState(value);

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
            onChange(e.target.value) 
        }
        else {
            setInternalValue(e.target.value);
        }
    };

    // View
    const commonProps = {
        id,
        name,
        value: (onChange ? value: internalValue),
        onChange: handleChange,
        autoComplete: 'off',
        readOnly: isReadonly,
        disabled: isDisabled,
        ...(validation && { 'data-validation': validation }),
        ...(regex && { 'data-regex': regex }),
        ...(translation && { 'data-translation': translation })
    };

    if(type === 'select') {
        return (
            <>
                {alias && <label htmlFor={id} className='name'>{alias}</label>}
                <div className={`iweb-input iweb-${type}`}>
                    <div className='real'>
                        <select {...commonProps}>
                            { options && (options.map((item, index) => (
                                <option key={index} value={item.value}>{item.label}</option>
                            )))}
                        </select>
                    </div>
                </div>
            </>
        );
    }
    else if(type === 'radio' || type === 'checkbox') {
        return (
            <>
                {alias && <label className="name">{alias}</label>}
                <div className={`iweb-input iweb-${type}-set`}>
                    {options.map((item, index) => (
                        <div key={index} className={`iweb-${type}${type === 'radio' ? (internalValue === item.value ? ' checked' : '') : (Array.isArray(internalValue) && internalValue.includes(item.value) ? ' checked' : '')}`}>
                            <input type={type}
                                id={`${id}_${index}`}
                                name={name}
                                value={item.value}
                                autoComplete='off'
                                {...(validation && { 'data-validation': validation })}
                                {...(regex && { 'data-regex': regex })}
                                {...(translation && { 'data-translation': translation })}
                                checked={type === 'radio' ? internalValue === item.value : Array.isArray(internalValue) && internalValue.includes(item.value)}
                                onChange={(e) => {
                                    if(type === 'radio') {
                                        handleChange(e);
                                    } else {
                                        const existingErrors = e.target.closest('div.iweb-input').querySelectorAll('small.tips');
                                        existingErrors.forEach(err => err.remove());

                                        let newValue = Array.isArray(internalValue) ? [...internalValue] : [];
                                        if(e.target.checked) {
                                            newValue.push(item.value);
                                        } else {
                                            newValue = newValue.filter(v => v !== item.value);
                                        }

                                        if (onChange) { 
                                            if(onChange) onChange({ target: { name, value: newValue }});
                                        }
                                        else {
                                            setInternalValue(newValue);
                                        }
                                    }
                                }}
                            />
                            { item.label && (
                            <label htmlFor={`${id}_${index}`}>{item.label}</label>
                             )}
                        </div>
                    ))}
                </div>
            </>
        );
    }
}