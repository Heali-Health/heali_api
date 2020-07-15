export default interface IDrcExamsDTO {
  category: number;
  chave: string;
  id_produto: number;
  produto: string;
  nome: string;
  agendavel: number | null;
  preparo: string;
  descricao: string;
  grupo: string;
  agenda_sn: string;
  rank: number;
  preco_min: number;
  preco_min_num_parcelas: number;
  preco_min_parcela: number;
  preco_max: number;
  preco_max_num_parcelas: number;
  preco_max_parcela: number;
  sinonimia: string;
  idade_min: number;
  idade_max: number;
  sexo: string;
  dias_resultado: number;
  uf: string;
  is_convenio: false;
  ID: number;
  show_preco: string;
  convenio_ativo: string;
  telemedicina_sn: null;
}
