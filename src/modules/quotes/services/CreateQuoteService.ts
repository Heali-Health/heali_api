import { injectable, inject } from 'tsyringe';
import IQuotesRepository from '../repositories/IQuotesRepository';
import Quote from '../infra/typeorm/schemas/Quote';
import ICreateQuoteDTO from '../dtos/ICreateQuoteDTO';

@injectable()
export default class CreateQuoteService {
  constructor(
    @inject('QuotesRepository')
    private quotesRepository: IQuotesRepository,
  ) {}

  public async execute({
    user,
    patient,
    price,
  }: ICreateQuoteDTO): Promise<Quote> {
    const quote = await this.quotesRepository.create({
      user,
      patient,
      price,
    });

    return quote;
  }
}
