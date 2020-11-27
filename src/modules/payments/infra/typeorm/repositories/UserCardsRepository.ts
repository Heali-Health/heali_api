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
  }: ICreateUserCardDTO): Promise<UserCard> {
    const bag = this.ormRepository.create({
      user_id: userId,
      object: card.object,
      foreign_id: card.id,
      brand: card.brand,
      first_digits: card.first_digits,
      last_digits: card.last_digits,
      holder_name: card.holder_name,
      expiration_date: card.expiration_date,
      country: card.country,
      fingerprint: card.fingerprint,
      valid: card.valid,
      foreign_date_created: card.date_created,
      foreign_date_updated: card.date_updated,
      paying_customer,
      billing_address,
    });

    await this.ormRepository.save(bag);

    return bag;
  }

  public async findAllByUserId(userId: string): Promise<UserCard[]> {
    const bags = await this.ormRepository.find({
      where: {
        user_id: userId,
      },
    });

    return bags;
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
