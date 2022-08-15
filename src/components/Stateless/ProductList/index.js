import React from 'react';
import InputField from "../InputField";
import Product from '../Product';

const ProductList = ({productList, handleOnCheckBoxChange}) => {

    return productList.map(
        productModel => 
                <div className="card" key={productModel.id} >
                    <InputField
                        className='delete-checkbox'
                        type="checkbox"
                        name={productModel.sku} 
                        id={productModel.id}
                        value={productModel.id}
                        onChange={
                            () => handleOnCheckBoxChange(productModel.id)
                        }
                    />
                    <Product product={productModel} />
                </div>
    );
}

export default ProductList;
