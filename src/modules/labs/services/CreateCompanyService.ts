import { injectable, inject } from 'tsyringe';

import ICompaniesRepository from '@modules/labs/repositories/ICompaniesRepository';
import ICreateCompanyDTO from '@modules/labs/dtos/ICreateCompanyDTO';
import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';
import Company from '@modules/labs/infra/typeorm/entities/Company';

@injectable()
export default class CreateLabService {
  constructor(
    @inject('CompaniesRepository')
    private companiesRepository: ICompaniesRepository,

    @inject('SlugTransformationProvider')
    private slugTransformation: ISlugTransformationProvider,
  ) {}

  public async execute({ title, logo }: ICreateCompanyDTO): Promise<Company> {
    const company = await this.companiesRepository.create({
      title,
      logo,
      slug: await this.slugTransformation.transform(title),
    });

    return company;
  }
}
