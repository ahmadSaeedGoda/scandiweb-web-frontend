export default class StronglyTypedArray extends Array
{
    #type;

    #pushValue = function(value) {
        this.values.push(value);
    };

    #push = function(value) {
        if(this.#type === typeof value) {
           this.#pushValue(value);
        } else {
            throw new TypeError(`type of ${value} should be of Type ${this.#type}`);
        }
    };

    constructor({type}) {
        super();
        this.#type = type;
    }

    get type() {
        return this.#type;
    }

    get push() {
        return this.#push;
    }
}
