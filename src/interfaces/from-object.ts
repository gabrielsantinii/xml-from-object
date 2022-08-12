export interface FromObject {
  fromObject(params: FromObject.Params): string;
}

export namespace FromObject {
  export type Params = {
    schema: Schema;
  };
  export type Schema = {
    [k: string]: FieldValue;
  };
  export type FieldValue = {
    value: string | string[] | boolean | number | FromObject.Schema | FromObject.Schema[];
    options?: FieldOptions;
  };
  export type FieldOptions = {
    cdata: boolean;
  };
}
