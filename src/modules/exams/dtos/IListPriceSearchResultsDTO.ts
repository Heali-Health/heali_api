import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';

export default interface IListPriceSearchResultsDTO {
  examsIds?: string[] | string;
  examsSlugs?: string[] | string;
  location: ILocationDTO;
}
