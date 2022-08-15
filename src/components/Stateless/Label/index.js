import React from "react";

const Label = (props) => {

    return (
        <label>
            {props.label}
            &nbsp;
            {props.required === true? <span className="required">*</span> : null}
        </label>
    );
};

export default Label;
