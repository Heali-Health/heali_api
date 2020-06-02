import { uuid } from 'uuidv4';

import Price from '@modules/exams/infra/typeorm/entities/Price';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

export default class FakePricesRepository implements IPricesRepository {
  private prices: Price[] = [];

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const preAdjustedPrices = original_exams_ids.map(originalExamId => {
      const originalExamPrices = this.prices.filter(
        price => price.original_exam_id === originalExamId,
      );

      return originalExamPrices;
    });

    const prices = preAdjustedPrices.reduce((result, current) => {
      result.push(...current);
      return result;
    });

    return prices;
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
