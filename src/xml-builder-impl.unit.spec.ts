import { removeAllSpacesFromString } from "@/tests/helpers";

type FromObjectSchema = {
  [k: string]: string | FromObjectSchema;
};

interface XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string;
}

namespace XmlBuilder {
  export namespace FromObject {
    export type Params = {
      schema: FromObjectSchema;
    };
  }
}

class XmlBuilderImpl implements XmlBuilder {
  fromObject(params: XmlBuilder.FromObject.Params): string {
    return this.parseSchemaToXml(params.schema);
  }

  private parseSchemaToXml(schema: FromObjectSchema): string {
    const resultInArray = Object.entries(schema).map(([key, value]) => {
      if (typeof value === "object") {
        const nestedValue = this.parseSchemaToXml(value);
        return this.keyValueToXmlTag(key, nestedValue);
      }
      return this.keyValueToXmlTag(key, value);
    });
    return resultInArray.join("");
  }

  private keyValueToXmlTag(key: string, value: string): string {
    return `<${key}>${value}</${key}>`;
  }
}

const makeSut = () => {
  const sut = new XmlBuilderImpl();
  return { sut };
};

describe("XmlBuilderImpl", () => {
  describe("Plain object", () => {
    it("should transform the key into xml tag", () => {
      const { sut } = makeSut();
      const schema: FromObjectSchema = { anyKey: "anyValue" };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey>");
    });

    it("should transform the keys into xml tags", () => {
      const { sut } = makeSut();
      const schema: FromObjectSchema = {
        anyKey: "anyValue",
        anyOtherKey: "anyOtherValue",
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe(
        "<anyKey>anyValue</anyKey><anyOtherKey>anyOtherValue</anyOtherKey>"
      );
    });
  });
  describe("Nested object", () => {
    it("should create nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: FromObjectSchema = {
        anyKey: { anyNestedKey: "anyNestedValue" },
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe(
        "<anyKey><anyNestedKey>anyNestedValue</anyNestedKey></anyKey>"
      );
    });

    it("should create nested of nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: FromObjectSchema = {
        anyKey: {
          anyNestedKey: { anyNestedOfNestedKey: "anyNestedOfNestedValue" },
          anySecondNestedKey: "anySecondNestedValue",
        },
      };
      const result = sut.fromObject({ schema });
      const expectedXml = removeAllSpacesFromString(`<anyKey>
      <anyNestedKey>
        <anyNestedOfNestedKey>
          anyNestedOfNestedValue
        </anyNestedOfNestedKey>
        </anyNestedKey>
      <anySecondNestedKey>
        anySecondNestedValue
      </anySecondNestedKey>
    </anyKey>
     `);
      expect(result).toBe(expectedXml);
    });
  });
});
