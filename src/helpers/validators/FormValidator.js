export const SchemeValidator = ({ validationsScheme, data }) => {

    let valid = true;
    const newErrors = {};

    if (validationsScheme) {
        for (const key in validationsScheme) {
            const value = data[key];
            const validationRule = validationsScheme[key];

            if (validationRule?.required?.value && !value) {
                valid = false;
                newErrors[key] = validationRule?.required?.message;
            }

            const pattern = validationRule?.pattern;
            if (pattern?.value && !RegExp(pattern.value).test(value)) {
                valid = false;
                newErrors[key] = pattern.message;
            }

            const custom = validationRule?.custom;
            if (custom?.isValid && !custom.isValid(value)) {
                valid = false;
                newErrors[key] = custom.message;
            }
        }
    }
    
    if (false === valid) {
        return newErrors;
    }

    return valid;
};
