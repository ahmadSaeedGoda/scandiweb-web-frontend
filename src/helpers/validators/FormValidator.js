export const SchemeValidator = async ({ validationsScheme, data }) => {

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
            if (custom?.isValid) {
                if (custom.isValid.constructor.name === "AsyncFunction" ) {
                    let responseBody = await custom.isValid(value);
                    if (200 !== responseBody.code || true !== responseBody.data) {
                        valid = false;
                        for (const error in responseBody.errors) {
                            newErrors[key] = responseBody.errors[error];
                        }
                    }
                } else {
                    if (!custom.isValid(value)) {
                        valid = false;
                        newErrors[key] = custom.message;
                    }
                }
            }
        }
    }

    if (false === valid) {
        return newErrors;
    }

    return valid;
};
