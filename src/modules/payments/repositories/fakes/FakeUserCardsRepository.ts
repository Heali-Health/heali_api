import ICreateUserCardDTO from '@modules/payments/dtos/ICreateUserCardDTO';
import UserCard from '@modules/payments/infra/typeorm/schemas/UserCard';
import { ObjectId } from 'mongodb';
import IUserCardsRepository from '../IUserCardsRepository';

class FakeUserCardsRepository implements IUserCardsRepository {
  private userCards: UserCard[] = [];

  public async create({ userId, card }: ICreateUserCardDTO): Promise<UserCard> {
    const userCard = new UserCard();

    Object.assign(userCard, {
      id: new ObjectId(),
      user_id: userId,
      object: card.object,
      pagarme_id: card.id,
      brand: card.brand,
      first_digits: card.first_digits,
      last_digits: card.last_digits,
      holder_name: card.holder_name,
      expiration_date: card.expiration_date,
      country: card.country,
      fingerprint: card.fingerprint,
      valid: card.valid,
      pagarme_date_created: card.date_created,
      pagarme_date_updated: card.date_updated,
    });

    this.userCards.push(userCard);

    return userCard;
  }

  public async findAllByUserId(userId: string): Promise<UserCard[]> {
    return this.userCards.filter(card => card.user_id === userId);
  }
}

export default FakeUserCardsRepository;
