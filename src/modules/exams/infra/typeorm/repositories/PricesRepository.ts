import { Repository, getRepository, In } from 'typeorm';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

import Price from '@modules/exams/infra/typeorm/entities/Price';

export default class PricesRepository implements IPricesRepository {
  private ormRepository: Repository<Price>;

  constructor() {
    this.ormRepository = getRepository(Price);
  }

  public async create(priceData: ICreatePriceDTO): Promise<Price> {
    const price = this.ormRepository.create(priceData);

    await this.ormRepository.save(price);

    return price;
  }

  public async save(price: Price): Promise<Price> {
    return this.ormRepository.save(price);
  }

  public async saveMany(prices: Price[]): Promise<Price[]> {
    return this.ormRepository.save(prices);
  }

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const prices = this.ormRepository.find({
      where: {
        original_exam_id: In(original_exams_ids),
      },
    });

    return prices;
  }

  public async insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]> {
    const prices = this.ormRepository.create(priceData);

    await this.ormRepository.save(prices);

    return prices;
  }
}
