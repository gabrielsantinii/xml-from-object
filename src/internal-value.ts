import { XmlBuilder } from "./xml-builder";

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
  value: XmlBuilder.FromObject.Schema[];
  type: "array-of-objects";
};

type Object = {
  value: XmlBuilder.FromObject.Schema;
  type: "object";
};
