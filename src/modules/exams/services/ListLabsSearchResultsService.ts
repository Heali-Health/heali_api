import { injectable, inject } from 'tsyringe';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IListPriceSearchResultsDTO from '@modules/exams/dtos/IListPriceSearchResultsDTO';
import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';

import sortByDistance from '@shared/utils/sortByDistance';
import ILabResultsDTO from '../dtos/ILabResultsDTO';

@injectable()
export default class ListPriceSearchResultsService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('DistanceProvider')
    private distanceProvider: IDistanceProvider,
  ) {}

  public async execute({
    exams_ids,
    location,
  }: IListPriceSearchResultsDTO): Promise<ILabResultsDTO[]> {
    const matchedPrices = await this.pricesRepository.findAllRecentByExamsIds(
      exams_ids,
    );

    const duplicatedSearchResults = matchedPrices.map(matchedPrice => {
      console.log(matchedPrice);

      const distance = this.distanceProvider.calculateInKms({
        latitude1: Number(matchedPrice.lab.latitude),
        longitude1: Number(matchedPrice.lab.longitude),
        latitude2: location.latitude,
        longitude2: location.longitude,
      });

      const examsFound = matchedPrices.filter(
        price =>
          price.exam_id === matchedPrice.exam_id &&
          price.lab_id_exam_original_id ===
            matchedPrice.lab_id_exam_original_id,
      );

      const totalPrice = examsFound.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
        0,
      );

      const searchResult: ILabResultsDTO = {
        lab: matchedPrice.lab,
        distance,
        exams_found: examsFound.length,
        total_exams: exams_ids.length,
        total_price: totalPrice,
      };

      return searchResult;
    });

    const unsortedSearchResults = Array.from(new Set(duplicatedSearchResults));

    const searchResults = unsortedSearchResults.sort(sortByDistance);

    return searchResults;
  }
}
