import { FromObjectSchema } from "./from-object-schema";

export type FromObjectInternalValue =
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
  value: FromObjectSchema[];
  type: "array-of-object";
};

type ObjectType = {
  value: FromObjectSchema;
  type: "object";
};

type SelfClosingTyope = {
  value: undefined;
  type: "self-closing";
};
