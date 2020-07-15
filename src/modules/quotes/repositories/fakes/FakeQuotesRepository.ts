import { ObjectID } from 'mongodb';

import IQuotesRepository from '@modules/quotes/repositories/IQuotesRepository';
import ICreateQuoteDTO from '@modules/quotes/dtos/ICreateQuoteDTO';

import Quote from '@modules/quotes/infra/typeorm/schemas/Quote';

class FakeQuotesRepository implements IQuotesRepository {
  private quotes: Quote[] = [];

  public async create({
    user_id,
    patient_id,
    patient_first_name,
    patient_last_name,
    price,
  }: ICreateQuoteDTO): Promise<Quote> {
    const quote = new Quote();

    Object.assign(quote, {
      id: new ObjectID(),
      user_id,
      patient_id,
      patient_first_name,
      patient_last_name,
      price,
    });

    await this.quotes.push(quote);

    return quote;
  }
}

export default FakeQuotesRepository;
