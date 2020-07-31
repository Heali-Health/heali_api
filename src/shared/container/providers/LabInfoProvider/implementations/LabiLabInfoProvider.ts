import axios from 'axios';
import { container } from 'tsyringe';

import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import ListLabsFromCompanyService from '@modules/labs/services/ListLabsFromCompanyService';
import ListOriginalExamsFromLabsService from '@modules/exams/services/ListOriginalExamsFromLabsService';
import SlugPkgSlugTransformationProvider from '../../SlugTransformationProvider/implementations/SlugPkgSlugTransformationProvider';
import ILabInfoProvider from '../models/ILabInfoProvider';
import ILabiLabInfoDTO from '../dtos/ILabiLabInfoDTO';
import ILabiExamsInfoDTO from '../dtos/ILabiExamsInfoDTO';

export default class LabiLabInfoProvider implements ILabInfoProvider {
  private api = axios;

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    const labiLabsApiResponse = await this.api.get(
      'https://wp.labiexames.com.br//wp-json/api/units',
    );
    const labiLabs: ILabiLabInfoDTO[] = labiLabsApiResponse.data;

    const slugTransformation = container.resolve(
      SlugPkgSlugTransformationProvider,
    );

    const labi = labiLabs.map(labiLab => {
      const lab: ICreateLabDTO = {
        title: labiLab.title,
        slug: `labi-exames-${slugTransformation.transform(labiLab.title)}`,
        company_id: process.env.ID_LABI ? process.env.ID_LABI : '',
        original_id: labiLab.id.toString(),
        company_id_original_id: `3b20687a-beec-4e83-b875-53c5f07c0e77${labiLab.id.toString()}`,
        address: `${labiLab.address.r} - ${labiLab.address.b} - ${labiLab.address.cep}`,
        city: labiLab.address.city,
        latitude: labiLab.address.location.lat,
        longitude: labiLab.address.location.lng,
        collect_hour: labiLab.collect_hour,
        open_hour: labiLab.results_hour,
      };

      return lab;
    });

    return labi;
  }

  public async getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    const labiExamsApiResponse = await this.api.get(
      'https://wp.labiexames.com.br//wp-json/api/exams',
    );
    const labiOriginalExams: ILabiExamsInfoDTO[] =
      labiExamsApiResponse.data.items;

    const labiLabs = await listLabsFromCompany.execute(
      process.env.ID_LABI ? process.env.ID_LABI : '',
    );

    const preAdjustedLabi = labiLabs.map(labiLab => {
      const labiLabOriginalExams = labiOriginalExams.map(labiOriginalExam => {
        const labiLabOriginalExam = {
          title: labiOriginalExam.title,
          exam_original_id: labiOriginalExam.id.toString(),
          lab_id: labiLab.id,
          lab_id_exam_original_id: `${
            labiLab.id
          }${labiOriginalExam.id.toString()}`,
        };

        return labiLabOriginalExam;
      });

      return labiLabOriginalExams;
    });

    const labi = preAdjustedLabi.reduce((result, current) => {
      result.push(...current);

      return result;
    });

    return labi;
  }

  public async getPricesInfo(): Promise<ICreatePriceDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    const listOriginalExams = container.resolve(
      ListOriginalExamsFromLabsService,
    );

    const labiExamsApiResponse = await this.api.get(
      'https://wp.labiexames.com.br//wp-json/api/exams',
    );
    const labiExamsAndPricesInfo: ILabiExamsInfoDTO[] =
      labiExamsApiResponse.data.items;

    const labiLabs = await listLabsFromCompany.execute(
      process.env.ID_LABI ? process.env.ID_LABI : '',
    );

    const labiLabsIds = labiLabs.map(labiLab => labiLab.id);

    const labiOriginalExams = await listOriginalExams.execute(labiLabsIds);

    const labi = labiOriginalExams.map(labiOriginalExam => {
      const priceIndex = labiExamsAndPricesInfo.findIndex(
        labiInfo =>
          labiInfo.id.toString() === labiOriginalExam.exam_original_id,
      );

      const labiPrice: ICreatePriceDTO = {
        original_exam_id: labiOriginalExam.id,
        lab_id: labiOriginalExam.lab_id,
        price: parseFloat(labiExamsAndPricesInfo[priceIndex].price),
        lab_id_exam_original_id: labiOriginalExam.lab_id_exam_original_id,
      };

      return labiPrice;
    });

    return labi;
  }
}
