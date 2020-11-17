import IBagsRepository from '@modules/bags/repositories/IBagsRepository';
import ICreateBagDTO from '@modules/bags/dtos/ICreateBagDTO';

import Bag from '@modules/bags/infra/typeorm/schemas/Bag';
import { ObjectID } from 'mongodb';

class FakeBagsRepository implements IBagsRepository {
  private bags: Bag[] = [];

  public async create({ user, prices }: ICreateBagDTO): Promise<Bag> {
    const bag = new Bag();

    Object.assign(bag, {
      id: new ObjectID(),
      user,
      prices,
    });

    this.bags.push(bag);

    return bag;
  }

  public async findById(id: ObjectID): Promise<Bag | undefined> {
    return this.bags.find(bag => bag.id === id);
  }

  public async save(bag: Bag): Promise<Bag> {
    this.bags.push(bag);

    return bag;
  }
}

export default FakeBagsRepository;
