import ILocationDTO from '@shared/container/providers/LocationProvider/dtos/ILocationDTO';

export default interface ILocationProvider {
  getLocationDetails(input: string): Promise<ILocationDTO>;
}
