import { Repository, getRepository, In } from 'typeorm';
import { max } from 'date-fns';

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

  public async findAllRecentByExamsIds(exams_ids: string[]): Promise<Price[]> {
    const matchedPrices = await this.ormRepository.find({
      where: {
        exam_id: In(exams_ids),
      },
    });

    const matchedPriceIds = matchedPrices.map(price => price.id);

    const recentMatchedPrices = matchedPriceIds.map(price_id => {
      const prices = matchedPrices.filter(price => price_id.includes(price.id));

      const matchedCreatedDates = prices.map(price => price.created_date);

      const maxCreatedDate = max(matchedCreatedDates);

      const recentPriceIndex = prices.findIndex(
        price => price.created_date === maxCreatedDate,
      );

      const recentPrice = matchedPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const prices = await this.ormRepository.find({
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
