import { productTypeRecordToProductTypeModelTransformer } from "./productTypeRecordToProductTypeModel.transformer";

export const productTypesResponseToProductTypeModelsArrayTransformer = 
    response => 
        response.map(
            productTypeRecord => 
                productTypeRecordToProductTypeModelTransformer(productTypeRecord)
        );