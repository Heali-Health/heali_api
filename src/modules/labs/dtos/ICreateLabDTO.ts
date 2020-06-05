export default interface ICreateLabDTO {
  title: string;

  slug: string;

  company_id: string;

  original_id: string;

  company_id_original_id: string;

  address: string;

  city: string;

  state?: string;

  latitude: number;

  longitude: number;

  collect_hour: string;

  open_hour: string;
}
