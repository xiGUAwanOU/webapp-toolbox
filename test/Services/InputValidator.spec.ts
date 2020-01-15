import InputValidator from "../../src/Services/InputValidator";

describe("InputValidator", () => {
  let inputValidator: InputValidator;

  beforeEach(() => {
    inputValidator = new InputValidator(require("../Data/item.schema.json"));
  });

  it("does nothing if user input is valid", () => {
    inputValidator.validate({ numberField: 42 });
  });

  it("throws an error if there is a missing root field", () => {
    expect(() => inputValidator.validate({ stringField: "foo" })).toThrow({
      name: "InputValidationError",
      message: "Object should have required property 'numberField'",
    });
  });

  it("throws an error if there is an invalid field value", () => {
    expect(() => inputValidator.validate({ numberField: "foo" })).toThrow({
      name: "InputValidationError",
      message: "Field '.numberField' should be integer",
    });
  });
});
