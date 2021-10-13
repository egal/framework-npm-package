// @ts-ignore
import { ValidationConstructor } from './compile/src/Constructors/ValidationConstructor';

// simple rules
let data = {
  name: '',
  salary: '10,000.00',
  yearOfBirth: '1980',
  phone: 'tretret'
};
let rules = {
  name: 'required|size:3',
  salary: ['required', 'regex:/^(?!0\\.00)\\d{1,3}(,\\d{3})*(\\.\\d\\d)?$/'],
  yearOfBirth: ['required', 'regex:/^(19|20)[\\d]{2,2}$/'],
  phone: 'telephone'
};
let message = {
  alpha: ':attribute should only contain letters',
  'required.name': ':attribute is required'
};

// nested rules
// let data = {
//   name: 'John',
//   bio: {
//     age: 28,
//     education: {
//       primary: 'Elementary School',
//       secondary: 'Secondary School'
//     }
//   }
// };
// let rules = {
//   name: 'required',
//   bio: {
//     age: 'min:18',
//     education: {
//       primary: 'string',
//       secondary: 'string'
//     }
//   }
// };
// let flatData = {
//   'name': 'required',
//   'bio.age': 'min:18',
//   'bio.education.primary': 'string',
//   'bio.education.secondary': 'string'
// };

// conditional rules
// let data = {
//   age: 30,
//   name: ''
// };
// let rules = {
//   age: ['required', { in: [29, 30] }],
//   name: [{ required_if: ['age', 30] }]
// };
let validator = new ValidationConstructor(data, rules, message);

function validateInputs() {
  validator.createValidationRule(
    'telephone',
    function (value: string) {
      return value.match(/^\d{3}-\d{3}-\d{4}$/);
    },
    'The :attribute phone number is not in the format XXX-XXX-XXXX.'
  );
  validator.getAllErrorMessages('en');
  console.log(validator.getAllErrorMessages('en'));
  // validator.overrideDefaultMessage('required', 'Whoops, :attribute field is required.');
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
