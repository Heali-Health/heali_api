import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IDistanceProvider from '@shared/container/providers/DistanceProvider/models/IDistanceProvider';
import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import IPricesRepository from '../repositories/IPricesRepository';
import ILabPricesResultsDTO from '../dtos/ILabPricesResultsDTO';
import IListLabPricesDTO from '../dtos/IListLabPricesDTO';
import IExamsRepository from '../repositories/IExamsRepository';

@injectable()
export default class ListSelectedLatestPricesFromLabService {
  constructor(
    @inject('PricesRepository')
    private pricesRepository: IPricesRepository,

    @inject('LabsRepository')
    private labsRepository: ILabsRepository,

    @inject('DistanceProvider')
    private distanceProvider: IDistanceProvider,

    @inject('ExamsRepository')
    private examsRepository: IExamsRepository,
  ) {}

  public async execute({
    labId,
    labSlug,
    examIds,
    examSlugs,
    location,
  }: IListLabPricesDTO): Promise<ILabPricesResultsDTO> {
    if (!examIds && !examSlugs) {
      throw new AppError('No exam info was provided');
    }

    if (!labId && !labSlug) {
      throw new AppError('No lab info was provided');
    }

    const lab = labId
      ? await this.labsRepository.findById(labId)
      : labSlug && (await this.labsRepository.findBySlug(labSlug));

    if (!lab) {
      throw new AppError('Lab not found');
    }

    const labIdToQueryPrices = lab.id;

    const exams = examIds
      ? await this.examsRepository.findByExamIds(examIds)
      : examSlugs && (await this.examsRepository.findByExamSlugs(examSlugs));

    if (!exams) {
      throw new AppError('Exams not found');
    }

    const examIdsToQueryPrices = exams.map(exam => exam.id);

    const prices = await this.pricesRepository.findAllRecentByExamsAndLab(
      examIdsToQueryPrices,
      labIdToQueryPrices,
    );

    const distance = this.distanceProvider.calculateInKms({
      latitude1: Number(lab.latitude),
      longitude1: Number(lab.longitude),
      latitude2: location.latitude,
      longitude2: location.longitude,
    });

    const exams_found = prices.length;

    let total_examsI = 0;
    let total_examsII = 0;

    if (examIds) {
      if (Array.isArray(examIds)) {
        total_examsI = examIds.length;
      } else {
        total_examsI = 1;
      }
    }

    if (examSlugs) {
      if (Array.isArray(examSlugs)) {
        total_examsII = examSlugs.length;
      } else {
        total_examsII = 1;
      }
    }

    const total_exams = total_examsI + total_examsII;

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
