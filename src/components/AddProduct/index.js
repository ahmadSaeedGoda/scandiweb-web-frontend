import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../helpers/customHooks/useForm";
import ProductValidationScheme from "../../helpers/validators/ProductValidationScheme";
import Dropdown from "../Stateless/DropdownList";
import InputField from "../Stateless/InputField";
import getBaseUrl from '../../services/serverUrlRetriever';
import { useKeyBoardFormManipulator } from "../../helpers/formSubmitCancelUsingKeyboard";
import { createProductService, isValidSKUService } from "../../services/product.service";
import './AddProduct.css';

const AddProduct = (props) => {

    let navigate = useNavigate();
    
    const redirectToProductsListingPage = () => { 
        let rootPath = `/`;
        navigate(rootPath);
    };

    const [productType, setProductType] = useState('');
    const [specialAttribute, setSpecialAttribute] = useState({});
    const [validationKeys, setValidationKeys] = useState([]);
    
    const [productTypes, setProductTypes] = useState([]);
    const [productTypesOptions, setProductTypesOptions] = useState([]);

    let handleSubmit = async () => {
        let body = await isValidSKUService({
            sku: validatedFormData[productScheme.sku]
        });

        if (200 === body.code && false === body.data) {
            alert("The SKU is Already in use, Please try again!");
        } else if (200 === body.code && true === body.data) {
            await createProductService({productData: validatedFormData}); //TODO we should make the useForm hook play with models better instead of random data obj!
            redirectToProductsListingPage();
        } else {
            alert("Ops! Something went wrong, Please try again!");
        }
    };

    const productScheme = new ProductValidationScheme();

    const validationsScheme = {
        sku: {
            pattern: {
                value: '^[A-Za-z0-9]+$',
                message: "Spaces and Special Characters are not allowed!",
            },
            required: {
                value: true,
                message: 'This field is required',
            },
        },
        name: {
            pattern: {
                value: '^[A-Za-z0-9 ]+$',
                message: "Product Name must be a text that can include numbers and spaces. Special Characters aren't Allowed!",
            },
            required: {
                value: true,
                message: 'This field is required',
            },
        },
        price: {
            required: {
                value: true,
                message: 'This field is required',
            },
            custom: {
                isValid: (value) => parseFloat(value),
                message: 'Prices have to be Decimal numbers!',
            },
        },
        productType: {
            required: {
                value: true,
                message: 'This field is required',
            },
        },
    };

    productScheme.fill(validationsScheme);

    // TODO maybe to destructure in a const obj called useFormObj for example, then use it like useFormObj[property]
    const { validatedFormData, inputFieldChangeHandler, formSubmitHandler, formErrors, setRule, removeRule } = useForm({
        validationsScheme: productScheme.currentScheme,
        onSubmit: handleSubmit
    });
    
    const {registerListeners, removeListeners} = useKeyBoardFormManipulator({
        keyboardKeysScheme: {
            Enter: {
                handlerID: "submit_add_product_form"
            },
            NumpadEnter: {
                handlerID: "submit_add_product_form"
            },
            Escape: {
                handlerID: "cancel_add_product_form"
            }
        }
    });

    useEffect(() => {

        registerListeners();

        setProductTypes(props.productTypes);

        setProductTypesOptions(props.productTypesOptions);

        return () => {
            removeListeners();
        }
    }, []);

    // Product Type Switch shall trigger this hook to create, display, and validate the special attributes dynamically on the fly!
    useEffect(() => {
        let productTypeSpecificAttributes = new Map();
        let description = null;
        let validationRules = [];

        productTypes.forEach(
            (productTypeModel) => {
                productTypeModel.attributes.forEach(
                    (typeAttributeModel) => {
                        if (productType === typeAttributeModel.productType) {
                            validationRules.push(typeAttributeModel.attrName);
                            productTypeSpecificAttributes[typeAttributeModel.attrName] =
                                <div className="block" key={typeAttributeModel.id}>
                                    <InputField
                                        label={`${typeAttributeModel.attrName} (${typeAttributeModel.measureUnit}):`}
                                        name={typeAttributeModel.attrName}
                                        id={typeAttributeModel.attrName.toLowerCase()}
                                        placeholder={`Enter Product ${typeAttributeModel.attrName}`}
                                        value={validatedFormData[typeAttributeModel.attrName]}
                                        onChange={inputFieldChangeHandler(typeAttributeModel.attrName)}
                                        className={formErrors[`${typeAttributeModel.attrName}`] ? "inputError" : "inputBox"}
                                        key={typeAttributeModel.attrName}
                                    />
                                </div>
                            ;
                            if (null === description) {
                                description = <p key={productTypeModel.id}>{productTypeModel.description}</p>;
                            }
                        } else {
                            removeRule(typeAttributeModel.attrName);
                        }
                    }
                );
            }
        );
        
        for (const key of validationRules) {
            setRule(
                key, 
                {
                    required: {
                        value: true,
                        message: 'This field is required',
                    },
                    custom: {
                        isValid: (value) => parseFloat(value),
                        message: 'This field has to be only numbers!',
                    },
                }
            );
        }

        setValidationKeys(validationRules);

        productTypeSpecificAttributes['description'] = description;
        
        setSpecialAttribute(productTypeSpecificAttributes);
    }, [productType]);

    // just a function to generate special attributes with errors notices respectively if any, then be displayed when called in the return section.
    const displaySpecialAttributes = () => {
        let attributes = [];
        for (const attrName in specialAttribute) {
            for (const key of validationKeys) {
                if (key === attrName) {
                    attributes.push(specialAttribute[attrName]);
                    attributes.push(<p className="validationError" key={key}>{formErrors[key]}</p>);
                }
            }
        }
        return attributes;
    };

    return(
        <div className="product">
            <form id="product_form" method="GET" onSubmit={formSubmitHandler}>
                <div className="nav">
                    <h1>Add Product</h1>
                    <button className="btn" id="cancel_add_product_form" onClick={redirectToProductsListingPage}>Cancel</button>
                    <button type="submit" id="submit_add_product_form" className="btn">Save</button>
                </div>
                <hr/>
                <span>All Fields are required!</span>
                <br/>
                <br/>
                <div className="block">
                    <InputField
                        label={`${productScheme.sku}:`}
                        labelRequired={true}
                        name={productScheme.sku}
                        id='sku' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.sku}`}
                        value={validatedFormData[productScheme.sku] || ''}
                        onChange={ inputFieldChangeHandler(productScheme.sku) }
                        autoFocus={true}
                        className={formErrors[productScheme.sku] ? "inputError" : "inputBox"}
                    />
                    {formErrors[productScheme.sku] && <p className="validationError">{formErrors[productScheme.sku]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.name}:`}
                        labelRequired={true}
                        name={productScheme.name}
                        id='name' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.name}`}
                        onChange={ inputFieldChangeHandler(productScheme.name) }
                        value={validatedFormData[productScheme.name] || ''}
                        className={formErrors[productScheme.name] ? "inputError" : "inputBox"}
                    />
                    {formErrors[productScheme.name] && <p className="validationError">{formErrors[productScheme.name]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.price}:`}
                        labelRequired={true}
                        type="number"
                        name={productScheme.price}
                        id='price' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.price} $$`}
                        value={validatedFormData[productScheme.price] || ''}
                        onChange={ inputFieldChangeHandler(productScheme.price, (value) => parseFloat(value)) }
                        className={formErrors[productScheme.price] ? "inputError" : "inputBox"}
                    />
                    {formErrors[productScheme.price] && <p className="validationError">{formErrors[productScheme.price]}</p>}
                </div>

                <div className="block">
                    {
                        productTypesOptions 
                        && 
                        <Dropdown 
                            label="Product Type:"
                            labelRequired={true}
                            name={productScheme.productType}
                            id="productType" // this is as per requirements, for automated testing.
                            options={productTypesOptions}
                            value={validatedFormData[productScheme.productType]}
                            onChange={ inputFieldChangeHandler(productScheme.productType) }
                            onChangeDo={ (e) => setProductType(e.target.value) }
                            className={formErrors[productScheme.productType] ? "inputError" : "inputBox"}
                        />
                    }
                    { formErrors[productScheme.productType] && <p className="validationError">{formErrors[productScheme.productType]}</p> }
                </div>

                <div className="block">
                    {displaySpecialAttributes()}
                </div>
            </form>
        </div>
    );
    
};

export default AddProduct;
