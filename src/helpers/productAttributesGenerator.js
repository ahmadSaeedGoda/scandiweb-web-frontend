/*
This helper function is useful for generating string for render to display in the product card.

Takes a `productModel` returns a string to display in the UI.

TODO replace it in more appropriate folder and refactor it to avoid complexity!
*/
export const productAttributesGenerator = productModel => {
    let returnString = '';
    let counter = 0;

    productModel.attributes.map(

        productAttributeModel => {

            let attributeValue = '';
            let hasMultipleAtrrs = (1 < productModel.attributes.length);
            productModel.attributesValues.forEach(
                attrValueModel => {
                if (attrValueModel.attrID === productAttributeModel.id) {
                    counter += 1;
                    if (counter < productModel.attributes.length) {
                        attributeValue += attrValueModel.attrValue + 'x';
                    } else {
                        attributeValue += attrValueModel.attrValue;
                    }
                }
            });

            if (counter <= productModel.attributes.length && hasMultipleAtrrs) {
                if (counter < productModel.attributes.length) {
                    returnString += `${attributeValue}`;
                } else {
                    returnString += `${attributeValue} ${productAttributeModel.measureUnit}`;
                }
            } else {
                returnString += `${productAttributeModel.attrName}: ${attributeValue} ${productAttributeModel.measureUnit}`;
            }

            return returnString;
        }
    );

    counter = 0;
    return returnString;
};