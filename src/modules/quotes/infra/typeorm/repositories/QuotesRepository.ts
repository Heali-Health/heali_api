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
      status: 'awaiting-payment',
      user,
      patient,
      price,
      dates,
      hours,
      paymentTrialIds: [],
    });

    await this.ormRepository.save(quote);

    return quote;
  }

  public async findById(id: string): Promise<Quote | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async save(quote: Quote): Promise<Quote> {
    await this.ormRepository.save(quote);

    return quote;
  }
}

export default QuotesRepository;
