interface XmlBuilder {
  fromObject(object: object): string;
}

class XmlBuilderImpl implements XmlBuilder {
  fromObject(schema: Record<string, string>): string {
    const resultInArray = Object.entries(schema).map(([key, value]) => {
      return `<${key}>${value}</${key}>`;
    });
    return resultInArray.join('');
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
      const schema = { anyKey: "anyValue" };
      const result = sut.fromObject(schema);
      expect(result).toBe("<anyKey>anyValue</anyKey>");
    });

    it("should transform the keys into xml tags", () => {
      const { sut } = makeSut();
      const schema = { anyKey: "anyValue", anyOtherKey: "anyOtherValue" };
      const result = sut.fromObject(schema);
      expect(result).toBe(
        "<anyKey>anyValue</anyKey><anyOtherKey>anyOtherValue</anyOtherKey>"
      );
    });
  });
});
