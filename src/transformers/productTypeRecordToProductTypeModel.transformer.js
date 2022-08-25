import ProductAttribute from "../models/ProductAttribute";
import ProductType from "../models/ProductType";

export const productTypeRecordToProductTypeModelTransformer = productTypeRecord => 
    new ProductType({
        id: productTypeRecord.PK_ProductType,
        description: productTypeRecord.Description,
        attributes: productTypeRecord.product_type_attributes.map(
            typeAttributeRecord => 
                new ProductAttribute({
                    id: typeAttributeRecord.PK_AttributeID,
                    attrName: typeAttributeRecord.AttributeName,
                    measureUnit: typeAttributeRecord.AttributeMeasureUnit,
                    productType: typeAttributeRecord.FK_ProductType,
                    backendType: typeAttributeRecord.BackendDataType,
                    inputType: typeAttributeRecord.FrontendInputType,
                    label: typeAttributeRecord.FrontendLabel,
                    isRequired: typeAttributeRecord.IsRequired,
                    defaultValue: typeAttributeRecord.DefaultValue,
                    note: typeAttributeRecord.Note,
                })
        )
    });