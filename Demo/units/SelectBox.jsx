import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SelectBox({name, options = [], value = '', onChange = null, extra = {}}) {
    // init
    const { type = "select", id = name, alias, validation, regex, translation } = extra;
    const [defaultValue, setValue] = useState(value);
    //options = [{ value: '', label: '請選擇' }, ...options];

    // functions
    function handleChange(e) {
        setValue(e.target.value);
        if (onChange) { onChange(e) };
    };

    // view
    const commonProps = {
        id,
        name,
        value: defaultValue,
        onChange: handleChange,
        autoComplete: 'off',
        ...(validation && { "data-validation": validation }),
        ...(regex && { "data-regex": regex }),
        ...(translation && { "data-translation": translation })
    };

    if(type === 'select') {
        return (
            <>
                {alias && <label htmlFor={id} className="name">{alias}</label>}
                <div className={`iweb-${type}`}>
                    <div className="real">
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
                <div className={`iweb-${type}-set`}>
                    {options.map((item, index) => (
                        <div key={index} className={`iweb-${type}${type === 'radio' ? (defaultValue === item.value ? ' checked' : '') : (Array.isArray(defaultValue) && defaultValue.includes(item.value) ? ' checked' : '')}`}>
                            <input type={type}
                                id={`${id}_${index}`}
                                name={name}
                                value={item.value}
                                checked={type === 'radio' ? defaultValue === item.value : Array.isArray(defaultValue) && defaultValue.includes(item.value)}
                                onChange={(e) => {
                                    if(type === 'radio') {
                                        handleChange(e);
                                    } else {
                                        let newValue = Array.isArray(defaultValue) ? [...defaultValue] : [];
                                        if(e.target.checked) {
                                            newValue.push(item.value);
                                        } else {
                                            newValue = newValue.filter(v => v !== item.value);
                                        }
                                        setValue(newValue);
                                        if(onChange) onChange({ target: { name, value: newValue }});
                                    }
                                }}
                            />
                            <label htmlFor={`${id}_${index}`}>{item.label}</label>
                        </div>
                    ))}
                </div>
            </>
        );
    }
}