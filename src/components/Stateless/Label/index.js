import React from "react";

const Label = (props) => {

    return (
        <label htmlFor={props.inputID}>
            {props.label}
            &nbsp;
            {props.required === true? <span className="required">*</span> : null}
        </label>
    );
};

export default Label;
