import React from 'react';
import { productAttributesGenerator } from '../../../helpers/productAttributesGenerator';

const Product = (props) => {

    const getFormattedPrice = (price) => `${price.toFixed(2)}`;

    return (
        <div className="card_header">
            <h2>{props.product.sku}</h2>
            <h2>{props.product.name}</h2>
            <p className="price">
                {props.product.currencySymbol}
                {getFormattedPrice(parseFloat(props.product.price))}
            </p>
            <h2>{productAttributesGenerator(props.product)}</h2>
        </div>
    );
}

export default Product;
