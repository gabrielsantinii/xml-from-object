import { FromObject } from "@/interfaces";
import { FromObjectXmlBuilder } from "@/index";
import { removeAllSpacesFromString } from "../helpers";

const correiosSchema: FromObject.Schema = {
  correioslog: {
    value: {
      tipo_arquivo: {
        value: "Postagem",
      },
      versao_arquivo: {
        value: "2.3",
      },
      plp: {
        value: {
          id_plp: { value: null },
          valor_global: { value: null },
          mcu_unidade_postagem: { value: null },
          nome_unidade_postagem: { value: null },
          cartao_postagem: { value: 12334555 },
        },
      },
      remetente: {
        value: {
          numero_contrato: { value: 1223 },
          numero_diretoria: { value: 10 },
          codigo_administrativo: { value: 12334 },
          nome_remetente: { value: "Fulano", options: { cdata: true } },
          logradouro_remetente: { value: "StreetTest", options: { cdata: true } },
          numero_remetente: { value: "658658", options: { cdata: true } },
          complemento_remetente: { value: "Casa03Test", options: { cdata: true } },
          bairro_remetente: { value: "BairroBairroBairro", options: { cdata: true } },
          cep_remetente: { value: "13140000", options: { cdata: true } },
          cidade_remetente: { value: "SãoBernardoSãoBernardo", options: { cdata: true } },
          uf_remetente: { value: "SP" },
          telefone_remetente: { value: "31986532008", options: { cdata: true } },
          fax_remetente: { value: "", options: { cdata: true } },
          email_remetente: { value: "email@gmail.com", options: { cdata: true } },
          celular_remetente: { value: "31986532008", options: { cdata: true } },
          cpf_cnpj_remetente: { value: "0000000000", options: { cdata: true } },
          ciencia_conteudo_proibido: { value: "S" },
        },
      },
      forma_pagamento: {
        value: null,
      },
      objeto_postal: {
        value: {
          numero_etiqueta: {
            value: "OU123344554BR",
          },
          sscc: { value: null },
          codigo_objeto_cliente: { value: null },
          codigo_servico_postagem: {
            value: "03298",
          },
          cubagem: {
            value: 0,
          },
          peso: {
            value: 30000,
          },
          rt1: { value: null },
          rt2: { value: null },
          restricao_anac: {
            value: "S",
          },
          destinatario: {
            value: {
              nome_destinatario: { value: "TesteDeNome", options: { cdata: true } },
              telefone_destinatario: { value: "31988888888", options: { cdata: true } },
              celular_destinatario: { value: "31988888888", options: { cdata: true } },
              email_destinatario: { value: "receiver@email.com", options: { cdata: true } },
              logradouro_destinatario: { value: "StreetTest", options: { cdata: true } },
              complemento_destinatario: { value: "CasaB", options: { cdata: true } },
              numero_end_destinatario: { value: "1001", options: { cdata: true } },
              cpf_cnpj_destinatario: { value: "00000000000", options: { cdata: true } },
            },
          },
          nacional: {
            value: {
              bairro_destinatario: { value: "BairroDeTeste", options: { cdata: true } },
              cidade_destinatario: { value: "SãoPaulo", options: { cdata: true } },
              uf_destinatario: { value: "SP" },
              cep_destinatario: { value: "96081788", options: { cdata: true } },
              codigo_usuario_postal: { value: null },
              centro_custo_cliente: { value: null },
              numero_nota_fiscal: { value: null },
              serie_nota_fiscal: { value: null },
              valor_nota_fiscal: { value: null },
              natureza_nota_fiscal: { value: null },
              descricao_objeto: { value: "", options: { cdata: true } },
              valor_a_cobrar: { value: 0 },
            },
          },
          servico_adicional: {
            value: [
              { codigo_servico_adicional: { value: '025' } },
              { codigo_servico_adicional: { value: '064' } },
              { valor_declarado: { value: 10 } },
            ],
          },
          dimensao_objeto: {
            value: {
              tipo_objeto: { value: "002" },
              dimensao_altura: { value: 10 },
              dimensao_largura: { value: 10 },
              dimensao_comprimento: { value: 10 },
              dimensao_diametro: { value: 0 },
            },
          },
          data_postagem_sara: { value: null },
          status_processamento: { value: 0 },
          numero_comprovante_postagem: { value: null },
          valor_cobrado: { value: null },
        },
      },
    },
  },
};

const makeSut = () => {
  const sut = new FromObjectXmlBuilder();
  return { sut };
};

describe("Correios", () => {
  it("should build the exact same xml of old implementation", () => {
    const { sut } = makeSut();
    const result = sut.fromObject({ schema: correiosSchema });
    const expectedXml = removeAllSpacesFromString(
      `<correioslog>
        <tipo_arquivo>
          Postagem
        </tipo_arquivo>
        <versao_arquivo>
          2.3
        </versao_arquivo>
        <plp>
          <id_plp/>
          <valor_global/>
          <mcu_unidade_postagem/>
          <nome_unidade_postagem/>
          <cartao_postagem>
            12334555
          </cartao_postagem>
        </plp>
        <remetente>
          <numero_contrato>
            1223
          </numero_contrato>
          <numero_diretoria>
            10
          </numero_diretoria>
          <codigo_administrativo>
            12334
          </codigo_administrativo>
          <nome_remetente>
            <![CDATA[Fulano]]>
          </nome_remetente>
          <logradouro_remetente>
            <![CDATA[StreetTest]]>
          </logradouro_remetente>
          <numero_remetente>
            <![CDATA[658658]]>
          </numero_remetente>
          <complemento_remetente>
            <![CDATA[Casa03Test]]>
          </complemento_remetente>
          <bairro_remetente>
            <![CDATA[BairroBairroBairro]]>
          </bairro_remetente>
          <cep_remetente>
            <![CDATA[13140000]]>
          </cep_remetente>
          <cidade_remetente>
            <![CDATA[SãoBernardoSãoBernardo]]>
          </cidade_remetente>
          <uf_remetente>
            SP
          </uf_remetente>
          <telefone_remetente>
            <![CDATA[31986532008]]>
          </telefone_remetente>
          <fax_remetente>
            <![CDATA[]]>
          </fax_remetente>
          <email_remetente>
            <![CDATA[email@gmail.com]]>
          </email_remetente>
          <celular_remetente>
            <![CDATA[31986532008]]>
          </celular_remetente>
          <cpf_cnpj_remetente>
            <![CDATA[0000000000]]>
          </cpf_cnpj_remetente>
          <ciencia_conteudo_proibido>
            S
          </ciencia_conteudo_proibido>
        </remetente>
        <forma_pagamento/>
        <objeto_postal>
          <numero_etiqueta>
            OU123344554BR
          </numero_etiqueta>
          <sscc/>
          <codigo_objeto_cliente/>
          <codigo_servico_postagem>
            03298
          </codigo_servico_postagem>
          <cubagem>
            0
          </cubagem>
          <peso>
            30000
          </peso>
          <rt1/>
          <rt2/>
          <restricao_anac>
            S
          </restricao_anac>
          <destinatario>
            <nome_destinatario>
              <![CDATA[TesteDeNome]]>
            </nome_destinatario>
            <telefone_destinatario>
              <![CDATA[31988888888]]>
            </telefone_destinatario>
            <celular_destinatario>
              <![CDATA[31988888888]]>
            </celular_destinatario>
            <email_destinatario>
              <![CDATA[receiver@email.com]]>
            </email_destinatario>
            <logradouro_destinatario>
              <![CDATA[StreetTest]]>
            </logradouro_destinatario>
            <complemento_destinatario>
              <![CDATA[CasaB]]>
            </complemento_destinatario>
            <numero_end_destinatario>
              <![CDATA[1001]]>
            </numero_end_destinatario>
            <cpf_cnpj_destinatario>
              <![CDATA[00000000000]]>
            </cpf_cnpj_destinatario>
          </destinatario>
          <nacional>
            <bairro_destinatario>
              <![CDATA[BairroDeTeste]]>
            </bairro_destinatario>
            <cidade_destinatario>
              <![CDATA[SãoPaulo]]>
            </cidade_destinatario>
            <uf_destinatario>
              SP
            </uf_destinatario>
            <cep_destinatario>
              <![CDATA[96081788]]>
            </cep_destinatario>
            <codigo_usuario_postal/>
            <centro_custo_cliente/>
            <numero_nota_fiscal/>
            <serie_nota_fiscal/>
            <valor_nota_fiscal/>
            <natureza_nota_fiscal/>
            <descricao_objeto>
              <![CDATA[]]>
            </descricao_objeto>
            <valor_a_cobrar>
              0
            </valor_a_cobrar>
          </nacional>
          <servico_adicional>
            <codigo_servico_adicional>
              025
            </codigo_servico_adicional>
            <codigo_servico_adicional>
              064
            </codigo_servico_adicional>
            <valor_declarado>
              10
            </valor_declarado>
          </servico_adicional>
          <dimensao_objeto>
            <tipo_objeto>
              002
            </tipo_objeto>
            <dimensao_altura>
              10
            </dimensao_altura>
            <dimensao_largura>
              10
            </dimensao_largura>
            <dimensao_comprimento>
              10
            </dimensao_comprimento>
            <dimensao_diametro>
              0
            </dimensao_diametro>
          </dimensao_objeto>
          <data_postagem_sara/>
          <status_processamento>
            0
          </status_processamento>
          <numero_comprovante_postagem/>
          <valor_cobrado/>
        </objeto_postal>
      </correioslog>`
    );
    expect(result).toBe(expectedXml);
  });
});
