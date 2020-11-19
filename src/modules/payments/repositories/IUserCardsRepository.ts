import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserCardDTO from '../dtos/ICreateUserCardDTO';
import UserCard from '../infra/typeorm/schemas/UserCard';

export default interface IUserCardsRepository {
  create({ userId, card }: ICreateUserCardDTO): Promise<UserCard>;
  findAllByUserId(userId: string): Promise<UserCard[]>;
}
