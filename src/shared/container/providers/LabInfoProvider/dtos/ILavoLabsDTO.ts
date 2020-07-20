export default interface ILavoLabsDTO {
  id: number;
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
  covidDedicated?: boolean;
}
