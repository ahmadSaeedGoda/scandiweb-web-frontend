import React from "react";
import Label from "../Label";

const InputField = ({ label, labelRequired, type, name, id, placeholder, required, value, onChange, autoFocus, className }) => {
    const checkboxType = 'checkbox';
    if (checkboxType === type) {
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
    }

    return (
        <div>
            <Label label={label} required={labelRequired} />
            <input 
                type={type}
                name={name}
                id={id} 
                placeholder={placeholder}
                required={(required===true? "required" : null)}
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                className={className} 
            />
        </div>
    );
};

export default InputField;
