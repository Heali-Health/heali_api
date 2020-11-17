import { getMongoRepository, MongoRepository, ObjectID } from 'typeorm';

import IBagsRepository from '@modules/bags/repositories/IBagsRepository';

import Bag from '@modules/bags/infra/typeorm/schemas/Bag';
import ICreateBagDTO from '@modules/bags/dtos/ICreateBagDTO';

class BagsRepository implements IBagsRepository {
  private ormRepository: MongoRepository<Bag>;

  constructor() {
    this.ormRepository = getMongoRepository(Bag, 'mongo');
  }

  public async create({ user, prices }: ICreateBagDTO): Promise<Bag> {
    const bag = this.ormRepository.create({
      prices,
      user,
    });

    await this.ormRepository.save(bag);

    return bag;
  }

  public async findById(id: ObjectID): Promise<Bag | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async save(bag: Bag): Promise<Bag> {
    return this.ormRepository.save(bag);
  }
}

export default BagsRepository;
