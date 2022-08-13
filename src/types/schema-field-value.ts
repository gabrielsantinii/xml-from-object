import { FromObjectSchema } from "./from-object-schema";
import { SchemaFieldOptions } from "./schema-field-options";

export type SchemaFieldValue = {
  value: string | string[] | boolean | number | null | undefined | FromObjectSchema | FromObjectSchema[];
  options?: SchemaFieldOptions;
};
