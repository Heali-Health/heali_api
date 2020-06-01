import { injectable, inject } from 'tsyringe';

import ICompaniesRepository from '@modules/labs/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/labs/dtos/ICreateCompanyDTO';
import Company from '@modules/labs/infra/typeorm/entities/Company';

@injectable()
export default class CreateLabService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,
  ) {}

  public async execute({ title, logo }: ICreateCompanyDTO): Promise<Company> {
    const company = await this.companiesRepository.create({
      title,
      logo,
    });

    return company;
  }
}
