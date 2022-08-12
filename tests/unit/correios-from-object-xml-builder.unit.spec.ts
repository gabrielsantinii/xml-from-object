const correiosObject = {
  sender: {
    identifier: "0000000000",
    email: "email@gmail.com",
    name: "Fulano",
    phone: "+5531986532008",
    address: {
      street: "streetTestWithSoManyCharactersTesting",
      number: "6586589",
      postalCode: "13140000",
      city: "São Bernardo São Bernardo",
      complements: "Casa03WithLengthBiggerThanMax",
      neighborhood: "BairroBairroBairroBairro",
      state: "SP",
    },
  },
  packages: [
    {
      trackingCode: "OU123344554BR",
      serviceCode: "ne-correios-pac",
      price: 10,
      receiver: {
        name: "TesteDeNomeCom50CaracteresAbcdefghijklmnopqrstuvwxyz",
        identifier: "00000000000",
        email: "receiver@email.com",
        phone: "+5531988888888",
        address: {
          street: "streetTest",
          number: "1001",
          postalCode: "960817888",
          city: "São Paulo",
          complements: "casaB",
          neighborhood: "BairroDeTeste",
          state: "SP",
        },
      },
      item: {
        weight: 30,
        width: 10,
        height: 10,
        depth: 10,
      },
    },
  ],
  additionalServices: {
    insurance: true,
    deliveryNotice: false,
    selectPackageReceiver: false,
  },
};

describe("Correios", () => {
  it.todo("should build the exact same xml of old implementation");
});
