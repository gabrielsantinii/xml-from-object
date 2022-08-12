import { FromObject } from "@/interfaces";
import { isArrayOfObject, isArrayOfString } from "@/helpers";
import { FromObjectTypes } from "@/types";

export class FromObjectXmlBuilder implements FromObject {
  fromObject(params: FromObject.Params): string {
    if (!params.header) return this.parseSchemaToXml(params.schema);
    const parsedHeader = this.parseXmlHeader(params.header);
    const parsedSchema = this.parseSchemaToXml(params.schema);
    return parsedHeader + parsedSchema;
  }

  private parseXmlHeader(header: FromObject.Header): string {
    if ("custom" in header) return header.custom;
    return `<?xml version="${header.version}" encoding="${header.encoding}"?>`;
  }

  private parseSchemaToXml(schema: FromObject.Schema): string {
    const resultInArray = Object.entries(schema).map(([key, { value: untypedValue, options: fieldOptions }]) => {
      const { value, type } = this.getValueType(untypedValue);
      switch (type) {
        case "array-of-object":
          return this.parseTagForArrayOfObjects(key, value, fieldOptions);
        case "array-of-string":
          return this.parseTagForArrayOfString(key, value, fieldOptions);
        case "object":
          return this.parseTagForObject(key, value, fieldOptions);
        case "string":
          return this.parseTagForString(key, value, fieldOptions);
        case "self-closing":
          return this.parseSelfClosingTag(key);
        default:
          throw new Error(`value type ${type} not implemented`);
      }
    });
    return resultInArray.join("");
  }

  private getValueType(value: any): FromObjectTypes.InternalValue {
    if (value === undefined || value === null) return { type: "self-closing", value: undefined };
    if (isArrayOfObject(value)) return { type: "array-of-object", value: value as FromObject.Schema[] };
    if (isArrayOfString(value)) return { type: "array-of-string", value: value as string[] };
    if (typeof value === "object") return { type: "object", value: value as FromObject.Schema };
    if (["string", "boolean", "number"].includes(typeof value)) return { type: "string", value: String(value) };
    throw new Error("unexpected value type");
  }

  private parseTagForArrayOfObjects(
    key: string,
    values: FromObject.Schema[],
    options?: FromObject.FieldOptions
  ): string {
    const nestedTagsAsArrayOfString = values.map((value) => this.parseSchemaToXml(value));
    const nestedTags = nestedTagsAsArrayOfString.join("");
    return this.keyValueToXmlTag(key, nestedTags, options);
  }

  private parseTagForArrayOfString(key: string, value: string[], options?: FromObject.FieldOptions): string {
    return this.keyValueToXmlTag(key, value.join(), options);
  }

  private parseTagForObject(key: string, value: FromObject.Schema, options?: FromObject.FieldOptions): string {
    const nestedValue = this.parseSchemaToXml(value);
    return this.keyValueToXmlTag(key, nestedValue, options);
  }

  private parseTagForString(key: string, value: string, options?: FromObject.FieldOptions): string {
    return this.keyValueToXmlTag(key, value, options);
  }

  private parseSelfClosingTag(key: string): string {
    return `<${key}/>`;
  }

  private keyValueToXmlTag(key: string, value: string, options?: FromObject.FieldOptions): string {
    return options?.cdata ? `<${key}><![CDATA[${value}]]></${key}>` : `<${key}>${value}</${key}>`;
  }
}
