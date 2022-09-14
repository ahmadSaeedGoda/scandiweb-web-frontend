import DropdownOption from "../models/DropdownOption";
import { productTypeRecordToDropdownOptionTransformer } from "./productTypeRecordToDropdownOptionModel.transformer";

export const productTypesResponseToDropdownOptionsListTransformer = productTypesResponse => {
    let dropDownOptions = productTypesResponse.map(
        productTypeRecord =>
            productTypeRecordToDropdownOptionTransformer(productTypeRecord)
    );

    dropDownOptions.unshift(
        new DropdownOption({ label: 'Type Switcher', value: '', isDisabled: true })
    );
    

    dropDownOptions.unshift(
        new DropdownOption({ label: '', value: '' })
    );
    
    return dropDownOptions;
};
