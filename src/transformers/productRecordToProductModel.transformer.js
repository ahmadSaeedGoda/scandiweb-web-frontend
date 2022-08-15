import ProductModel from "../models/Product";
import ProductAttribute from "../models/ProductAttribute";
import ProductAttributeValue from "../models/ProductAttributeValue";

export const productRecordToProductModelTransformer = productRecord =>
    new ProductModel({
        id: productRecord.PK_ProductID,
        sku: productRecord.SKU,
        name: productRecord.Name,
        price: productRecord.Price,
        currencySymbol: productRecord.CurrencySymbol,
        attributes: productRecord.product_attributes.map(
            record =>  new ProductAttribute({
                id: record.PK_AttributeID,
                attrName: record.AttributeName,
                measureUnit: record.AttributeMeasureUnit,
                productType: record.FK_ProductType,
            })
        ),
        attributesValues: productRecord.attributes_values.map(
            (record) =>  new ProductAttributeValue({
                productID: record.FK_ProductID,
                attrID: record.FK_AttributeID,
                attrValue: record.AttributeValue,
            })
        ),
    });
