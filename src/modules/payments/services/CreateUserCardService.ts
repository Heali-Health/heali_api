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
    paying_customer,
    billing_address,
    payment_method,
    boleto_barcode,
    boleto_expiration_date,
    boleto_url,
  }: ICreateUserCardDTO): Promise<UserCard> {
    const id = card ? card.id : `${payment_method}${userId}`;

    const checkIfUserCardExists = await this.userCardsRepository.findUserCardByForeignId(
      id,
    );

    if (checkIfUserCardExists) {
      return checkIfUserCardExists;
    }

    const userCard = await this.userCardsRepository.create({
      userId,
      card,
      paying_customer,
      billing_address,
      payment_method,
      boleto_barcode,
      boleto_expiration_date,
      boleto_url,
    });

    return userCard;
  }
}
