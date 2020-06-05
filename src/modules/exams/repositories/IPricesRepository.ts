import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import Price from '@modules/exams/infra/typeorm/entities/Price';

export default interface IPricesRepository {
  create(priceData: ICreatePriceDTO): Promise<Price>;
  save(price: Price): Promise<Price>;
  saveMany(prices: Price[]): Promise<Price[]>;
  findAllRecentByExamsIds(exams_ids: string[]): Promise<Price[]>;
  findByOriginalExamIdsArray(original_exams_ids: string[]): Promise<Price[]>;
  insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]>;
}
