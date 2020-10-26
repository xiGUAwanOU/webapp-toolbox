export default class InputValidator {
    private validateFunction;
    constructor(jsonSchema: object);
    validate(jsonObject: any): void;
}
