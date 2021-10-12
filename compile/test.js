"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const ValidationConstructor_js_1 = require("./compile/src/Constructors/ValidationConstructor.js");
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
    let validator = new ValidationConstructor_js_1.ValidationConstructor(input, rules, message);
    validator
        .validate()
        // @ts-ignore
        .then((data) => {
        console.log(data, 'data');
    })
        // @ts-ignore
        .catch((error) => {
        console.log(error, 'error from test');
    });
}
function custom() {
    let validator = new ValidationConstructor_js_1.ValidationConstructor();
    let tel = 'uyuirwy';
    validator
        .validateCustom('telephone', function (tel, requirement, attribute) {
        // requirement parameter defaults to null
        console.log(tel, 'value');
        return tel.match(/^\d{3}-\d{3}-\d{4}$/);
    }, 'The :attribute phone number is not in the format XXX-XXX-XXXX.')
        .then((data) => {
        console.log(data, 'data from custom');
    });
}
validateInputs();
custom();
