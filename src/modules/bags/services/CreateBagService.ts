import { injectable, inject } from 'tsyringe';
import Price from '@modules/exams/infra/typeorm/entities/Price';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import IBagsRepository from '../repositories/IBagsRepository';
import Bag from '../infra/typeorm/schemas/Bag';

interface IRequest {
  userId?: string;
  prices?: Price[];
}

@injectable()
export default class CreateBagService {
  constructor(
    @inject('BagsRepository')
    private bagsRepository: IBagsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, prices }: IRequest): Promise<Bag> {
    let user: User | undefined;

    if (userId) user = await this.usersRepository.findById(userId);

    const bag = await this.bagsRepository.create({
      user,
      prices,
    });

    return bag;
  }
}
