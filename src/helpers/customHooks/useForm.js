import { useState } from "react";
import { SchemeValidator } from "../validators/FormValidator";

export const useForm = ({ initialValues, validationsScheme, onSubmit }) => {

    const [data, setData] = useState((initialValues || {}));
    const [errors, setErrors] = useState({});
    const [dynamicValidationScheme, setDynamicValidationScheme] = useState(validationsScheme);

    const getValidationScheme = () => dynamicValidationScheme;

    const setValidationRule = (key, validationRule) => {
        dynamicValidationScheme[key] = validationRule;
        setDynamicValidationScheme({ ...dynamicValidationScheme });
    }

    const removeValidationRule = (key) => {
        delete dynamicValidationScheme[key];
        setDynamicValidationScheme({ ...dynamicValidationScheme });
    }

    const handleInputFieldChange = (key, sanitizeFn) => (e) => {
        const value = sanitizeFn ? sanitizeFn(e.target.value) : e.target.value;

        data[key] = value;

        setData({ ...data });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            typeof dynamicValidationScheme === 'object' &&
            dynamicValidationScheme.constructor.name === "Object" &&
            null !== dynamicValidationScheme &&
            undefined !== dynamicValidationScheme
        ) {
            const validationErrors = await SchemeValidator({ validationsScheme: dynamicValidationScheme, data: data });

            if (true !== validationErrors) {
                setErrors(validationErrors);
                return;
            }
        } else {
            console.warn(
                `The client code of the component that uses the \`useForm\` Hook does'nt supply/provide the Validation Scheme in a proper format which should be an object contains form fields names that need validation!\nIf this is intended to not validate the form data while still needs some other functionalities of the hook, consider passing an empty object instead!`
            );
        }
        
        setErrors({});

        if (onSubmit) {
            onSubmit(e);
        }
    };
  
    return {
        validatedFormData: data,
        inputFieldChangeHandler: handleInputFieldChange,
        formSubmitHandler: handleSubmit,
        formErrors: errors,
        getScheme: getValidationScheme,
        setRule: setValidationRule,
        removeRule: removeValidationRule,
    };
};
