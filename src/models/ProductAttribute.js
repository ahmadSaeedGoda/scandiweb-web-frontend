export default class ProductAttribute
{
    #PK_AttributeID = '';
    #AttributeName = '';
    #AttributeMeasureUnit = '';
    #BackendDataType = '';
    #FrontendInputType = '';
    #FrontendLabel = '';
    #IsRequired = 0;
    #DefaultValue = null;
    #Note = null;
    #FK_ProductType = '';
    
    constructor({
        id,
        attrName,
        measureUnit,
        productType,
        backendType,
        inputType,
        label,
        isRequired,
        defaultValue,
        note,
    }) {
        this.#PK_AttributeID = id;
        this.#AttributeName = attrName;
        this.#AttributeMeasureUnit = measureUnit;
        this.#BackendDataType = backendType;
        this.#FrontendInputType = inputType;
        this.#FrontendLabel = label;
        this.#IsRequired = isRequired;
        this.#DefaultValue = defaultValue;
        this.#Note = note;
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

    get backendType() {
        return this.#BackendDataType;
    }

    get inputType() {
        return this.#FrontendInputType;
    }

    get label() {
        return this.#FrontendLabel;
    }

    get isRequired() {
        return this.#IsRequired;
    }

    get defaultValue() {
        return this.#DefaultValue;
    }

    get note() {
        return this.#Note;
    }
}
