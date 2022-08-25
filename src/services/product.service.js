import getBaseUrl from "./serverUrlRetriever";

export async function createProductService ({ productData }) {
    try {
        let formBody = [];
        for (let property in productData) {
          let encodedKey = encodeURIComponent(property);
          let encodedValue = encodeURIComponent(productData[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        
        const response = await fetch(`${getBaseUrl()}/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
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

