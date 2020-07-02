import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';

export default interface IListLabPricesDTO {
  exams_ids: string[];
  lab_id: string;
  location: ILocationDTO;
}
