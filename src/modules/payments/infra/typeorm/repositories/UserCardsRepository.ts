import ICreateUserCardDTO from '@modules/payments/dtos/ICreateUserCardDTO';
import IUserCardsRepository from '@modules/payments/repositories/IUserCardsRepository';
import { getMongoRepository, MongoRepository } from 'typeorm';
import UserCard from '../schemas/UserCard';

class UserCardsRepository implements IUserCardsRepository {
  private ormRepository: MongoRepository<UserCard>;

  constructor() {
    this.ormRepository = getMongoRepository(UserCard, 'mongo');
  }

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
    const userCard = this.ormRepository.create({
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
      paying_customer,
      payment_method,
      billing_address,
      boleto_barcode,
      boleto_expiration_date,
      boleto_url,
    });

    await this.ormRepository.save(userCard);

    return userCard;
  }

  public async findAllByUserId(userId: string): Promise<UserCard[]> {
    const userCards = await this.ormRepository.find({
      where: {
        user_id: userId,
      },
    });

    return userCards;
  }

  public async findUserCardByForeignId(
    foreignId: string,
  ): Promise<UserCard | undefined> {
    return this.ormRepository.findOne({
      where: {
        foreign_id: foreignId,
      },
    });
  }

  public async save(userCard: UserCard): Promise<UserCard> {
    await this.ormRepository.save(userCard);

    return userCard;
  }
}

export default UserCardsRepository;
