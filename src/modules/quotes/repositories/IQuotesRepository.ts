import ICreateQuoteDTO from '../dtos/ICreateQuoteDTO';
import Quote from '../infra/typeorm/schemas/Quote';

export default interface IQuotesRepository {
  create(data: ICreateQuoteDTO): Promise<Quote>;
}
