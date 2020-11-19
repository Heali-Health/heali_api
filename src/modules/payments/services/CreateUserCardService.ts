import { injectable, inject } from 'tsyringe';
import IUserCardsRepository from '../repositories/IUserCardsRepository';
import ICreateUserCardDTO from '../dtos/ICreateUserCardDTO';
import UserCard from '../infra/typeorm/schemas/UserCard';

@injectable()
export default class CreateUserCardService {
  constructor(
    @inject('UserCardsRepository')
    private userCardsRepository: IUserCardsRepository,
  ) {}

  public async execute({
    userId,
    card,
  }: ICreateUserCardDTO): Promise<UserCard> {
    const userCard = await this.userCardsRepository.create({
      userId,
      card,
    });

    return userCard;
  }
}
