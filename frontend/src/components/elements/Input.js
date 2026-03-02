import React, { useState } from "react";
import validator from "../../scripts/validator";

function Input(props) {
    let validation = props.validation === undefined ? {} : props.validation;
    let attrs = {...props};
    delete attrs.validation;
    delete attrs.value;

    if (typeof validation !== "object") {
        let rules = {};
        validation.split(' ').forEach(rule => {
            rules[rule] = true;
        });
        validation = rules;
    }

    const [value, setValue] = useState(
        props.value === undefined ? '' : props.value
    );

    if (attrs.id === undefined) {
        attrs.id = "id" + Math.random().toString(16).slice(2)
    }

    if (props.required !== undefined) {
        validation.required = true;
    }

    if (props.type) {
        attrs.type = props.type;
        
        if (props.type === 'email') {
            validation.email = true;
        }
    }

    if (["text", "textarea", "email", "password"].includes(props.type)) {
        if (props.minLength !== undefined) {
            validation.minlength = props.minLength;
        }
    
        if (props.maxLength !== undefined) {
            validation.maxlength = props.maxLength;
        }
    }
    
    const validate = function() {
        validator.validate(document.getElementById(attrs.id), validation)
    }

    const handleChange = function(event) {
        setValue(event.target.value);
        validate();
    }

    if (attrs.type === "textarea") {
        return (
            <textarea {...attrs} value={value} onChange={handleChange} onBlur={validate} />
        );
    } else {
        return (
            <input {...attrs} value={value} onChange={handleChange} onBlur={validate} />
        );
    }
}

export default Input;