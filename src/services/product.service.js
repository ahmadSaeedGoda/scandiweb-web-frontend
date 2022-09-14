import getBaseUrl from "./serverUrlRetriever";

export async function createProductService ({ productData }) {
    try {
        let basicProductProps = ['SKU', 'Name', 'Price', 'FK_ProductType', 'ProductAttributes'];
        let requestBody = {};
        requestBody['ProductAttributes'] = {};
        for (let property in productData) {
            if (false === basicProductProps.includes(property)) {
                // this means the current prop is special attr/product specific
                requestBody['ProductAttributes'][property] = productData[property];
            } else {
                requestBody[property] = productData[property];
            }
        }
        
        const response = await fetch(`${getBaseUrl()}/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        return await response.json();
    } catch (error) {
        alert("Ops! Something went wrong, Please try again!");
        console.error(error);
    }
}


export async function isValidSKUService ({ sku }) {
    try {
        const response = await fetch(`${getBaseUrl()}/products/sku/isValid/${sku}`, { method: "GET" });
        return await response.json();
    } catch (error) {
        alert("Ops! Something went wrong, Please try again!");
        console.error(error);
    }
}

