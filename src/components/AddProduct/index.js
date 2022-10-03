import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../helpers/customHooks/useForm";
import ProductValidationScheme from "../../helpers/validators/ProductValidationScheme";
import Dropdown from "../Stateless/DropdownList";
import InputField from "../Stateless/InputField";
import getBaseUrl from '../../services/serverUrlRetriever';
import { fetchDataService } from '../../services/fetchDataService';
import { productTypesResponseToProductTypeModelsArrayTransformer } from '../../transformers/productTypesResponseToProductTypeModelsArray.transformer';
import { productTypesResponseToDropdownOptionsListTransformer } from '../../transformers/productTypesResponseToDropdownOptionsList.transformer';
import { useKeyBoardFormManipulator } from "../../helpers/formSubmitCancelUsingKeyboard";
import { createProductService, isValidSKUService } from "../../services/product.service";
import Footer from "../Stateless/Footer";
import './AddProduct.css';

const AddProduct = () => {

    let navigate = useNavigate();
    
    const redirectToProductsListingPage = () => { 
        let rootPath = `/`;
        navigate(rootPath);
    };

    const [specialAttribute, setSpecialAttribute] = useState({});
    const [validationKeys, setValidationKeys] = useState([]);
    
    const [productTypes, setProductTypes] = useState([]);
    const [productTypesOptions, setProductTypesOptions] = useState([]);

    const isValidSKU = async (userInput) => {
        let body = await isValidSKUService({
            sku: userInput
        });

        return body;
    };

    let handleSubmit = async () => {
        await createProductService({productData: validatedFormData}); //TODO we should make the useForm hook play with models better, instead of random data obj!
        redirectToProductsListingPage();
    };

    const productScheme = new ProductValidationScheme();

    const validationsScheme = {
        SKU: {
            required: {
                value: true,
                message: 'This field is required',
            },
            pattern: {
                value: '^[A-Za-z0-9-]+$',
                message: "Spaces and Special Characters are not allowed! Only Dashes `-` are Valid.",
            },
            custom: {
                isValid: async value => isValidSKU(value)
            },
        },
        Name: {
            required: {
                value: true,
                message: 'This field is required',
            },
            pattern: {
                value: '^[A-Za-z0-9 ]+$',
                message: "Product Name must be a text that can include numbers and spaces. Special Characters aren't Allowed!",
            },
            custom: {
                isValid: value => {
                    if (value) {
                        if (255 < value.length) {
                            return false;
                        }
                    }
                    return true;
                },
                message: 'Product Name too long! Consider 255 characters as the limit.',
            },
        },
        Price: {
            required: {
                value: true,
                message: 'This field is required',
            },
            custom: {
                isValid: (value) => parseFloat(value) && value > 0,
                message: 'Prices have to be Decimal numbers Greater than Zero!',
            },
        },
        FK_ProductType: {
            required: {
                value: true,
                message: 'This field is required',
            },
        },
    };

    productScheme.fill(validationsScheme);

    // TODO maybe to destructure in a const obj called useFormObj for example, then use it like useFormObj[property]
    const { validatedFormData, inputFieldChangeHandler, formSubmitHandler, formErrors, setRule, removeRule, getScheme } = useForm({
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
		fetchDataService({
			url: `${getBaseUrl()}/products/types`,
			body: {method: "GET"}
		})
		.then(
			body => {
				setProductTypes(
					productTypesResponseToProductTypeModelsArrayTransformer(body.data)
				);

				setProductTypesOptions(
					productTypesResponseToDropdownOptionsListTransformer(body.data)
				);
			}
		);
	}, []);

    useEffect(() => {

        registerListeners();

        return () => removeListeners();
    }, []);

    // Product Type Switch shall trigger this func to create, display, and validate the special attributes dynamically on the fly!
    const buildTypeAttributes = ({ selectedProductType, arrayproductTypes }) => {
        // first we need to clear any previously set attributes and their rules
        setValidationKeys([]);
        setSpecialAttribute({});

        // then we need to clear the validationsScheme from previously added rules, just the basic form elements plus current generated elements!
        for (const formElement in getScheme()) {
            // if not exist in the initial scheme that contains only the basic form elements,
            // remove the previously associated rule before adding new ones.
            if (!Object.hasOwnProperty.call(validationsScheme, formElement)) {
                removeRule(formElement);
            }
        }

        let productTypeSpecificAttributes = {};
        let validationKeys = [];
        let selectedTypeModel = arrayproductTypes.find(type => type.id === selectedProductType);

        if (undefined !== selectedTypeModel) {
            selectedTypeModel.attributes.forEach(
                typeAttributeModel => {
                    let attrName = typeAttributeModel.attrName;
                    validationKeys.push(attrName);
                    productTypeSpecificAttributes[attrName] =
                        <InputField
                            label={`${typeAttributeModel.label} (${typeAttributeModel.measureUnit})`}
                            labelRequired={(1 == typeAttributeModel.isRequired)? true : false}
                            type={typeAttributeModel.inputType}
                            name={attrName}
                            id={attrName}
                            placeholder={`Enter Product ${typeAttributeModel.label}*`}
                            value={validatedFormData[attrName]}
                            onChange={
                                inputFieldChangeHandler(
                                    attrName,
                                    value => ('numeric' === typeAttributeModel.backendType)?
                                        (value * 1) // to convert the value into number
                                        : value // otherwise keep it as is
                                )
                            }
                            className={formErrors[attrName] ? "inputError" : "inputBox"}
                        />
                        ;
                    // set required rules according to backend
                    // in case of any other rules the backend should specify. like pattern|custom
                    if (1 === typeAttributeModel.isRequired) {
                        setRule(
                            attrName,
                            {
                                required: {value: true, message: 'This field is required'},
                                custom: {
                                    isValid: value => +value, // +'' will evalutate to 0
                                    message: `${attrName} has to be of type ${typeAttributeModel.backendType}!`,
                                }
                            }
                        );
                    } else {
                        setRule(
                            attrName,
                            {
                                custom: {
                                    isValid: value => +value, // +'' will evalutate to 0
                                    message: `${attrName} has to be of type ${typeAttributeModel.backendType}!`,
                                }
                            }
                        );
                    }
                }
            );

            setValidationKeys(validationKeys);
            
            productTypeSpecificAttributes['description'] = <p key={selectedTypeModel.id}>{selectedTypeModel.description}</p>;
            
            setSpecialAttribute(productTypeSpecificAttributes);
        }
    };

    // just a function to generate special attributes with errors notices respectively if any, then be displayed when called in the return section down below.
    const displaySpecialAttributes = () => {
        let attributes = [];
        for (const attrKey in specialAttribute) {
            for (const key of validationKeys) {
                if (key === attrKey) {
                    attributes.push(
                        <div className="block" key={attrKey}>
                            {specialAttribute[attrKey]}
                            <p className="validationError">{formErrors[attrKey]}</p>
                        </div>
                    );
                }
            }
        }
        attributes.push(specialAttribute['description']);
        return attributes;
    };

    return(
        <div className="container">
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
                        label={`${productScheme.sku}`}
                        labelRequired={true}
                        name={productScheme.sku}
                        id='sku' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.sku}*`}
                        value={validatedFormData[productScheme.sku] || ''}
                        onChange={ inputFieldChangeHandler(productScheme.sku) }
                        autoFocus={true}
                        className={formErrors[productScheme.sku] ? "inputError" : "inputBox"}
                    />
                    {formErrors[productScheme.sku] && <p className="validationError">{formErrors[productScheme.sku]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.name}`}
                        labelRequired={true}
                        name={productScheme.name}
                        id='name' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.name}*`}
                        onChange={ inputFieldChangeHandler(productScheme.name) }
                        value={validatedFormData[productScheme.name] || ''}
                        className={formErrors[productScheme.name] ? "inputError" : "inputBox"}
                    />
                    {formErrors[productScheme.name] && <p className="validationError">{formErrors[productScheme.name]}</p>}
                </div>

                <div className="block">
                    <InputField
                        label={`${productScheme.price} ($)`}
                        labelRequired={true}
                        type="number"
                        name={productScheme.price}
                        id='price' // this is as per requirements, for automated testing.
                        placeholder={`Enter Product ${productScheme.price} $$*`}
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
                            onChangeDo={
                                e => {
                                    buildTypeAttributes({
                                        selectedProductType: e.target.value,
                                        arrayproductTypes: productTypes
                                    });
                                }
                            }
                            className={formErrors[productScheme.productType] ? "inputError" : "inputBox"}
                        />
                    }
                    { formErrors[productScheme.productType] && <p className="validationError">{formErrors[productScheme.productType]}</p> }
                </div>

                <div className="block">
                    {displaySpecialAttributes()}
                </div>
            </form>
            <Footer />
        </div>
    );
    
};

export default AddProduct;
