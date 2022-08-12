import { removeAllSpacesFromString } from "@/tests/helpers";
import { FromObjectXmlBuilder } from "@/index";
import { FromObject } from "@/interfaces";

const makeSut = () => {
  const sut = new FromObjectXmlBuilder();
  return { sut };
};

describe("FromObjectXmlBuilder", () => {
  describe("Plain object", () => {
    it("Should transform the string key-value into xml tag", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: "anyValue" } };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey>");
    });
    it("Should transform the number key-value into xml tag", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: 1 } };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>1</anyKey>");
    });
    it("Should transform the boolean key-value into xml tag", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: true } };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>true</anyKey>");
    });
    it("Should transform the keys-value into xml tags", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = {
        anyKey: { value: "anyValue" },
        anyOtherKey: { value: "anyOtherValue" },
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey><anyOtherKey>anyOtherValue</anyOtherKey>");
    });
    it("Should transform the null and undefined keys-value into xml self-closing tags", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = {
        anyKey: { value: "anyValue" },
        anyNullKey: { value: null },
        anyUndefinedKey: { value: undefined },
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey>anyValue</anyKey><anyNullKey/><anyUndefinedKey/>");
    });
    describe("With array", () => {
      it("Should transform an array of string into string", () => {
        const { sut } = makeSut();
        const schema: FromObject.Schema = {
          anyKey: { value: "anyValue" },
          anyArrayKey: { value: ["anyValueInArray1", "anyValueInArray2"] },
        };
        const result = sut.fromObject({ schema });
        expect(result).toBe("<anyKey>anyValue</anyKey><anyArrayKey>anyValueInArray1,anyValueInArray2</anyArrayKey>");
      });
      it("Should transform an array of object into nested keys", () => {
        const { sut } = makeSut();
        const schema: FromObject.Schema = {
          anyKey: { value: "anyValue" },
          anyArrayKey: {
            value: [{ anyKeyInArray: { value: "anyValueInArray1" } }, { anyKeyInArray: { value: "anyValueInArray2" } }],
          },
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
    describe("With cdata", () => {
      describe("Wrapping string", () => {
        it("Should wrap the value with cdata the fields flagged to use cdata", () => {
          const { sut } = makeSut();
          const schema: FromObject.Schema = {
            anyKey: { value: "anyValue" },
            anyKeyWithCdata: { options: { cdata: true }, value: "anyValue" },
          };
          const result = sut.fromObject({ schema });
          const expectedXml = removeAllSpacesFromString(`
          <anyKey>
            anyValue
          </anyKey>
          <anyKeyWithCdata>
          <![CDATA[anyValue]]>
          </anyKeyWithCdata>
          `);
          expect(result).toBe(expectedXml);
        });
        it("Should wrap the value with cdata the fields flagged to use cdata even if they are empty", () => {
          const { sut } = makeSut();
          const schema: FromObject.Schema = {
            anyKey: { value: "anyValue" },
            anyKeyWithCdata: { options: { cdata: true }, value: "" },
          };
          const result = sut.fromObject({ schema });
          const expectedXml = removeAllSpacesFromString(`
          <anyKey>
            anyValue
          </anyKey>
          <anyKeyWithCdata>
          <![CDATA[]]>
          </anyKeyWithCdata>
          `);
          expect(result).toBe(expectedXml);
        });
      });
      describe("Wrapping object", () => {
        it("Should wrap the object value with cdata", () => {
          const { sut } = makeSut();
          const schema: FromObject.Schema = {
            anyKey: { value: "anyValue" },
            anyKeyWithCdata: {
              options: { cdata: true },
              value: {
                anyNestedKeyInsideCdata: {
                  value: { anyNestedOfNestedKeyInsideCdata: { value: "valueInsideNestedOfNestedInCdata" } },
                },
              },
            },
          };
          const result = sut.fromObject({ schema });
          const expectedXml = removeAllSpacesFromString(`
          <anyKey>
            anyValue
          </anyKey>
          <anyKeyWithCdata>
            <![CDATA[
              <anyNestedKeyInsideCdata>
                <anyNestedOfNestedKeyInsideCdata>
                  valueInsideNestedOfNestedInCdata
                </anyNestedOfNestedKeyInsideCdata>
              </anyNestedKeyInsideCdata>
            ]]>
          </anyKeyWithCdata>
          `);
          expect(result).toBe(expectedXml);
        });
      });
      describe("Wrapping array of strings", () => {
        it("Should wrap the array of string with cdata", () => {
          const { sut } = makeSut();
          const schema: FromObject.Schema = {
            anyKey: { value: "anyValue" },
            anyKeyWithCdata: {
              options: { cdata: true },
              value: ["anyValueInsideArray1", "anyValueInsideArray2"],
            },
          };
          const result = sut.fromObject({ schema });
          const expectedXml = removeAllSpacesFromString(`
          <anyKey>
            anyValue
          </anyKey>
          <anyKeyWithCdata>
            <![CDATA[
              anyValueInsideArray1,anyValueInsideArray2
            ]]>
          </anyKeyWithCdata>
          `);
          expect(result).toBe(expectedXml);
        });
      });
      describe("Wrapping array of objects", () => {
        it("should wrap the nestedKeys of transformedArray with cdata", () => {
          const { sut } = makeSut();
          const schema: FromObject.Schema = {
            anyKey: { value: "anyValue" },
            anyArrayKey: {
              options: { cdata: true },
              value: [
                { anyKeyInArray: { value: "anyValueInArray1" } },
                { anyKeyInArray: { value: "anyValueInArray2" } },
              ],
            },
          };
          const result = sut.fromObject({ schema });
          const expectedXml = removeAllSpacesFromString(`
        <anyKey>
          anyValue
        </anyKey>
        <anyArrayKey>
          <![CDATA[
            <anyKeyInArray>
              anyValueInArray1
            </anyKeyInArray>
            <anyKeyInArray>
              anyValueInArray2
            </anyKeyInArray>
          ]]>
        </anyArrayKey>
        `);
          expect(result).toBe(expectedXml);
        });
      });
    });
  });
  describe("Nested object", () => {
    it("should create nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = {
        anyKey: { value: { anyNestedKey: { value: "anyNestedValue" } } },
      };
      const result = sut.fromObject({ schema });
      expect(result).toBe("<anyKey><anyNestedKey>anyNestedValue</anyNestedKey></anyKey>");
    });
    it("should create nested of nested tags according to the given object", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = {
        anyKey: {
          value: {
            anyNestedKey: { value: { anyNestedOfNestedKey: { value: "anyNestedOfNestedValue" } } },
            anySecondNestedKey: { value: "anySecondNestedValue" },
          },
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
        const schema: FromObject.Schema = {
          anyKey: {
            value: {
              anyNestedKey: {
                value: {
                  anyNestedOfNestedKey: { value: "anyNestedOfNestedValue" },
                  anyArrayAsSecondNestedOfNestedKey: { value: ["anyValueInArray1", "anyValueInArray2"] },
                },
              },
              anySecondNestedKey: { value: "anySecondNestedValue" },
            },
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
        const schema: FromObject.Schema = {
          anyKey: {
            value: {
              anyNestedKey: {
                value: {
                  anyNestedOfNestedKey: { value: "anyNestedOfNestedValue" },
                  anyArrayAsSecondNestedOfNestedKey: {
                    value: [
                      { anyKeyInArray: { value: "anyValueInObjectInsideArray" } },
                      {
                        anySecondKeyInArray: {
                          value: {
                            anyNestedKeyInsideSecondKeyInArray: { value: "anyValueInsideNestedKeyOfSecondKeyInArray" },
                          },
                        },
                      },
                    ],
                  },
                },
              },
              anySecondNestedKey: { value: "anySecondNestedValue" },
            },
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
  describe("Header", () => {
    it("should set the version and encoding correctly", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: "anyValue" } };
      const header: FromObject.Header = { version: "1.0", encoding: "UTF-8" };
      const result = sut.fromObject({ schema, header });
      expect(result).toBe(`<?xml version="1.0" encoding="UTF-8"?><anyKey>anyValue</anyKey>`);
    });

    it("should not add header if the params has no header", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: "anyValue" } };
      const result = sut.fromObject({ schema });
      expect(result).toBe(`<anyKey>anyValue</anyKey>`);
    });

    it("should add custom header correctly", () => {
      const { sut } = makeSut();
      const schema: FromObject.Schema = { anyKey: { value: "anyValue" } };
      const header: FromObject.Header = { custom: "<myHeader>" };
      const result = sut.fromObject({ schema, header });
      expect(result).toBe(`<myHeader><anyKey>anyValue</anyKey>`);
    });
  });
});
