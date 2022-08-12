import { FromObject } from "@/interfaces";

export namespace FromObjectTypes {
  export type InternalValue = ArrayOfStringValueType | StringValueType | ArrayOfObjectsType | Object;

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
    type: "array-of-objects";
  };

  type Object = {
    value: FromObject.Schema;
    type: "object";
  };
}
