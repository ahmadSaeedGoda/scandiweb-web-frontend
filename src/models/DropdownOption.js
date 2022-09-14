export default class DropdownOption
{
    #label = '';
    #value = '';
    #isDisabled = false;
    
    constructor({ label, value, isDisabled }) {
        this.#label = label;
        this.#value = value;
        this.#isDisabled = isDisabled;
    }

    get label() {
        return this.#label;
    }

    get value() {
        return this.#value;
    }

    get isDisabled() {
        return this.#isDisabled;
    }
}
