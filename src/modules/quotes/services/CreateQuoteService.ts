import { injectable, inject } from 'tsyringe';
import IQuotesRepository from '../repositories/IQuotesRepository';
import Quote from '../infra/typeorm/schemas/Quote';
import ICreateQuoteDTO from '../dtos/ICreateQuoteDTO';

/**
 * To-do:
 * (x) criar quote
 * ( ) criar notificação sobre agendamento
 */

@injectable()
export default class CreateQuoteService {
  constructor(
    @inject('QuotesRepository')
    private quotesRepository: IQuotesRepository,
  ) {}

  public async execute({
    user_id,
    patient_id,
    patient_first_name,
    patient_last_name,
    price,
  }: ICreateQuoteDTO): Promise<Quote> {
    const quote = await this.quotesRepository.create({
      user_id,
      patient_id,
      patient_first_name,
      patient_last_name,
      price,
    });

    return quote;
  }
}
