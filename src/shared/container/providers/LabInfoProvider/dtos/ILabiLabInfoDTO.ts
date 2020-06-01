export default interface ILabiLabInfoDTO {
  id: number;
  title: string;
  address: {
    r: string;
    cep: string;
    b: string;
    city: string;
    location: {
      lat: number;
      lng: number;
    };
  };
  link_map: string;
  link_map_app: string;
  content: object;
  is_opened: boolean;
  open_date: string;
  results_hour: string;
  collect_hour: string;
}
