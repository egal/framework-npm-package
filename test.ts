// @ts-ignore
import { ValidationConstructor } from './compile/src/Constructors/ValidationConstructor.js';
let input = {
  name: 'Doeiop',
  salary: '10,000.00',
  yearOfBirth: '1980'
};
let rules = {
  name: 'required|size:3',
  salary: ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  yearOfBirth: ['required', 'regex:/^(19|20)[\\d]{2,2}$/']
};
let message = { alpha: 'You forgot to give a :attribute', required: 'hui' };
let validator = new ValidationConstructor(input, rules);

function validateInputs() {
  // validator.createValidationRule(
  //   'telephone',
  //   function (value: string) {
  //     return value.match(/^\d{3}-\d{3}-\d{4}$/);
  //   },
  //   'The :attribute phone number is not in the format XXX-XXX-XXXX.'
  // );
  let messages = validator.getAllErrorMessages('en');
  console.log(validator.getAllErrorMessages('en'));
  validator.overrideDefaultMessage('required', 'Whoops, :attribute field is required.');
  validator.changeLanguage('ru');
  console.log(validator.getAllAvailableRules());
  validator.getAllAvailableRules();
  validator
    .validate()
    .then((data: Array<object>) => {
      console.log(data, 'data');
    })
    .catch((error: object) => {
      console.log(error, 'error from test');
    });
}

validateInputs();
