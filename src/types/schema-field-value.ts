import { FromObjectSchema } from "./from-object-schema";
import { SchemaFieldAttributes } from "./schema-field-attributes";
import { SchemaFieldOptions } from "./schema-field-options";

export type SchemaFieldValue = {
  value: string | string[] | boolean | number | null | undefined | FromObjectSchema | FromObjectSchema[];
  options?: SchemaFieldOptions;
  attributes?: SchemaFieldAttributes
};
