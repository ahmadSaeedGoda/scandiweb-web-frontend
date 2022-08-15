export async function fetchDataService ({ url, body = {} }) {
    try {
        const response = await fetch(url, body);
        return await response.json();
    } catch (error) {
        alert("Ops! Something went wrong, Please try again!");
        console.error(error);
    }
}