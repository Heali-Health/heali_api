import ICreateUserCardDTO from '@modules/payments/dtos/ICreateUserCardDTO';
import UserCard from '@modules/payments/infra/typeorm/schemas/UserCard';
import { ObjectId } from 'mongodb';
import IUserCardsRepository from '../IUserCardsRepository';

class FakeUserCardsRepository implements IUserCardsRepository {
  private userCards: UserCard[] = [];

  public async create({
    userId,
    card,
    paying_customer,
    billing_address,
    payment_method,
    boleto_barcode,
    boleto_expiration_date,
    boleto_url,
  }: ICreateUserCardDTO): Promise<UserCard> {
    const userCard = new UserCard();

    Object.assign(userCard, {
      id: new ObjectId(),
      user_id: userId,
      object: card && card.object,
      foreign_id: card ? card.id : `${payment_method}${userId}`,
      brand: card && card.brand,
      first_digits: card && card.first_digits,
      last_digits: card && card.last_digits,
      holder_name: card && card.holder_name,
      expiration_date: card && card.expiration_date,
      country: card && card.country,
      fingerprint: card && card.fingerprint,
      valid: card && card.valid,
      foreign_date_created: card && card.date_created,
      foreign_date_updated: card && card.date_updated,
      isMain: false,
      paying_customer,
      billing_address,
      payment_method,
      boleto_barcode,
      boleto_expiration_date,
      boleto_url,
    });

    this.userCards.push(userCard);

    return userCard;
  }

  public async findAllByUserId(userId: string): Promise<UserCard[]> {
    return this.userCards.filter(card => card.user_id === userId);
  }

  public async findUserCardByForeignId(
    foreignId: string,
  ): Promise<UserCard | undefined> {
    return this.userCards.find(card => card.foreign_id === foreignId);
  }

  public async save(userCard: UserCard): Promise<UserCard> {
    this.userCards.push(userCard);

    return userCard;
  }
}

export default FakeUserCardsRepository;
