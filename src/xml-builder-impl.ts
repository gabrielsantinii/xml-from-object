import { XmlBuilder } from ".";
import { isArrayOfObjects, isArrayOfString } from "@/helpers";
import { InternalValue } from "./internal-value";

export class XmlBuilderImpl implements XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string {
    return this.parseSchemaToXml(params.schema);
  }

  private parseSchemaToXml(schema: XmlBuilder.FromObject.Schema): string {
    const resultInArray = Object.entries(schema).map(([key, untypedValue]) => {
      const { value, type } = this.getValueType(untypedValue);
      switch (type) {
        case "array-of-objects":
          return this.parseTagForArrayOfObjects(key, value);
        case "array-of-string":
          return this.parseTagForArrayOfString(key, value);
        case "object":
          return this.parseTagForObject(key, value);
        case "string":
          return this.parseTagForString(key, value);
        default:
          throw new Error(`value type ${type} not implemented`);
      }
    });
    return resultInArray.join("");
  }

  private getValueType(value: any): InternalValue {
    if (isArrayOfObjects(value)) return { type: "array-of-objects", value: value as XmlBuilder.FromObject.Schema[] };
    if (isArrayOfString(value)) return { type: "array-of-string", value: value as string[] };
    if (typeof value === "object") return { type: "object", value: value as XmlBuilder.FromObject.Schema };
    if (typeof value === "string") return { type: "string", value: value as string };
    throw new Error("unexpected value type");
  }

  private parseTagForArrayOfObjects(key: string, values: XmlBuilder.FromObject.Schema[]): string {
    const nestedTagsAsArrayOfString = values.map((value) => this.parseSchemaToXml(value));
    const nestedTags = nestedTagsAsArrayOfString.join("");
    return this.keyValueToXmlTag(key, nestedTags);
  }

  private parseTagForArrayOfString(key: string, value: string[]): string {
    return this.keyValueToXmlTag(key, value.join());
  }

  private parseTagForObject(key: string, value: XmlBuilder.FromObject.Schema): string {
    const nestedValue = this.parseSchemaToXml(value);
    return this.keyValueToXmlTag(key, nestedValue);
  }

  private parseTagForString(key: string, value: string): string {
    return this.keyValueToXmlTag(key, value);
  }

  private keyValueToXmlTag(key: string, value: string): string {
    return `<${key}>${value}</${key}>`;
  }
}
