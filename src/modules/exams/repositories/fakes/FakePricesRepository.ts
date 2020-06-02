import { uuid } from 'uuidv4';

import Price from '@modules/exams/infra/typeorm/entities/Price';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

export default class FakePricesRepository implements IPricesRepository {
  private prices: Price[] = [];

  public async create(priceData: ICreatePriceDTO): Promise<Price> {
    const price = new Price();

    Object.assign(price, { id: uuid() }, priceData);

    this.prices.push(price);

    return price;
  }

  public async save(price: Price): Promise<Price> {
    const findIndex = this.prices.findIndex(
      findPrice => findPrice.id === price.id,
    );

    this.prices[findIndex] = price;

    return price;
  }

  public async saveMany(prices: Price[]): Promise<Price[]> {
    const updatedPrices = prices.map(price => {
      const findIndex = this.prices.findIndex(
        findPrice => findPrice.id === price.id,
      );

      this.prices[findIndex] = price;

      return price;
    });

    return updatedPrices;
  }

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const originalExamPrices = this.prices.filter(price =>
      original_exams_ids.includes(price.original_exam_id),
    );

    return originalExamPrices;
  }

  public async insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]> {
    const insertedPrices = priceData.map(priceToUpsert => {
      const newPrice = new Price();

      Object.assign(newPrice, { id: uuid() }, priceToUpsert);

      this.prices.push(newPrice);

      return newPrice;
    });

    return insertedPrices;
  }
}
