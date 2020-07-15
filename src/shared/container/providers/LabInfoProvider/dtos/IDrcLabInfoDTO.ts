export default interface IDrcLabInfoDTO {
  horarios: object;
  hibernacao_sn: string;
  _id: string;
  id_unidade: number;
  __v: number;
  bairro: string;
  chave: string;
  cidade: string;
  comochegar_carro: string;
  comochegar_publico: string;
  cro_cl: string;
  data_abertura: string;
  endereco: string;
  fim_hibernacao: string;
  horario: string;
  horario_coleta: string;
  id_regional: number;
  inicio_hibernacao: string;
  latitude: number;
  longitude: number;
  nome: string;
  nome_curto: string;
  regional: string;
  rt_crm: string;
  rt_nome: string;
  rto_cro: null;
  rto_nome: null;
  telefone: string;
  telefone_ddd: number;
  uf: string;
  virtual_sn: string;
  id: string;
  geolocation: {
    latitude: string;
    longitude: string;
  };
}
