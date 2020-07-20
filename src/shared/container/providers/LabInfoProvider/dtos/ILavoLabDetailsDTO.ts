export default interface ILavoLabDetailsDTO {
  codigo: string;
  nome: string;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
  };
  latitude: number;
  longitude: number;
  grupoExames: string[];
  funcionamento: string[];
  coleta: string[];
  facilidades: string[];
  covidDedicated: boolean;
}
