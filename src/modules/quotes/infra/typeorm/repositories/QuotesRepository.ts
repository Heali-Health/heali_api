import { getMongoRepository, MongoRepository } from 'typeorm';

import IQuotesRepository from '@modules/quotes/repositories/IQuotesRepository';
import ICreateQuoteDTO from '@modules/quotes/dtos/ICreateQuoteDTO';

import Quote from '@modules/quotes/infra/typeorm/schemas/Quote';

class QuotesRepository implements IQuotesRepository {
  private ormRepository: MongoRepository<Quote>;

  constructor() {
    this.ormRepository = getMongoRepository(Quote, 'mongo');
  }

  public async create({
    user,
    patient,
    price,
    dates,
    hours,
  }: ICreateQuoteDTO): Promise<Quote> {
    const quote = this.ormRepository.create({
      user,
      patient,
      price,
      dates,
      hours,
    });

    await this.ormRepository.save(quote);

    return quote;
  }
}

export default QuotesRepository;
