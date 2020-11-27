import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IQuotesRepository from '../repositories/IQuotesRepository';
import Quote from '../infra/typeorm/schemas/Quote';

interface IRequest {
  newStatus: string;
  quoteId: string;
  paymentTrialId: number;
}

@injectable()
export default class UpdateQuoteService {
  constructor(
    @inject('QuotesRepository')
    private quotesRepository: IQuotesRepository,
  ) {}

  public async execute({
    newStatus,
    quoteId,
    paymentTrialId,
  }: IRequest): Promise<Quote> {
    const quote = await this.quotesRepository.findById(quoteId);

    if (!quote) throw new AppError('No quote found with this id');

    quote.status = newStatus;
    quote.paymentTrialIds.push(paymentTrialId);

    await this.quotesRepository.save(quote);

    return quote;
  }
}
