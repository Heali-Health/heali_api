import { injectable, inject } from 'tsyringe';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import Price from '@modules/exams/infra/typeorm/entities/Price';

@injectable()
export default class InsertPricesFromApiService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('LabInfoProvider')
    private labInfoProvider: ILabInfoProvider,
  ) {}

  public async execute(): Promise<Price[]> {
    const pricesFromApi = await this.labInfoProvider.getPricesInfo();

    const pricesToInsert = await this.pricesRepository.insertPrices(
      pricesFromApi,
    );

    return pricesToInsert;
  }
}
