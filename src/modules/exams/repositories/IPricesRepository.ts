import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import Price from '@modules/exams/infra/typeorm/entities/Price';

export default interface IOriginalExamsRepository {
  create(priceData: ICreatePriceDTO): Promise;
  save(price: Price): Promise<Price>;
  saveMany(prices: Price[]): Promise<Price[]>;
  findByOriginalExamIdsArray(original_exams_ids: string[]): Promise<Price[]>;
  insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]>;
}
