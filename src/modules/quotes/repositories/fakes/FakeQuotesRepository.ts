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
      status: 'awaiting-payment',
      user,
      patient,
      price,
      dates,
      hours,
      paymentTrialIds: [] as number[],
    });

    await this.quotes.push(quote);

    return quote;
  }

  public async findById(id: string): Promise<Quote | undefined> {
    return this.quotes.find(quote => quote.id.toString() === id);
  }

  public async save(quote: Quote): Promise<Quote> {
    this.quotes.push(quote);

    return quote;
  }
}

export default FakeQuotesRepository;
