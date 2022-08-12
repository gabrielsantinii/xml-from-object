import { removeAllSpacesFromString } from "@/tests/helpers";
import { XmlBuilder, XmlBuilderImpl } from ".";

const makeSut = () => {
  const sut = new XmlBuilderImpl();
  return { sut };
};

describe("XmlBuilderImpl", () => {
  describe("Plain object", () => {
    it("should transform the key into xml tag", () => {
      const { sut } = makeSut();
      const schema: XmlBuilder.FromObject.Schema = { anyKey: "anyValue" };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey>");
    });
    it("should transform the keys into xml tags", () => {
      const { sut } = makeSut();
      const schema: XmlBuilder.FromObject.Schema = {
        anyKey: "anyValue",
        anyOtherKey: "anyOtherValue",
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey><anyOtherKey>anyOtherValue</anyOtherKey>");
    });
    describe("With array", () => {
      it("should transform an array of string into string", () => {
        const { sut } = makeSut();
        const schema: XmlBuilder.FromObject.Schema = {
          anyKey: "anyValue",
          anyArrayKey: ["anyValueInArray1", "anyValueInArray2"],
        };
        const result = sut.fromObject({ schema });
        expect(result).toBe("<anyKey>anyValue</anyKey><anyArrayKey>anyValueInArray1,anyValueInArray2</anyArrayKey>");
      });
      it("should transform an array of object into nested keys", () => {
        const { sut } = makeSut();
        const schema: XmlBuilder.FromObject.Schema = {
          anyKey: "anyValue",
          anyArrayKey: [{ anyKeyInArray: "anyValueInArray1" }, { anyKeyInArray: "anyValueInArray2" }],
        };
        const result = sut.fromObject({ schema });
        const expectedXml = removeAllSpacesFromString(`
        <anyKey>
          anyValue
        </anyKey>
        <anyArrayKey>
          <anyKeyInArray>
            anyValueInArray1
          </anyKeyInArray>
          <anyKeyInArray>
            anyValueInArray2
          </anyKeyInArray>
        </anyArrayKey>
        `);
        expect(result).toBe(expectedXml);
      });
    });
  });
  describe("Nested object", () => {
    it("should create nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: XmlBuilder.FromObject.Schema = {
        anyKey: { anyNestedKey: "anyNestedValue" },
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey><anyNestedKey>anyNestedValue</anyNestedKey></anyKey>");
    });
    it("should create nested of nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: XmlBuilder.FromObject.Schema = {
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
    describe("With array", () => {
      it("should transform an array of string into string", () => {
        const { sut } = makeSut();
        const schema: XmlBuilder.FromObject.Schema = {
          anyKey: {
            anyNestedKey: {
              anyNestedOfNestedKey: "anyNestedOfNestedValue",
              anyArrayAsSecondNestedOfNestedKey: ["anyValueInArray1", "anyValueInArray2"],
            },
            anySecondNestedKey: "anySecondNestedValue",
          },
        };
        const result = sut.fromObject({ schema });
        const expectedXml = removeAllSpacesFromString(`<anyKey>
      <anyNestedKey>
        <anyNestedOfNestedKey>
          anyNestedOfNestedValue
        </anyNestedOfNestedKey>
        <anyArrayAsSecondNestedOfNestedKey>
          anyValueInArray1,anyValueInArray2
        </anyArrayAsSecondNestedOfNestedKey>
        </anyNestedKey>
      <anySecondNestedKey>
        anySecondNestedValue
      </anySecondNestedKey>
    </anyKey>
     `);
        expect(result).toBe(expectedXml);
      });
      it("should transform an array of object into nested keys", () => {
        const { sut } = makeSut();
        const schema: XmlBuilder.FromObject.Schema = {
          anyKey: {
            anyNestedKey: {
              anyNestedOfNestedKey: "anyNestedOfNestedValue",
              anyArrayAsSecondNestedOfNestedKey: [
                { anyKeyInArray: "anyValueInObjectInsideArray" },
                {
                  anySecondKeyInArray: {
                    anyNestedKeyInsideSecondKeyInArray: "anyValueInsideNestedKeyOfSecondKeyInArray",
                  },
                },
              ],
            },
            anySecondNestedKey: "anySecondNestedValue",
          },
        };
        const result = sut.fromObject({ schema });
        const expectedXml = removeAllSpacesFromString(`<anyKey>
      <anyNestedKey>
        <anyNestedOfNestedKey>
          anyNestedOfNestedValue
        </anyNestedOfNestedKey>
        <anyArrayAsSecondNestedOfNestedKey>
          <anyKeyInArray>
            anyValueInObjectInsideArray
          </anyKeyInArray>
          <anySecondKeyInArray>
            <anyNestedKeyInsideSecondKeyInArray>
              anyValueInsideNestedKeyOfSecondKeyInArray
            </anyNestedKeyInsideSecondKeyInArray>
          </anySecondKeyInArray>
        </anyArrayAsSecondNestedOfNestedKey>
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
});
