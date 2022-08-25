import React from 'react';
import { productAttributesGenerator } from '../../../helpers/productAttributesGenerator';

const Product = ({ product }) => {

    const getFormattedPrice = (price) => `${price.toFixed(2)}`;

    return (
        <div className="card_header">
            <h2>{product.sku}</h2>
            <h2>{product.name}</h2>
            <p className="price">
                {product.currencySymbol}
                {getFormattedPrice(parseFloat(product.price))}
            </p>
            <h2>{productAttributesGenerator(product)}</h2>
        </div>
    );
}

export default Product;
