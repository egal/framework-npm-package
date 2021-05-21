export interface ActionParameters {
  filter?: (string | object)[];
  attributes?: (string | number | object)[] | undefined;
  email?: string;
  password?: string;
  service_name?: string | undefined;
  model_name?: string | undefined;
  model_id?: number | undefined;
  event_name?: string | undefined;
  token?: string | object;
  toObject?(): object | null;
}
