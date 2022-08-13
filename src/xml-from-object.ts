import { isArrayOfObject, isArrayOfString } from "./helpers";
import {
  FromObjectHeader,
  FromObjectInternalValue,
  FromObjectParams,
  FromObjectSchema,
  SchemaFieldOptions,
} from "./types";

/**
 * Class way to transform a Javascript plain object into XML
 */
export class XmlFromObject {
  /**
     * Transform a Javascript plain object into XML
     * @param {object} schemaConfig.schema - The typed schema with fields and configs to create the XML.
     * @param {object} [schemaConfig.header] - (Optional) The xml header (typically "<?xml version...>").
     *
   */
  fromObject = xmlFromObject;
}

/**
 * Functional way to transform a Javascript plain object into XML
 * @param {object} schemaConfig.schema - The typed schema with fields and configs to create the XML.
 * @param {object} [schemaConfig.header] - (Optional) The xml header (typically "<?xml version...>").
 */
export function xmlFromObject(schemaConfig: FromObjectParams): string {
  if (!schemaConfig.header) return parseSchemaToXml(schemaConfig.schema);
  const parsedHeader = parseXmlHeader(schemaConfig.header);
  const parsedSchema = parseSchemaToXml(schemaConfig.schema);
  return parsedHeader + parsedSchema;
}

function parseXmlHeader(header: FromObjectHeader): string {
  if (header.custom !== undefined) return header.custom;
  return `<?xml version="${header.version}" encoding="${header.encoding}"?>`;
}

function parseSchemaToXml(schema: FromObjectSchema): string {
  const resultInArray = Object.entries(schema).map(([key, { value: untypedValue, options: fieldOptions }]) => {
    const { value, type } = getValueType(untypedValue);
    switch (type) {
      case "array-of-object":
        return parseTagForArrayOfObjects(key, value, fieldOptions);
      case "array-of-string":
        return parseTagForArrayOfString(key, value, fieldOptions);
      case "object":
        return parseTagForObject(key, value, fieldOptions);
      case "string":
        return parseTagForString(key, value, fieldOptions);
      case "self-closing":
        return parseSelfClosingTag(key);
      default:
        throw new Error(`value type ${type} not implemented`);
    }
  });
  return resultInArray.join("");
}

function getValueType(value: any): FromObjectInternalValue {
  if (value === undefined || value === null) return { type: "self-closing", value: undefined };
  if (isArrayOfObject(value)) return { type: "array-of-object", value: value as FromObjectSchema[] };
  if (isArrayOfString(value)) return { type: "array-of-string", value: value as string[] };
  if (typeof value === "object") return { type: "object", value: value as FromObjectSchema };
  if (["string", "boolean", "number"].includes(typeof value)) return { type: "string", value: String(value) };
  throw new Error("unexpected value type");
}

function parseTagForArrayOfObjects(key: string, values: FromObjectSchema[], options?: SchemaFieldOptions): string {
  const nestedTagsAsArrayOfString = values.map((value) => parseSchemaToXml(value));
  const nestedTags = nestedTagsAsArrayOfString.join("");
  return keyValueToXmlTag(key, nestedTags, options);
}

function parseTagForArrayOfString(key: string, value: string[], options?: SchemaFieldOptions): string {
  return keyValueToXmlTag(key, value.join(), options);
}

function parseTagForObject(key: string, value: FromObjectSchema, options?: SchemaFieldOptions): string {
  const nestedValue = parseSchemaToXml(value);
  return keyValueToXmlTag(key, nestedValue, options);
}

function parseTagForString(key: string, value: string, options?: SchemaFieldOptions): string {
  return keyValueToXmlTag(key, value, options);
}

function parseSelfClosingTag(key: string): string {
  return `<${key}/>`;
}

function keyValueToXmlTag(key: string, value: string, options?: SchemaFieldOptions): string {
  return options?.cdata ? `<${key}><![CDATA[${value}]]></${key}>` : `<${key}>${value}</${key}>`;
}
