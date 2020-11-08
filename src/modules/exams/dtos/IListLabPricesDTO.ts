import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';

export default interface IListLabPricesDTO {
  examIds?: string | string[];
  examSlugs?: string | string[];
  labId?: string;
  labSlug?: string;
  location: ILocationDTO;
}
