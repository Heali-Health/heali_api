import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import Lab from '@modules/labs/infra/typeorm/entities/Lab';

@injectable()
export default class UpdateLabService {
  constructor(
    @inject('LabsRepository')
    private labsRepository: ILabsRepository,
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
  }: ICreateLabDTO): Promise<Lab> {
    const lab = await this.labsRepository.findSameLab({
      company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
      original_id,
    });

    if (!lab) {
      throw new AppError('Lab not found');
    }

    if (title) {
      lab.title = title;
    }

    if (company_id) {
      lab.company_id = company_id;
    }

    if (address) {
      lab.address = address;
    }

    if (city) {
      lab.city = city;
    }

    if (state) {
      lab.state = state;
    }

    if (latitude) {
      lab.latitude = latitude;
    }

    if (longitude) {
      lab.longitude = longitude;
    }

    if (collect_hour) {
      lab.collect_hour = collect_hour;
    }

    if (open_hour) {
      lab.open_hour = open_hour;
    }

    return this.labsRepository.save(lab);
  }
}
