import ValidationScheme from "./ValidationScheme";

export default class ProductAttributeValidationScheme extends ValidationScheme
{
    get name() {
        return 'AttributeName';
    }
    
    get measureUnit() {
        return 'AttributeMeasureUnit';
    }
    
    get productType() {
        return 'FK_ProductType';
    }
}
