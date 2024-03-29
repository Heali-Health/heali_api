import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ISlugTransformationProvider from '@shared/container/providers/SlugTransformationProvider/models/ISlugTransformationProvider';
import Lab from '@modules/labs/infra/typeorm/entities/Lab';

@injectable()
export default class CreateLabService {
  constructor(
    @inject('LabsRepository')
    private labsRepository: ILabsRepository,

    @inject('SlugTransformationProvider')
    private slugTransformation: ISlugTransformationProvider,
  ) {}

  public async execute({
    title,
    company_id,
    original_id,
    address,
    city,
    state,
    latitude,
    longitude,
    collect_hour,
    open_hour,
    company_id_original_id,
  }: ICreateLabDTO): Promise<Lab> {
    const checkLabExists = await this.labsRepository.findSameLab({
      company_id,
      original_id,
    });

    if (checkLabExists) {
      throw new AppError('Lab already in use');
    }

    const lab = await this.labsRepository.create({
      title,
      slug: await this.slugTransformation.transform(title),
      company_id,
      original_id,
      address,
      city,
      state,
      latitude,
      longitude,
      collect_hour,
      open_hour,
      company_id_original_id,
    });

    return lab;
  }
}
