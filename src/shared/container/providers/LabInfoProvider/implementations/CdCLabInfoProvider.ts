import axios from 'axios';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import ListLabsFromCompanyService from '@modules/labs/services/ListLabsFromCompanyService';
import ListOriginalExamsFromLabsService from '@modules/exams/services/ListOriginalExamsFromLabsService';
import SlugPkgSlugTransformationProvider from '../../SlugTransformationProvider/implementations/SlugPkgSlugTransformationProvider';
import ILabInfoProvider from '../models/ILabInfoProvider';
import ICdCLabInfoDTO from '../dtos/ICdCLabInfoDTO';
import ICdCLabInfoDetailDTO from '../dtos/ICdCLabInfoDetailDTO';
import ICdCExamsInfoDTO from '../dtos/ICdCExamsInfoDTO';

export default class CdCLabInfoProvider implements ILabInfoProvider {
  private api = axios;

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    const slugTransformation = container.resolve(
      SlugPkgSlugTransformationProvider,
    );

    const cdCLabsApiResponse = await this.api.get(
      'https://ciadaconsulta.com.br/api/company/list',
    );
    const cdCLabs: ICdCLabInfoDTO[] = cdCLabsApiResponse.data.content;

    const ciaDaConsultaPromise = cdCLabs.map(async cdcLab => {
      try {
        const labDetailApiResponse = await this.api.get(
          `https://ciadaconsulta.com.br/api/company/getBySlugName?slugName=${cdcLab.slugName}`,
        );

        const cdcLabDetail: ICdCLabInfoDetailDTO =
          labDetailApiResponse.data.content;

        const lab: ICreateLabDTO = {
          title: cdcLabDetail.tradingName,
          slug: `cia-da-consulta-${slugTransformation.transform(
            cdcLabDetail.tradingName,
          )}`,
          company_id: '060c2b76-9410-4ea8-ab0d-cc9ef27c7650',
          original_id: cdcLabDetail.id.toString(),
          company_id_original_id: `060c2b76-9410-4ea8-ab0d-cc9ef27c7650${cdcLabDetail.id.toString()}`,
          address: `${cdcLabDetail.address.address}, ${cdcLabDetail.address.addressNumber} - ${cdcLabDetail.address.neighborhood} - ${cdcLabDetail.address.zipCode}`,
          city: '',
          latitude: cdcLabDetail.latitude,
          longitude: cdcLabDetail.longitude,
          collect_hour: cdcLabDetail.collectionHours,
          open_hour: cdcLabDetail.openingHours,
        };

        return lab;
      } catch (err) {
        console.log(err);
        throw new AppError(`Erro na API: ${cdcLab.slugName} | ${err}`);
      }
    });

    const ciaDaConsulta = await Promise.all(ciaDaConsultaPromise);

    return ciaDaConsulta;
  }

  public async getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    const cdcExamsApiResponse = await this.api.get(
      'https://ciadaconsulta.com.br/api/exams/list',
    );

    const cdcOriginalExams: ICdCExamsInfoDTO[] =
      cdcExamsApiResponse.data.content;

    const cdcLabs = await listLabsFromCompany.execute(
      '060c2b76-9410-4ea8-ab0d-cc9ef27c7650',
    );

    // Exames de análises clínicas
    const clinicalAnalysisExams = cdcOriginalExams.filter(
      exam => exam.type === 'CIA - Análises Clínicas',
    );

    const preAdjustedClininalAnalysisCdc = cdcLabs.map(cdcLab => {
      const cdcLabOriginalExams = clinicalAnalysisExams.map(cdcOriginalExam => {
        const cdcLabOriginalExam = {
          title: cdcOriginalExam.name,
          exam_original_id: cdcOriginalExam.id.toString(),
          lab_id: cdcLab.id,
          lab_id_exam_original_id: `${
            cdcLab.id
          }${cdcOriginalExam.id.toString()}`,
        };

        return cdcLabOriginalExam;
      });

      return cdcLabOriginalExams;
    });

    const clinicalAnalysisCdc = preAdjustedClininalAnalysisCdc.reduce(
      (result, current) => {
        result.push(...current);
        return result;
      },
    );

    // Exames específicos de cada unidade
    const preAdjustedLabSpecificExamsPromise = cdcLabs.map(async lab => {
      const cdcLabSpecificExamsApi = await this.api.get(
        `https://ciadaconsulta.com.br/api/exams/getByUnitId?unitId=${lab.original_id}`,
      );

      const cdcLabRawOriginalExams: ICdCExamsInfoDTO[] =
        cdcLabSpecificExamsApi.data.content;

      const cdcLabOriginalExams = cdcLabRawOriginalExams.map(exam => {
        const cdcLabOriginalExam = {
          title: exam.name,
          exam_original_id: exam.id.toString(),
          lab_id: lab.id,
          lab_id_exam_original_id: `${lab.id}${exam.id.toString()}`,
        };

        return cdcLabOriginalExam;
      });

      return cdcLabOriginalExams;
    });

    const preAdjustedLabSpecificExams = await Promise.all(
      preAdjustedLabSpecificExamsPromise,
    );

    const labSpecificExamsCdc = preAdjustedLabSpecificExams.reduce(
      (result, current) => {
        result.push(...current);

        return result;
      },
    );

    console.log('Cia da Consulta exams organized');

    const cdc = [...clinicalAnalysisCdc, ...labSpecificExamsCdc];

    return cdc;
  }

  public async getPricesInfo(): Promise<ICreatePriceDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    const listOriginalExams = container.resolve(
      ListOriginalExamsFromLabsService,
    );

    const cdcExamsApiResponse = await this.api.get(
      'https://ciadaconsulta.com.br/api/exams/list',
    );

    const cdcPrices: ICdCExamsInfoDTO[] = cdcExamsApiResponse.data.content;

    const cdcLabs = await listLabsFromCompany.execute(
      '060c2b76-9410-4ea8-ab0d-cc9ef27c7650',
    );

    const cdcLabsIds = cdcLabs.map(cdcLab => cdcLab.id);

    const cdcOriginalExams = await listOriginalExams.execute(cdcLabsIds);

    const cdc = cdcOriginalExams.map(cdcOriginalExam => {
      const priceIndex = cdcPrices.findIndex(
        cdcInfo => cdcInfo.id.toString() === cdcOriginalExam.exam_original_id,
      );

      const cdcPrice: ICreatePriceDTO = {
        original_exam_id: cdcOriginalExam.id,
        lab_id: cdcOriginalExam.lab_id,
        price: cdcPrices[priceIndex].price,
        lab_id_exam_original_id: cdcOriginalExam.lab_id_exam_original_id,
      };

      return cdcPrice;
    });

    return cdc;
  }
}
