import { Repository, getRepository, In, QueryBuilder } from 'typeorm';
import { max } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

import Price from '@modules/exams/infra/typeorm/entities/Price';

export default class PricesRepository implements IPricesRepository {
  private ormRepository: Repository<Price>;

  constructor() {
    this.ormRepository = getRepository(Price);
  }

  public async create(priceData: ICreatePriceDTO): Promise<Price> {
    const price = this.ormRepository.create(priceData);

    await this.ormRepository.save(price);

    return price;
  }

  public async save(price: Price): Promise<Price> {
    return this.ormRepository.save(price);
  }

  public async saveMany(prices: Price[]): Promise<Price[]> {
    return this.ormRepository.save(prices, {
      chunk: 5000,
    });
  }

  public async findAllRecentByExamsIds(
    exams_ids: string[] | string,
  ): Promise<Price[]> {
    const matchedPrices = await this.ormRepository.find({
      where: {
        exam_id: Array.isArray(exams_ids) ? In(exams_ids) : exams_ids,
      },
    });

    const duplicatedMatchedLabsExams = matchedPrices.map(
      price => price.lab_id_exam_original_id,
    );

    const matchedLabsExams = Array.from(new Set(duplicatedMatchedLabsExams));

    const recentMatchedPrices = matchedLabsExams.map(labExam => {
      const labExamPrices = matchedPrices.filter(
        price => labExam === price.lab_id_exam_original_id,
      );

      const matchedCreatedDates = labExamPrices.map(
        price => price.created_date,
      );

      const maxCreatedDate = max(matchedCreatedDates);

      const recentPriceIndex = matchedPrices.findIndex(
        price =>
          price.created_date.getTime() === maxCreatedDate.getTime() &&
          price.lab_id_exam_original_id === labExam,
      );

      const recentPrice = matchedPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findAllRecentByExamsSlugs(
    examsSlugs: string[] | string,
  ): Promise<Price[]> {
    const examIdQuery = Array.isArray(examsSlugs)
      ? 'exam.slug IN (:...slug)'
      : 'exam.slug = :slug';

    const matchedPrices = await this.ormRepository
      .createQueryBuilder('price')
      .leftJoinAndSelect('price.exam', 'exam')
      .leftJoinAndSelect('price.lab', 'lab')
      .leftJoinAndSelect('lab.company', 'company')
      .where(examIdQuery, { slug: examsSlugs })
      .getMany();

    const duplicatedMatchedLabsExams = matchedPrices.map(
      price => price.lab_id_exam_original_id,
    );

    const matchedLabsExams = Array.from(new Set(duplicatedMatchedLabsExams));

    const recentMatchedPrices = matchedLabsExams.map(labExam => {
      const labExamPrices = matchedPrices.filter(
        price => labExam === price.lab_id_exam_original_id,
      );

      const matchedCreatedDates = labExamPrices.map(
        price => price.created_date,
      );

      const maxCreatedDate = max(matchedCreatedDates);

      const recentPriceIndex = matchedPrices.findIndex(
        price =>
          price.created_date.getTime() === maxCreatedDate.getTime() &&
          price.lab_id_exam_original_id === labExam,
      );

      const recentPrice = matchedPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findAllRecentByExamsAndLab(
    examIds: string[],
    labId: string,
  ): Promise<Price[]> {
    const matchedPrices = await this.ormRepository.find({
      where: {
        exam_id: In(examIds),
        lab_id: labId,
      },
    });

    const duplicatedMatchedLabsExams = matchedPrices.map(
      price => price.lab_id_exam_original_id,
    );

    const matchedLabsExams = Array.from(new Set(duplicatedMatchedLabsExams));

    const recentMatchedPrices = matchedLabsExams.map(labExam => {
      const labExamPrices = matchedPrices.filter(
        price => labExam === price.lab_id_exam_original_id,
      );

      const matchedCreatedDates = labExamPrices.map(
        price => price.created_date,
      );

      const maxCreatedDate = max(matchedCreatedDates);

      const recentPriceIndex = matchedPrices.findIndex(
        price =>
          price.created_date.getTime() === maxCreatedDate.getTime() &&
          price.lab_id_exam_original_id === labExam,
      );

      const recentPrice = matchedPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const prices = await this.ormRepository.find({
      where: {
        original_exam_id: In(original_exams_ids),
      },
    });

    return prices;
  }

  public async insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]> {
    const prices = this.ormRepository.create(priceData);

    await this.ormRepository.save(prices, {
      chunk: 5000,
    });

    return prices;
  }
}
