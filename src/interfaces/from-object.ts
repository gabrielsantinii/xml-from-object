export interface FromObject {
  fromObject(params: FromObject.Params): string;
}

export namespace FromObject {
  export type Params = {
    schema: Schema;
    header?: Header;
  };
  export type Schema = {
    [k: string]: FieldValue;
  };
  export type Header = {
    version: string;
    encoding: string;
  };
  export type FieldValue = {
    value: string | string[] | boolean | number | null | undefined | FromObject.Schema | FromObject.Schema[];
    options?: FieldOptions;
  };
  export type FieldOptions = {
    cdata: boolean;
  };
}
