import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserCardsRepository from '../repositories/IUserCardsRepository';

@injectable()
export default class UpdateMainUserCardsService {
  constructor(
    @inject('UserCardsRepository')
    private userCardsRepository: IUserCardsRepository,
  ) {}

  public async execute(userId: string, cardForeignId: string): Promise<void> {
    const userCards = await this.userCardsRepository.findAllByUserId(userId);

    const checkIfCardExists = userCards.find(
      card => card.foreign_id === cardForeignId,
    );

    if (!checkIfCardExists) {
      throw new AppError('No card was found with this foreign id');
    }

    const mainUserCard = userCards.find(card => card.isMain === true);

    if (!mainUserCard) {
      checkIfCardExists.isMain = true;

      await this.userCardsRepository.save(checkIfCardExists);
    } else {
      mainUserCard.isMain = false;

      checkIfCardExists.isMain = true;

      await this.userCardsRepository.save(checkIfCardExists);
      await this.userCardsRepository.save(mainUserCard);
    }
  }
}
