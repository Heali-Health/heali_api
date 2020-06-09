import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';

export default interface IListPriceSearchResultsDTO {
  exams_ids: string[];
  location: ILocationDTO;
}
