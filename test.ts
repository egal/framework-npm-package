// @ts-ignore
import { ValidationConstructor } from './compile/src/Constructors/ValidationConstructor.js';
console.log('test');

function validateInputs() {
  const email = 'fhdjsk fhdsjkfh';
  const password = undefined;
  const date = 'bhhkjj';
  let input = {
    name: '663465',
    date: undefined
  };
  let rules = {
    name: 'alpha',
    date: 'required'
  };
  let message = { alpha: 'You forgot to give a :attribute' };
  let validator = new ValidationConstructor(input, rules, message);
  validator
    .validate()
    // @ts-ignore
    .then((data) => {
      console.log(data, 'data');
    })
    // @ts-ignore
    .catch((error) => {
      console.log(error);
    });
}

function custom() {
  let validator = new ValidationConstructor();
  let tel = 'uyuirwy';
  validator
    .validateCustom(
      'telephone',
      function (tel: string, requirement: any, attribute: any) {
        // requirement parameter defaults to null
        console.log(tel, 'value');
        return tel.match(/^\d{3}-\d{3}-\d{4}$/);
      },
      'The :attribute phone number is not in the format XXX-XXX-XXXX.'
    )
    .then((data: any) => {
      console.log(data);
    });
}

validateInputs();
custom();
