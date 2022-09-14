const getBaseUrl = () => {
    let url;
    switch(process.env.NODE_ENV) {
        case 'production':
            url = process.env.REACT_APP_PRODUCTION_SERVER_BASEURL;
            break;
        
        case 'development':
            url = process.env.REACT_APP_DEV_SERVER_BASEURL;
            break;

        default:
            url = process.env.REACT_APP_DEFAULT_SERVER_BASEURL;
            break;
    }

    return url;
}

export default getBaseUrl;
