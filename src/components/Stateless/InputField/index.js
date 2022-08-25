import React from "react";
import Label from "../Label";

const InputField = ({ label, labelRequired, type, name, id, placeholder, required, value, onChange, autoFocus, className }) => {

    switch (type) {
        case 'checkbox':
            return (
                <input 
                    type={type}
                    name={name}
                    id={id} 
                    value={value}
                    onChange={onChange}
                    className={className} 
                />
            );
            break;
    
        case 'number':
            return (
                <>
                    <Label label={label} inputID={id} required={labelRequired} />
                    <input 
                        type={type}
                        min="0"
                        step={.01}
                        name={name}
                        id={id} 
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={onChange}
                        autoFocus={autoFocus}
                        className={className} 
                    />
                </>
            );
            break;
    
        default:
            return (
                <>
                    <Label label={label} inputID={id} required={labelRequired} />
                    <input 
                        type={type}
                        name={name}
                        id={id} 
                        placeholder={placeholder}
                        required={required}
                        value={value}
                        onChange={onChange}
                        autoFocus={autoFocus}
                        className={className} 
                    />
                </>
            );
            break;
    }
};

export default InputField;
