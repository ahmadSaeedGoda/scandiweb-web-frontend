import React from "react";
import Label from "../Label";

const Dropdown = (props) => {
    function onChangeWrapper(e) {
        props.onChange(e);
        if (props.onChangeDo) {
            props.onChangeDo(e);
        }
    }

    return (
        <>
            <Label label={props.label} required={props.labelRequired} />
            <select 
                name={props.name}
                id={props.id} 
                required={props.required}
                onChange={onChangeWrapper}
                value={props.value}
                className={props.className}
            >
                {
                    props.options.map((option, index) => 
                        <option 
                            value={option.value}
                            key={index}
                            disabled={option.isDisabled}
                        >{option.label}</option>
                    )
                }
            </select>
        </>
    );
};

export default Dropdown;
