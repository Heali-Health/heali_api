import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';
import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import IPricesRepository from '../repositories/IPricesRepository';
import ILabPricesResultsDTO from '../dtos/ILabPricesResultsDTO';
import IListLabPricesDTO from '../dtos/IListLabPricesDTO';

@injectable()
export default class ListSelectedLatestPricesFromLabService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('LabsRepository')
    private labsRepository: ILabsRepository,

    @inject('DistanceProvider')
    private distanceProvider: IDistanceProvider,
  ) {}

  public async execute({
    exams_ids,
    lab_id,
    location,
  }: IListLabPricesDTO): Promise<ILabPricesResultsDTO> {
    const prices = await this.pricesRepository.findAllRecentByExamsIdsAndLab(
      exams_ids,
      lab_id,
    );

    const lab = await this.labsRepository.findById(lab_id);

    if (!lab) {
      throw new AppError('Lab not found');
    }

    const distance = this.distanceProvider.calculateInKms({
      latitude1: Number(lab.latitude),
      longitude1: Number(lab.longitude),
      latitude2: location.latitude,
      longitude2: location.longitude,
    });

    const exams_found = prices.length;

    const total_exams = exams_ids.length;

    const totalPrice = prices.reduce(
      (accumulator, currentValue) => accumulator + currentValue.price,
      0,
    );

    const searchResults = {
      prices,
      lab,
      distance,
      exams_found,
      total_exams,
      total_price: totalPrice,
    };

    return searchResults;
  }
}
