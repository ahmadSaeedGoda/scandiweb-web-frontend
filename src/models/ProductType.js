import StronglyTypedArray from "../helpers/StronglyTypedArray";
import ProductAttribute from "./ProductAttribute";

export default class ProductType
{
    #PK_ProductType = '';
    #Description = '';
    #type_attributes = new StronglyTypedArray(ProductAttribute);
    
    constructor({id, description, attributes}) {
        this.#PK_ProductType = id;
        this.#Description = description;
        this.#type_attributes = attributes;
    }

    get id() {
        return this.#PK_ProductType;
    }

    get description() {
        return this.#Description;
    }

    get attributes() {
        return this.#type_attributes;
    }
}
