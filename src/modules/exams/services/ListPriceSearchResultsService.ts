import { injectable, inject } from 'tsyringe';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import IListPriceSearchResultsDTO from '@modules/exams/dtos/IListPriceSearchResultsDTO';
import Price from '@modules/exams/infra/typeorm/entities/Price';

@injectable()
export default class ListPriceSearchResultsService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,
  ) {}

  public async execute({
    exams_ids,
    location,
  }: IListPriceSearchResultsDTO): Promise<Price[]> {
    const matchedPrices = await this.pricesRepository.findAllRecentByExamsIds(
      exams_ids,
    );

    return matchedPrices;
  }
}
