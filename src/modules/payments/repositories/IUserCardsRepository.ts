import ICreateUserCardDTO from '../dtos/ICreateUserCardDTO';
import UserCard from '../infra/typeorm/schemas/UserCard';

export default interface IUserCardsRepository {
  create({
    userId,
    card,
    paying_customer,
    billing_address,
    payment_method,
    boleto_barcode,
    boleto_expiration_date,
    boleto_url,
  }: ICreateUserCardDTO): Promise<UserCard>;
  findAllByUserId(userId: string): Promise<UserCard[]>;
  findUserCardByForeignId(foreignId: string): Promise<UserCard | undefined>;
  save(userCard: UserCard): Promise<UserCard>;
}
