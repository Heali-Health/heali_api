import { Repository, getRepository } from 'typeorm';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

import Price from '@modules/exams/infra/typeorm/entities/Price';

export default class PricesRepository implements IPricesRepository {
  private ormRepository: Repository<Price>;

  constructor() {
    this.ormRepository = getRepository(Price);
  }

  public async insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]> {
    const prices = this.ormRepository.create(priceData);

    await this.ormRepository.save(prices);

    return prices;
  }
}
