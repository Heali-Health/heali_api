import { injectable, inject } from 'tsyringe';

import Price from '@modules/exams/infra/typeorm/entities/Price';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';

@injectable()
export default class ListPricesService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,
  ) {}

  public async execute(id: string | string[]): Promise<Price[]> {
    return this.pricesRepository.findByIds(id);
  }
}
