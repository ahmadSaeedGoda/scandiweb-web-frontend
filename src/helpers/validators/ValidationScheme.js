export default class ValidationScheme
{
    #currentScheme = {};
    
    get currentScheme() {
        return this.#currentScheme;
    }
    
    getProperty(prop) {
        return this.#currentScheme[prop];
    }
    
    setProperty(propName, propValue) {
        this.#currentScheme[propName] = propValue;
    }

    fill(scheme) {
        for (const key in scheme) {
            if (Object.hasOwnProperty.call(scheme, key)) {
                this.setProperty(this[key], scheme[key]);
            }
        }
    }
}
