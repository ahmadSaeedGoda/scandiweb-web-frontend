import DropdownOption from "../models/DropdownOption";

export const productTypeRecordToDropdownOptionTransformer = productTypeRecord => 
    new DropdownOption({
        label: productTypeRecord.PK_ProductType,
        value: productTypeRecord.PK_ProductType
    });
