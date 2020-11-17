import { injectable, inject } from 'tsyringe';
import { ObjectID } from 'mongodb';

import AppError from '@shared/errors/AppError';

import IBagsRepository from '../repositories/IBagsRepository';
import Bag from '../infra/typeorm/schemas/Bag';

@injectable()
export default class ShowBagService {
  constructor(
    @inject('BagsRepository')
    private bagsRepository: IBagsRepository,
  ) {}

  public async execute(bagId: ObjectID): Promise<Bag> {
    const bag = await this.bagsRepository.findById(bagId);

    if (!bag) throw new AppError('No bag was found with the informed id');

    return bag;
  }
}
