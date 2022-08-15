import ValidationScheme from "./ValidationScheme";

/* TODO can be more efficient, readable, maintainable, and testable if used dynamically
e.g.
Object.getOwnProeprties or similar API to iterate over the Validator props and just exclude `constructor` and `currentScheme`
*/
export default class ProductValidationScheme extends ValidationScheme
{
    get sku() {
        return 'SKU';
    }
    
    get name() {
        return 'Name';
    }
    
    get price() {
        return 'Price';
    }
    
    get productType() {
        return 'FK_ProductType';
    }
    
    get currencySymbol() {
        return 'CurrencySymbol';
    }
}
