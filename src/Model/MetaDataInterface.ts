export interface MetaDataInterface {
  model_class: string;
  model_short_name: string;
  database_fields: string[];
  fields_with_types: object[];
  fake_fields: object[];
  relations: string[];
  validation_rules: object;
  primary_keys: string[];
  actions_metadata: object;
  push(data: string | object): void;
}
