import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';
import ICalculateDistanceDTO from '../dtos/ICalculateDistanceDTO';

export default class FormulaDistanceProvider implements IDistanceProvider {
  public calculateInKms({
    latitude1,
    latitude2,
    longitude1,
    longitude2,
  }: ICalculateDistanceDTO): number {
    const degreeToRadians = (degree: number): number => {
      const radians = degree * (Math.PI / 180);
      return radians;
    };

    if (
      (latitude1 === 0 && longitude1 === 0) ||
      (latitude2 === 0 && longitude2 === 0)
    ) {
      return 0;
    }

    const earthRadius = 6371; // Radius of the earth in km
    const distanceLatitude = degreeToRadians(latitude2 - latitude1); // degreeToRadians below
    const distanceLongitude = degreeToRadians(longitude2 - longitude1);
    const a =
      Math.sin(distanceLatitude / 2) * Math.sin(distanceLatitude / 2) +
      Math.cos(degreeToRadians(latitude1)) *
        Math.cos(degreeToRadians(latitude2)) *
        Math.sin(distanceLongitude / 2) *
        Math.sin(distanceLongitude / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in km
    return distance;
  }
}
