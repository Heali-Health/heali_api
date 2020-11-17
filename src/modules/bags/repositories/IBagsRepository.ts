import Bag from '@modules/bags/infra/typeorm/schemas/Bag';
import { ObjectID } from 'mongodb';
import ICreateBagDTO from '../dtos/ICreateBagDTO';

export default interface IBagsRepository {
  create(data: ICreateBagDTO): Promise<Bag>;
  findById(id: ObjectID): Promise<Bag | undefined>;
  save(bag: Bag): Promise<Bag>;
}
