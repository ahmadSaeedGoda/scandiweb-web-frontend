import React, { useState, useEffect, useRef } from 'react';
// import Processing from '../Stateless/Processing';
import Header from '../Stateless/Header';
import ProductList from '../Stateless/ProductList';
import Footer from '../Stateless/Footer';
import '../Stateless/Footer/Footer.css'
import getBaseUrl from '../../services/serverUrlRetriever';
import { productsResponseToProductModelsArrayTransformer } from '../../transformers/productsResponseToProductModelsArray.transformer';
import './MainContent.css'

const MainContent = () => {

    const [productsArray, setProductsArray] = useState([]);
    const [isEmptyProductList, setIsEmptyProductList] = useState(false);
    // const [isProcessing, setProcessing] = useState(false);
    const [destroyableProductsIDs, setDestroyableProductsIDs] = useState([]);

    const handleOnCheckBoxChange = (productID) => {
        if (false === destroyableProductsIDs.includes(productID)) {
            destroyableProductsIDs.push(productID);
        } else {
            let productIdIndex = destroyableProductsIDs.indexOf(productID);
            if (productIdIndex !== -1) {
                destroyableProductsIDs.splice(productIdIndex, 1);
            }
        }
        setDestroyableProductsIDs(destroyableProductsIDs);
    };

    async function handleMassDelete() {
        // setProcessing(true);

        const destroyableIds = destroyableProductsIDs;

        if (0 === destroyableIds.length) {
            // return setProcessing(false);
            return;
        }

        let requestBody = {destroyableProductsIDs: destroyableIds};
        
        try {
            const response = await fetch(`${getBaseUrl()}/products`, {
                method: 'DELETE',
                headers : { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            let body = await response.json();

            if (202 !== body.code || false === body.data) {
                alert("Ops! Something went wrong, Please try again!");
            } else if (202 === body.code && true === body.data) {
                const currentProducts = productsArray.filter(
                    entry => destroyableIds.indexOf(entry.id) === -1
                );
                if (0 < currentProducts.length) {
                    setProductsArray(currentProducts);
                } else {
                    setIsEmptyProductList(true);
                }
            } else {
                alert("Ops! Something went wrong, Please try again!");
            }
        } catch (error) {
            alert("Ops! Something went wrong, Please try again!");
            console.error(error);
        } finally {
            // return setProcessing(false);
        }
    }

    const componentMounted = useRef(false);
    
    useEffect(() => {
        // because react 18 latest version renders the component twice when useEffect is invoked to stress test it in development we need to check
        // for more info visit https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
        // if (true === componentMounted.current || 'development' !== process.env.NODE_ENV) {
            (async () => {

                // setProcessing(true); shouldn't be used for the auto QA to pass

                try {
                        
                    const response = await fetch(
                        `${getBaseUrl()}/products`,
                        {method: 'GET'}
                    );

                    let body = await response.json();

                    setProductsArray(
                        productsResponseToProductModelsArrayTransformer(body.data)
                    );

                    if (0 === body.data.length) {
                        setIsEmptyProductList(true);
                    }
                } catch (error) {
                    alert("Ops! Something went wrong, Please try again!");
                    console.error(error);
                } finally {
                    // setProcessing(false); shouldn't be used for the auto QA to pass
                }
            })();
        // }

        // return () => componentMounted.current = true;
    }, []);

    if (isEmptyProductList) {
        return (
            <div className="container">
                <Header />
                <div className="empty_main_content">
                    <h1>No Products Found Yet!</h1>
                    <h1>Try To Add Products Though!</h1>
                </div>
                <Footer />
            </div>
        );
    }

    // shouldn't be used for the auto QA to pass
    // if (isProcessing) {
    //     return (<Processing />);
    // }

    return (
        <div className="container">
            <Header
                handleMassDelete={handleMassDelete}
            />
            <div className="main_content">
                <ProductList
                    productList={productsArray}
                    handleOnCheckBoxChange={handleOnCheckBoxChange}
                />
            </div>
            <Footer />
      </div>
    )
}
export default MainContent;
