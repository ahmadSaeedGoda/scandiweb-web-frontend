import { productTypeRecordToDropdownOptionTransformer } from "./productTypeRecordToDropdownOption.transformer";

export const productTypesResponseToDropdownOptionsListTransformer = productTypesResponse => {
    let dropDownOptions = productTypesResponse.map(
        productTypeRecord =>
            productTypeRecordToDropdownOptionTransformer(productTypeRecord)
    );

    dropDownOptions.unshift({label: 'Select an Option', value: ''});
    return dropDownOptions;
};