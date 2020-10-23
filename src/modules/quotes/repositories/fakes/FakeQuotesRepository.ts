import { ObjectID } from 'mongodb';

import IQuotesRepository from '@modules/quotes/repositories/IQuotesRepository';
import ICreateQuoteDTO from '@modules/quotes/dtos/ICreateQuoteDTO';

import Quote from '@modules/quotes/infra/typeorm/schemas/Quote';

class FakeQuotesRepository implements IQuotesRepository {
  private quotes: Quote[] = [];

  public async create({
    user,
    patient,
    price,
    dates,
    hours,
  }: ICreateQuoteDTO): Promise<Quote> {
    const quote = new Quote();

    Object.assign(quote, {
      id: new ObjectID(),
      user,
      patient,
      price,
      dates,
      hours,
    });

    await this.quotes.push(quote);

    return quote;
  }
}

export default FakeQuotesRepository;
