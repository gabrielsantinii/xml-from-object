import { XmlBuilder } from ".";
import { isArrayOfObjects, isArrayOfString } from "@/helpers";

export class XmlBuilderImpl implements XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string {
    return this.parseSchemaToXml(params.schema);
  }

  private parseSchemaToXml(schema: XmlBuilder.FromObject.Schema): string {
    const resultInArray = Object.entries(schema).map(([key, value]) => {
      const valueType = this.getValueType(value);
      switch (valueType) {
        case "array-of-objects":
          return this.parseTagForArrayOfObjects(key, value as XmlBuilder.FromObject.Schema[]);
        case "array-of-string":
          return this.parseTagForArrayOfString(key, value as string[]);
        case "object":
          return this.parseTagForObject(key, value as XmlBuilder.FromObject.Schema);
        case "string":
          return this.parseTagForString(key, value as string);
        default:
          throw new Error(`value type ${valueType} not implemented`);
      }
    });
    return resultInArray.join("");
  }

  private getValueType(value: any): "string" | "array-of-string" | "array-of-objects" | "object" {
    if (isArrayOfObjects(value)) return "array-of-objects";
    if (isArrayOfString(value)) return "array-of-string";
    if (typeof value === "object") return "object";
    if (typeof value === "string") return "string";
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
