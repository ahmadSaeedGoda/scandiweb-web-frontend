import StronglyTypedArray from "../helpers/StronglyTypedArray";
import ProductAttribute from "./ProductAttribute";
import ProductAttributeValue from "./ProductAttributeValue";

export default class ProductModel
{
    #PK_ProductID = '';
    #SKU = '';
    #Name = '';
    #Price = '';
    #CurrencySymbol = '';
    #FK_ProductType = '';
    #product_attributes = new StronglyTypedArray(ProductAttribute);
    #attributes_values = new StronglyTypedArray(ProductAttributeValue);
    
    constructor({id, sku, name, price, currencySymbol, productType, attributes, attributesValues}) {
        this.#PK_ProductID = id || null;
        this.#SKU = sku || '';
        this.#Name = name || '';
        this.#Price = price || 0.00;
        this.#CurrencySymbol = currencySymbol || '';
        this.#FK_ProductType = productType || '';
        this.#product_attributes = attributes || [];
        this.#attributes_values = attributesValues || [];
    }

    get id() {
        return this.#PK_ProductID;
    }

    get sku() {
        return this.#SKU;
    }

    get name() {
        return this.#Name;
    }

    get price() {
        return this.#Price;
    }

    get currencySymbol() {
        return this.#CurrencySymbol;
    }

    get productType() {
        return this.#FK_ProductType;
    }

    get attributes() {
        return this.#product_attributes;
    }

    get attributesValues() {
        return this.#attributes_values;
    }
}
