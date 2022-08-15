export default class ProductAttribute
{
    #PK_AttributeID = '';
    #AttributeName = '';
    #AttributeMeasureUnit = '';
    #FK_ProductType = '';
    
    constructor({id, attrName, measureUnit, productType}) {
        this.#PK_AttributeID = id;
        this.#AttributeName = attrName;
        this.#AttributeMeasureUnit = measureUnit;
        this.#FK_ProductType = productType;
    }

    get id() {
        return this.#PK_AttributeID;
    }

    get attrName() {
        return this.#AttributeName;
    }

    get measureUnit() {
        return this.#AttributeMeasureUnit;
    }

    get productType() {
        return this.#FK_ProductType;
    }
}
