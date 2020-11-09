import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IListPriceSearchResultsDTO from '@modules/exams/dtos/IListPriceSearchResultsDTO';
import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';

// import sortByDistance from '@shared/utils/sortByDistance';
import sortByRecommended from '@shared/utils/sortByRecommended';
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
    examsIds,
    examsSlugs,
    location,
  }: IListPriceSearchResultsDTO): Promise<ILabResultsDTO[]> {
    if (!examsIds && !examsSlugs) {
      throw new AppError('No exam info was provided');
    }

    const matchedPricesI = examsIds
      ? await this.pricesRepository.findAllRecentByExamsIds(examsIds)
      : [];

    const matchedPricesII = examsSlugs
      ? await this.pricesRepository.findAllRecentByExamsSlugs(examsSlugs)
      : [];

    const matchedPrices = [...matchedPricesI, ...matchedPricesII];

    const matchedPricesLabIdsDuplicated = matchedPrices.map(
      matchedPrice => matchedPrice.lab_id,
    );

    const matchedLabIds = [...new Set(matchedPricesLabIdsDuplicated)];

    const matchedLabsDuplicated = matchedPrices.map(
      matchedPrice => matchedPrice.lab,
    );

    const unsortedSearchResults = matchedLabIds.map(matchedLabId => {
      const matchedPricesLab = matchedPrices.filter(
        matchedPrice => matchedPrice.lab_id === matchedLabId,
      );

      const matchedLab = matchedLabsDuplicated.find(
        lab => lab.id === matchedLabId,
      );

      if (!matchedLab) {
        throw new AppError(
          'An error ocurred when trying to list the matched labs from the query',
        );
      }

      const distance = this.distanceProvider.calculateInKms({
        latitude1: Number(matchedLab.latitude),
        longitude1: Number(matchedLab.longitude),
        latitude2: location.latitude,
        longitude2: location.longitude,
      });

      const examsFound = matchedPricesLab.length;

      const totalPrice = matchedPricesLab.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
        0,
      );

      const searchResult: ILabResultsDTO = {
        lab: matchedLab,
        distance,
        exams_found: examsFound,
        total_exams:
          (examsIds ? examsIds.length : 0) +
          (examsSlugs ? examsSlugs.length : 0),
        total_price: totalPrice,
      };

      return searchResult;
    });

    const searchResults = unsortedSearchResults.sort(sortByRecommended);

    return searchResults;
  }
}
