import { productRecordToProductModelTransformer } from "./productRecordToProductModel.transformer";

export const productsResponseToProductModelsArrayTransformer = 
    response => 
        response.map(
            productRecord => productRecordToProductModelTransformer(productRecord)
        );