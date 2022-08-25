const getBaseUrl = () => {
    let url;
    switch(process.env.NODE_ENV) {
        case 'production':
            url = 'https://www.scandiweb.local/api/v1'; //TODO set later on after backend deploy
            break;
        
        case 'development':
            url = 'http://www.scandiweb.local/api/v1';
            break;

        default:
            url = 'https://www.scandiweb.local/api/v1';
            break;
    }

    return url;
}

export default getBaseUrl;
