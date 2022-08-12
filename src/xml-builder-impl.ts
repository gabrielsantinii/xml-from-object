import { XmlBuilder } from ".";
import { isArrayOfString } from "@/helpers";

export class XmlBuilderImpl implements XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string {
    return this.parseSchemaToXml(params.schema);
  }

  private parseSchemaToXml(schema: XmlBuilder.FromObject.Schema): string {
    const resultInArray = Object.entries(schema).map(([key, value]) => {
      if (isArrayOfString(value)) {
        return this.keyValueToXmlTag(key, this.parseArrayOfString(value));
      }
      if (typeof value === "object") {
        const valueAsObject = value as XmlBuilder.FromObject.Schema;
        const nestedValue = this.parseSchemaToXml(valueAsObject);
        return this.keyValueToXmlTag(key, nestedValue);
      }
      return this.keyValueToXmlTag(key, value);
    });
    return resultInArray.join("");
  }

  private keyValueToXmlTag(key: string, value: string): string {
    return `<${key}>${value}</${key}>`;
  }

  private parseArrayOfString(value: any): string {
    if (!Array.isArray(value)) {
      throw new Error("unexpected value in parseArrayOfString");
    }
    return value.join();
  }
}
