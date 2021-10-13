export const rules = {
  accepted:
    "The field under validation must be yes, on, 1 or true. This is useful for validating 'Terms of Service' acceptance.",
  after: "The field under validation must be after the given date. Example usage: 'after:date'",
  after_or_equal:
    "The field under validation must be after or equal to the given field. Usage example: 'after_or_equal:date'",
  alpha: 'The field under validation must be entirely alphabetic characters.',
  alpha_dash:
    'The field under validation may have alpha-numeric characters, as well as dashes and underscores.',
  alpha_num: 'The field under validation must be entirely alpha-numeric characters.',
  array: 'The field under validation must be an array.',
  before: "The field under validation must be before the given date. Usage example: 'before:date'",
  before_or_equal:
    "The field under validation must be before or equal to the given date. Usage example:'before_or_equal:date'",
  between:
    "The field under validation must have a size between the given min and max. Strings, numerics, and files are evaluated in the same fashion as the size rule. Usage example: 'between:min,max'",
  boolean:
    "The field under validation must be a boolean value of the form true, false, 0, 1, 'true', 'false', 0, 1",
  confirmed:
    'The field under validation must have a matching field of foo_confirmation. For example, if the field under validation is password, a matching password_confirmation field must be present in the input.',
  date: "The field under validation must be a valid date format which is acceptable by Javascript's Date object.",
  digits:
    "The field under validation must be numeric and must have an exact length of value. Usage example: 'digits:value'",
  digits_between:
    "The field under validation must be numeric and must have length between given min and max. Usage example: 'digits_between:min,max'",
  different:
    "The given field must be different than the field under validation. Usage example: 'different:attribute'",
  email: 'The field under validation must be formatted as an e-mail address.',
  hex: 'The field under validation should be a hexadecimal format. Useful in combination with other rules, like hex|size:6 for hex color code validation.',
  in: "The field under validation must be included in the given list of values. The field can be an array or string. Usage example: ':foo,bar,...'",
  integer: 'The field under validation must have an integer value.',
  max: "Validate that an attribute is no greater than a given size. Usage example: 'max:value'",
  min: "Validate that an attribute is at least a given size. Usage example: 'min:value'",
  not_in:
    "The field under validation must not be included in the given list of values. Usage example: 'not_in:foo,bar,...'",
  numeric:
    'Validate that an attribute is numeric. The string representation of a number will pass.',
  present: 'The field under validation must be present in the input data but can be empty.',
  required: 'Checks if the length of the String representation of the value is >',
  required_if:
    "The field under validation must be present and not empty if the another field field is equal to any value. Usage example: 'required_if:another field,value'",
  required_unless:
    "The field under validation must be present and not empty unless the another field field is equal to any value. Usage example: 'required_unless:another field,value'",
  required_with:
    "The field under validation must be present and not empty only if any of the other specified fields are present. Usage example: 'required_with:foo,bar,...'",
  required_with_all:
    "The field under validation must be present and not empty only if all of the other specified fields are present. Usage example: 'required_with_all:foo,bar,...'",
  required_without:
    "The field under validation must be present and not empty only when any of the other specified fields are not present. Usage example: 'required_without:foo,bar,...'",
  required_without_all:
    "The field under validation must be present and not empty only when all of the other specified fields are not present. Usage example: 'required_without_all:foo,bar,...'",
  same: "The given field must match the field under validation. Usage example: 'same:attribute'",
  size: "The field under validation must have a size matching the given value. For string data, value corresponds to the number of characters. For numeric data, value corresponds to a given integer value. Usage example: 'size:value'",
  string: 'The field under validation must be a string.',
  url: 'Validate that an attribute has a valid URL format',
  regex:
    "The field under validation must match the given regular expression. Usage example: 'regex:pattern'"
};
