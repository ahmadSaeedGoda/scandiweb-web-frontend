export const productTypeRecordToDropdownOptionTransformer = productTypeRecord => {
    return {
        label: productTypeRecord.PK_ProductType,
        value: productTypeRecord.PK_ProductType
    };
};