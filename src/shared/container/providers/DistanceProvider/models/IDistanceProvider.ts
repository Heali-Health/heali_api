import ICalculateDistanceDTO from '../dtos/ICalculateDistanceDTO';

export default interface IDistanceProvider {
  calculateInKms(coordinates: ICalculateDistanceDTO): number;
}
