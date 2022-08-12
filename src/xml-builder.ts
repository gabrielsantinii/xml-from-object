export interface XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string;
}

export namespace XmlBuilder {
  export namespace FromObject {
    export type Params = {
      schema: Schema;
    };
    export type Schema = {
      [k: string]:
        | string
        | string[]
        | XmlBuilder.FromObject.Schema
        | XmlBuilder.FromObject.Schema[];
    };
  }
}
