import { injectable, inject } from 'tsyringe';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';

import Lab from '@modules/labs/infra/typeorm/entities/Lab';

@injectable()
export default class ListLabsFromCompanyService {
  constructor(
    @inject('LabsRepository')
    private labsRepository: ILabsRepository,
  ) {}

  public async execute(company_id: string): Promise<Lab[]> {
    const labs = await this.labsRepository.findAllByCompanyId(company_id);

    return labs;
  }
}
