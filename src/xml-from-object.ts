import { isArrayOfObject, isArrayOfString } from "./helpers";
import {
  FromObjectHeader,
  SchemaFieldConfig,
  FromObjectInternalValue,
  FromObjectParams,
  FromObjectSchema,
  SchemaFieldOptions,
  SchemaFieldAttributes,
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
  const resultInArray = Object.entries(schema).map(([key, { value: untypedValue, ...fieldConfig }]) => {
    const { value, type } = getValueType(untypedValue);
    switch (type) {
      case "array-of-object":
        return parseTagForArrayOfObjects(key, value, fieldConfig);
      case "array-of-string":
        return parseTagForArrayOfString(key, value, fieldConfig);
      case "object":
        return parseTagForObject(key, value, fieldConfig);
      case "string":
        return parseTagForString(key, value, fieldConfig);
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

function parseTagForArrayOfObjects(key: string, values: FromObjectSchema[], config: SchemaFieldConfig): string {
  const nestedTagsAsArrayOfString = values.map(parseSchemaToXml);
  const nestedTags = nestedTagsAsArrayOfString.join("");
  return keyValueToXmlTag(key, nestedTags, config);
}

function parseTagForArrayOfString(key: string, value: string[], config: SchemaFieldConfig): string {
  return keyValueToXmlTag(key, value.join(), config);
}

function parseTagForObject(key: string, value: FromObjectSchema, config: SchemaFieldConfig): string {
  const nestedValue = parseSchemaToXml(value);
  return keyValueToXmlTag(key, nestedValue, config);
}

function parseTagForString(key: string, value: string, config: SchemaFieldConfig): string {
  return keyValueToXmlTag(key, value, config);
}

function parseSelfClosingTag(key: string): string {
  return `<${key}/>`;
}

function keyValueToXmlTag(key: string, value: string, config: SchemaFieldConfig): string {
  const parsedKey = parseKey(key, config);
  const parsedValue = parseValue(value, config);
  return parsedKey.start + parsedValue + parsedKey.end;
}

function parseValue(value: string, config: SchemaFieldConfig): string {
  if (config.options?.cdata) return wrapWithCdata(value);
  return value;
}

function wrapWithCdata(value: string): string {
  return `<![CDATA[${value}]]>`;
}

function parseKey(key: string, config: SchemaFieldConfig): { start: string; end: string } {
  const start = parseStartOfKey(key, config);
  const end = `</${key}>`;
  return { start, end };
}

function parseStartOfKey(key: string, config: SchemaFieldConfig): string {
  if (!config.attributes) return `<${key}>`;
  return `<${key} ${parseKeyAttributes(config.attributes)}>`;
}

function parseKeyAttributes(attributes: SchemaFieldAttributes): string {
  const attributesInArray = Object.entries(attributes).map(([key, value]) => {
    return parseAttribute(key, value);
  });
  return attributesInArray.join(" ");
}

function parseAttribute(key: string, value: string): string {
  return `${key}="${value}"`;
}
