import { SchemaFieldConfig } from "./schema-field-config";

export type SchemaOf<ObjectType extends object> = {
  [Key in keyof ObjectType]: SchemaFieldConfig & {
    value: ObjectType[Key] extends Array<string>
      ? ObjectType[Key]
      : ObjectType[Key] extends Array<object>
      ? SchemaOf<ObjectType[Key][number]>[]
      : ObjectType[Key] extends object
      ? SchemaOf<ObjectType[Key]>
      : ObjectType[Key];
  };
};
