import { FromObject } from "@/interfaces";

export namespace FromObjectTypes {
  export type InternalValue =
    | ArrayOfStringValueType
    | StringValueType
    | ArrayOfObjectsType
    | ObjectType
    | SelfClosingTyope;

  type ArrayOfStringValueType = {
    value: string[];
    type: "array-of-string";
  };

  type StringValueType = {
    value: string;
    type: "string";
  };

  type ArrayOfObjectsType = {
    value: FromObject.Schema[];
    type: "array-of-object";
  };

  type ObjectType = {
    value: FromObject.Schema;
    type: "object";
  };

  type SelfClosingTyope = {
    value: undefined;
    type: "self-closing";
  };
}
