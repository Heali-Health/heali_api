import { injectable, inject } from 'tsyringe';
import IUserCardsRepository from '../repositories/IUserCardsRepository';
import UserCard from '../infra/typeorm/schemas/UserCard';

@injectable()
export default class ListUserCardsService {
  constructor(
    @inject('UserCardsRepository')
    private userCardsRepository: IUserCardsRepository,
  ) {}

  public async execute(userId: string): Promise<UserCard[]> {
    const cards = await this.userCardsRepository.findAllByUserId(userId);

    return cards;
  }
}
