export default class ProductAttributeValue
{
    #FK_ProductID = '';
    #FK_AttributeID = '';
    #AttributeValue = '';
    
    constructor({productID, attrID, attrValue}) {
        this.#FK_ProductID = productID;
        this.#FK_AttributeID = attrID;
        this.#AttributeValue = attrValue;
    }

    get productID() {
        return this.#FK_ProductID;
    }

    get attrID() {
        return this.#FK_AttributeID;
    }

    get attrValue() {
        return this.#AttributeValue;
    }
}
