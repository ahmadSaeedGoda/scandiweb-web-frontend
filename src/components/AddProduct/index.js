import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../helpers/customHooks/useForm";
import ProductValidationScheme from "../../helpers/validators/ProductValidationScheme";
import Dropdown from "../Stateless/DropdownList";
import InputField from "../Stateless/InputField";
import getBaseUrl from '../../services/serverUrlRetriever';
import './AddProduct.css';
import { productTypesResponseToProductTypeModelsArrayTransformer } from "../../transformers/productTypesResponseToProductTypeModelsArray.transformer";
import { productTypesResponseToDropdownOptionsListTransformer } from "../../transformers/productTypesResponseToDropdownOptionsList.transformer";
import { useKeyBoardFormManipulator } from "../../helpers/formSubmitCancelUsingKeyboard";

const AddProduct = () => {

    let navigate = useNavigate();
    
    const redirectToProductsListingPage = () => { 
        let rootPath = `/`;
        navigate(rootPath);
    };

    const [productTypes, setProductTypes] = useState([]);
    const [productType, setProductType] = useState('');
    const [productTypesOptions, setProductTypesOptions] = useState([]);
    const [specialAttribute, setSpecialAttribute] = useState({});
    const [validationKeys, setValidationKeys] = useState([]);
    
    function persist(userSubmittedData) { // FIXME replace to service file in services dir
        let formBody = [];
        for (let property in userSubmittedData) {
          let encodedKey = encodeURIComponent(property);
          let encodedValue = encodeURIComponent(userSubmittedData[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        fetch(`${getBaseUrl()}/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        })
        .then(response => response.json())
        .then(redirectToProductsListingPage)
        .catch(
            error =>{
                alert("Ops! Something went wrong, Please try again!");
                console.error(error);
            }
        );
    };

    let handleSubmit = async () => {
        try {
            let response = await fetch(`${getBaseUrl()}/products/${validatedFormData[productScheme.sku]}`, {
                method: "GET"
            });

            let body = await response.json();

            if (200 !== body.code || false === body.data) {
                alert("The SKU is Already in use, Please try again!");
            } else if (200 === body.code && true === body.data) {
                persist(validatedFormData); //TODO we should make the useForm hook play with models better instead of random data obj!
            } else {
                alert("Ops! Something went wrong, Please try again!");
            }
        } catch (error) {
            alert("Ops! Something went wrong, Please try again!");
            console.error(error);
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

    // because react 18 latest version renders the component twice when useEffect is invoked to stress test it in development we need to check
    // for more info visit https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
    const ignoreTypesFetch = useRef(false);
    
    useEffect(() => {
        // if (false === ignoreTypesFetch.current || 'development' !== process.env.NODE_ENV) {
            (async () => {
                const response = await fetch(`${getBaseUrl()}/products/types`, {
                    method: 'GET'
                });
                
                let jsonResponse = await response.json();
                
                // Data modeling before storing in state for maintainability and reuse. As components should be backend keys/data agnostic!
                setProductTypes(
                    productTypesResponseToProductTypeModelsArrayTransformer(jsonResponse.data)
                );

                setProductTypesOptions(
                    productTypesResponseToDropdownOptionsListTransformer(
                        jsonResponse.data
                    )
                );
            })();
        // }
        // return () => ignoreTypesFetch.current = true;
    }, []);

    // const ignoreAddingListeners = useRef(false);
    
    // on first render we need to add event listner to submit the form on Enter key press, or cancel on esc key press
    // TODO Refactor to separate custom hook or extract to function!
    useEffect(() => {
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

        // if (false === ignoreAddingListeners.current || 'development' !== process.env.NODE_ENV) {
            registerListeners();
        // }

        return () => {
            removeListeners();
            // ignoreAddingListeners.current = true;
        }
    }, []);

    // const ignoreAddingSpecialAttrs = useRef(false);
    
    // Product Type Switch shall trigger this hook to create, display, and validate the special attributes dynamically on the fly!
    useEffect(() => {
        // if (false === ignoreAddingSpecialAttrs.current || 'development' !== process.env.NODE_ENV) {
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
                                            id={typeAttributeModel.attrName}
                                            placeholder={`Enter Product ${typeAttributeModel.attrName}`}
                                            value={validatedFormData[typeAttributeModel.attrName]}
                                            onChange={inputFieldChangeHandler(typeAttributeModel.attrName)}
                                            className={formErrors[`${typeAttributeModel.attrName}`] ? "input.error inputBox" : "inputBox"}
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
        // }
    }, [productType]);

    // just a function to generate special attributes with errors notices respectively if any, then be displayed when called in the return section.
    const displaySpecialAttributes = () => {
        let attributes = [];
        for (const attrName in specialAttribute) {
            for (const key of validationKeys) {
                if (key === attrName) {
                    attributes.push(specialAttribute[attrName]);
                    attributes.push(<p className="error" key={key}>{formErrors[key]}</p>);
                }
            }
        }
        return attributes;
    };

    return(
        <div className="product">
            <form id="add_product_form" method="GET" onSubmit={formSubmitHandler}>
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
                        id={productScheme.sku}
                        placeholder={`Enter Product ${productScheme.sku}`}
                        value={validatedFormData[productScheme.sku] || ''}
                        onChange={ inputFieldChangeHandler(productScheme.sku) }
                        autoFocus={true}
                        className={formErrors[productScheme.sku] ? "input.error inputBox" : "inputBox"}
                    />
                    {formErrors[productScheme.sku] && <p className="error">{formErrors[productScheme.sku]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.name}:`}
                        labelRequired={true}
                        name={productScheme.name}
                        id={productScheme.name}
                        placeholder={`Enter Product ${productScheme.name}`}
                        onChange={ inputFieldChangeHandler(productScheme.name) }
                        value={validatedFormData[productScheme.name] || ''}
                        className={formErrors[productScheme.name] ? "input.error inputBox" : "inputBox"}
                    />
                    {formErrors[productScheme.name] && <p className="error">{formErrors[productScheme.name]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.price}:`}
                        labelRequired={true}
                        type="number"
                        name={productScheme.price}
                        id={productScheme.price}
                        placeholder={`Enter Product ${productScheme.price} $$`}
                        value={validatedFormData[productScheme.price] || ''}
                        onChange={ inputFieldChangeHandler(productScheme.price, (value) => parseFloat(value)) }
                        className={formErrors[productScheme.price] ? "input.error inputBox" : "inputBox"}
                    />
                    {formErrors[productScheme.price] && <p className="error">{formErrors[productScheme.price]}</p>}
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
                            className={formErrors[productScheme.productType] ? "input.error inputBox" : "inputBox"}
                        />
                    }
                    { formErrors[productScheme.productType] && <p className="error">{formErrors[productScheme.productType]}</p> }
                </div>

                <div className="block">
                    {displaySpecialAttributes()}
                </div>
            </form>
        </div>
    );
    
};

export default AddProduct;
