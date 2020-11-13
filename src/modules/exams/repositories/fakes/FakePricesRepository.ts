import { uuid } from 'uuidv4';
import { max } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Price from '@modules/exams/infra/typeorm/entities/Price';
import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';

export default class FakePricesRepository implements IPricesRepository {
  private prices: Price[] = [];

  public async create(priceData: ICreatePriceDTO): Promise<Price> {
    const price = new Price();

    Object.assign(
      price,
      { id: uuid() },
      priceData,
      { created_date: new Date(Date.now()) },
      { updated_date: new Date(Date.now()) },
    );

    this.prices.push(price);

    return price;
  }

  public async save(price: Price): Promise<Price> {
    const findIndex = this.prices.findIndex(
      findPrice => findPrice.id === price.id,
    );

    this.prices[findIndex] = price;

    return price;
  }

  public async saveMany(prices: Price[]): Promise<Price[]> {
    const updatedPrices = prices.map(price => {
      const findIndex = this.prices.findIndex(
        findPrice => findPrice.id === price.id,
      );

      this.prices[findIndex] = price;

      return price;
    });

    return updatedPrices;
  }

  public async findAllRecentByExamsIds(
    exams_ids: string[] | string,
  ): Promise<Price[]> {
    const matchedPrices = this.prices.filter(price =>
      exams_ids.includes(price.exam_id),
    );

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

      const recentPriceIndex = labExamPrices.findIndex(
        price => price.created_date.getTime() === maxCreatedDate.getTime(),
      );

      const recentPrice = labExamPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findAllRecentByExamsSlugs(
    examsSlugs: string[] | string,
  ): Promise<Price[]> {
    const matchedPrices = this.prices.filter(price =>
      examsSlugs.includes(price.exam.slug),
    );

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

      const recentPriceIndex = labExamPrices.findIndex(
        price => price.created_date.getTime() === maxCreatedDate.getTime(),
      );

      const recentPrice = labExamPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findAllRecentByExamsAndLab(
    examIds: string[],
    labId: string,
  ): Promise<Price[]> {
    const labPrices = this.prices.filter(price => price.lab_id === labId);

    const matchedPrices = labPrices.filter(price =>
      examIds.includes(price.exam.id),
    );

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

      const recentPriceIndex = labExamPrices.findIndex(
        price => price.created_date.getTime() === maxCreatedDate.getTime(),
      );

      const recentPrice = labExamPrices[recentPriceIndex];

      return recentPrice;
    });

    return recentMatchedPrices;
  }

  public async findByIds(id: string | string[]): Promise<Price[]> {
    return this.prices.filter(price => {
      if (Array.isArray(id)) {
        return id.includes(price.id);
      }
      return id === price.id;
    });
  }

  public async findByOriginalExamIdsArray(
    original_exams_ids: string[],
  ): Promise<Price[]> {
    const originalExamPrices = this.prices.filter(price =>
      original_exams_ids.includes(price.original_exam_id),
    );

    return originalExamPrices;
  }

  public async insertPrices(priceData: ICreatePriceDTO[]): Promise<Price[]> {
    const insertedPrices = priceData.map(priceToUpsert => {
      const newPrice = new Price();

      Object.assign(newPrice, { id: uuid() }, priceToUpsert);

      this.prices.push(newPrice);

      return newPrice;
    });

    return insertedPrices;
  }
}
