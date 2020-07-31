import axios, { AxiosInstance } from 'axios';
// import rateLimit from 'axios-rate-limit';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ListLabsFromCompanyService from '@modules/labs/services/ListLabsFromCompanyService';
import ListOriginalExamsFromLabsService from '@modules/exams/services/ListOriginalExamsFromLabsService';

import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import ILabiLabInfoDTO from '@shared/container/providers/LabInfoProvider/dtos/ILabiLabInfoDTO';
import ILabiExamsInfoDTO from '@shared/container/providers/LabInfoProvider/dtos/ILabiExamsInfoDTO';

import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
// import capitalizeWords from '@shared/utils/capitalizeWords';
import SlugPkgSlugTransformationProvider from '../../SlugTransformationProvider/implementations/SlugPkgSlugTransformationProvider';
import ICdCLabInfoDTO from '../dtos/ICdCLabInfoDTO';
import ICdCLabInfoDetailDTO from '../dtos/ICdCLabInfoDetailDTO';
import ICdCExamsInfoDTO from '../dtos/ICdCExamsInfoDTO';
import IDrcLabInfoDTO from '../dtos/IDrcLabInfoDTO';
import IDrcExamsDTO from '../dtos/IDrcExamsDTO';
import IDrcLabExamsDTO from '../dtos/IDrcLabExamsDTO';
// import ILavoLabsDTO from '../dtos/ILavoLabsDTO';
// import ILavoLabDetailsDTO from '../dtos/ILavoLabDetailsDTO';

type IRateLimitedAxiosInstance = AxiosInstance;
// interface IHTTP {
//   rateLimit(
//     axiosInstance: AxiosInstance,
//     options: {
//       maxRequests: number;
//       perMilliseconds: number;
//     },
//   ): IRateLimitedAxiosInstance;
// }
export default class LabInfoProvider implements ILabInfoProvider {
  private api = axios;

  // private http = rateLimit(axios.create(), {
  //   maxRequests: 1,
  //   perMilliseconds: 1000,
  //   // maxRPS: 2,
  // });

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    /*
    Labi Labs
    */
    const labiLabsApiResponse = await this.api.get(
      'https://wp.labiexames.com.br//wp-json/api/units',
    );
    const labiLabs: ILabiLabInfoDTO[] = labiLabsApiResponse.data;

    const slugTransformation = container.resolve(
      SlugPkgSlugTransformationProvider,
    );

    const labiPromise = labiLabs.map(async labiLab => {
      const lab: ICreateLabDTO = {
        title: labiLab.title,
        slug: `labi-exames-${slugTransformation.transform(labiLab.title)}`,
        company_id: process.env.ID_LABI ? process.env.ID_LABI : '',
        original_id: labiLab.id.toString(),
        company_id_original_id: `${
          process.env.ID_LABI ? process.env.ID_LABI : ''
        }${labiLab.id.toString()}`,
        address: `${labiLab.address.r} - ${labiLab.address.b} - ${labiLab.address.cep}`,
        city: labiLab.address.city,
        latitude: labiLab.address.location.lat,
        longitude: labiLab.address.location.lng,
        collect_hour: labiLab.collect_hour,
        open_hour: labiLab.results_hour,
      };

      return lab;
    });

    const labi = await Promise.all(labiPromise);

    /*
    Cia da Consulta Labs
    */

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
          company_id: process.env.ID_CDC ? process.env.ID_CDC : '',
          original_id: cdcLabDetail.id.toString(),
          company_id_original_id: `${
            process.env.ID_CDC ? process.env.ID_CDC : ''
          }${cdcLabDetail.id.toString()}`,
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

    /*
    Dr Consulta Labs
    */

    const drcLabsApiResponse = await this.api.get(
      'https://www.drconsulta.com/api/v2/get/unidades',
    );
    const drcLabs: IDrcLabInfoDTO[] = drcLabsApiResponse.data;

    const drcPromise = drcLabs.map(async drcLab => {
      const lab: ICreateLabDTO = {
        title: drcLab.nome,
        slug: `dr-consulta-${slugTransformation.transform(drcLab.nome)}`,
        company_id: process.env.ID_DRC ? process.env.ID_DRC : '',
        original_id: drcLab.id_unidade.toString(),
        company_id_original_id: `${
          process.env.ID_DRC ? process.env.ID_DRC : ''
        }${drcLab.id_unidade.toString()}`,
        address: `${drcLab.endereco} - ${drcLab.bairro}`,
        city: drcLab.cidade,
        state: drcLab.uf,
        latitude: drcLab.latitude,
        longitude: drcLab.longitude,
        collect_hour: drcLab.horario_coleta,
        open_hour: drcLab.horario,
      };

      return lab;
    });

    const drc = await Promise.all(drcPromise);

    /**
     * Lavoisier Labs
     */

    // const lavoLabsApiResponse = await this.api.get(
    //   'https://agendamentoonline.lavoisier.com.br/api/public/v2/unidade/',
    //   {
    //     headers: {
    //       'x-brand': 'LAVOISIER',
    //     },
    //   },
    // );

    // const lavoLabs: ILavoLabsDTO[] = lavoLabsApiResponse.data;
    // console.log(lavoLabs);

    // const lavoPromise = lavoLabs.map(async lavoLab => {
    //   const lavoLabDetailsAPIResponse = await this.http.get(
    //     `https://agendamentoonline.lavoisier.com.br/api/public/v2/unidade/${lavoLab.id}/detalhes`,
    //   );

    //   console.log(lavoLabDetailsAPIResponse.status);

    //   const lavoLabDetails: ILavoLabDetailsDTO = lavoLabDetailsAPIResponse.data;

    //   console.log(lavoLabDetails.nome);

    //   const lab: ICreateLabDTO = {
    //     title: capitalizeWords(lavoLab.nome),
    //     slug: `lavoisier-${slugTransformation.transform(lavoLab.nome)}`,
    //     company_id: '053c4118-33e3-45cb-b96b-c84f79cd90c6',
    //     original_id: lavoLab.id.toString(),
    //     company_id_original_id: `053c4118-33e3-45cb-b96b-c84f79cd90c6${lavoLab.id.toString()}`,
    //     address: `${capitalizeWords(lavoLab.endereco.logradouro)}, ${
    //       lavoLab.endereco.numero
    //     } - ${lavoLab.endereco.bairro} - ${lavoLab.endereco.cep}`,
    //     city: capitalizeWords(lavoLab.endereco.cidade),
    //     state: lavoLab.endereco.uf.toUpperCase(),
    //     latitude: lavoLab.latitude,
    //     longitude: lavoLab.longitude,
    //     collect_hour: lavoLabDetails.coleta.toString(),
    //     open_hour: lavoLabDetails.funcionamento.toString(),
    //   };

    //   return lab;
    // });

    // const lavo = await Promise.all(lavoPromise);

    /**
     * Delboni Labs
     */

    // const delboLabsApiResponse = await this.api.get(
    //   'https://agendamentoonline.lavoisier.com.br/api/public/v2/unidade/',
    //   {
    //     headers: {
    //       'x-brand': 'DELBONI',
    //     },
    //   },
    // );

    // const delboLabs: ILavoLabsDTO[] = delboLabsApiResponse.data;

    // const delboPromise = delboLabs.map(async delboLab => {
    //   const delboLabDetailsAPIResponse = await this.http.get(
    //     `https://agendamentoonline.lavoisier.com.br/api/public/v2/unidade/${delboLab.id}/detalhes`,
    //   );

    //   const delboLabDetails: ILavoLabDetailsDTO =
    //     delboLabDetailsAPIResponse.data;

    //   const lab: ICreateLabDTO = {
    //     title: capitalizeWords(delboLab.nome),
    //     slug: `lavoisier-${slugTransformation.transform(delboLab.nome)}`,
    //     company_id: '053c4118-33e3-45cb-b96b-c84f79cd90c6',
    //     original_id: delboLab.id.toString(),
    //     company_id_original_id: `053c4118-33e3-45cb-b96b-c84f79cd90c6${delboLab.id.toString()}`,
    //     address: `${capitalizeWords(delboLab.endereco.logradouro)}, ${
    //       delboLab.endereco.numero
    //     } - ${delboLab.endereco.bairro} - ${delboLab.endereco.cep}`,
    //     city: capitalizeWords(delboLab.endereco.cidade),
    //     state: delboLab.endereco.uf.toUpperCase(),
    //     latitude: delboLab.latitude,
    //     longitude: delboLab.longitude,
    //     collect_hour: delboLabDetails.coleta.toString(),
    //     open_hour: delboLabDetails.funcionamento.toString(),
    //   };

    //   return lab;
    // });

    // const delbo = await Promise.all(delboPromise);

    const labs = [...labi, ...ciaDaConsulta, ...drc];

    return labs;
  }

  public async getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    /*
    Labi Original Exams
    */

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

    console.log('Labi exams organized');

    /*
    Cia da Consulta Original Exams
    */

    const cdcExamsApiResponse = await this.api.get(
      'https://ciadaconsulta.com.br/api/exams/list',
    );

    const cdcOriginalExams: ICdCExamsInfoDTO[] =
      cdcExamsApiResponse.data.content;

    const cdcLabs = await listLabsFromCompany.execute(
      process.env.ID_CDC ? process.env.ID_CDC : '',
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

    /*
    Dr Consulta Original Exams
    */

    const drcLabs = await listLabsFromCompany.execute(
      process.env.ID_DRC ? process.env.ID_DRC : '',
    );

    const drcExamsApiResponse = await this.api.get(
      `https://www.drconsulta.com/api/v2/get/exames`,
    );

    const drcExams: IDrcExamsDTO[] = drcExamsApiResponse.data;

    const drcExamsNeedSchedule = drcExams.filter(
      exam => exam.agendavel !== null,
    );
    const drcExamsDontNeedSchedule = drcExams.filter(
      exam => exam.agendavel === null,
    );

    const drcPromiseNeedSchedule = drcExamsNeedSchedule.map(async exam => {
      try {
        const examLabsApiResponse = await this.api.get(
          `https://www.drconsulta.com/api/v2/get/agendamento/produto/unidades?id_produto=${exam.id_produto}`,
        );

        const correspondentLabs: IDrcLabExamsDTO[] = examLabsApiResponse.data;

        const correspondentLabsOriginalIds = correspondentLabs.map(lab =>
          lab.id_unidade.toString(),
        );

        const correspondentAddedLabs = drcLabs.filter(lab =>
          correspondentLabsOriginalIds.includes(lab.original_id),
        );

        const examLabs = correspondentAddedLabs.map(lab => {
          const examLab = {
            title: exam.nome,
            exam_original_id: exam.id_produto.toString(),
            lab_id: lab.id,
            lab_id_exam_original_id: `${lab.id}${exam.id_produto.toString()}`,
          };

          return examLab;
        });

        return examLabs;
      } catch (err) {
        console.log(`Failed to connect to Dr Consulta API on: ${exam.nome}`);

        throw new AppError(`Axios request error: ${err}`);
      }
    });

    const drcOriginalExamsNeedSchedule = await Promise.all(
      drcPromiseNeedSchedule,
    );

    const drcOriginalExamsDontNeedSchedule = drcExamsDontNeedSchedule.map(
      exam => {
        const examLabs = drcLabs.map(lab => {
          const examLab = {
            title: exam.nome,
            exam_original_id: exam.id_produto.toString(),
            lab_id: lab.id,
            lab_id_exam_original_id: `${lab.id}${exam.id_produto.toString()}`,
          };

          return examLab;
        });

        return examLabs;
      },
    );

    const drcBeforeAdjust = [
      ...drcOriginalExamsDontNeedSchedule,
      ...drcOriginalExamsNeedSchedule,
    ];

    const drc = drcBeforeAdjust.reduce((result, current) => {
      result.push(...current);
      return result;
    });

    console.log('Dr Consulta exams organized');

    const originalExams = [...labi, ...cdc, ...drc];

    return originalExams;
  }

  public async getPricesInfo(): Promise<ICreatePriceDTO[]> {
    const listLabsFromCompany = container.resolve(ListLabsFromCompanyService);

    const listOriginalExams = container.resolve(
      ListOriginalExamsFromLabsService,
    );

    /*
    Labi Prices
    */
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

    /*
    Cia da Consulta Prices
    */
    const cdcExamsApiResponse = await this.api.get(
      'https://ciadaconsulta.com.br/api/exams/list',
    );

    const cdcPrices: ICdCExamsInfoDTO[] = cdcExamsApiResponse.data.content;

    const cdcLabs = await listLabsFromCompany.execute(
      process.env.ID_CDC ? process.env.ID_CDC : '',
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

    /*
    Dr Consulta Prices
    */

    const drcLabs = await listLabsFromCompany.execute(
      process.env.ID_DRC ? process.env.ID_DRC : '',
    );

    const drcExamsApiResponse = await this.api.get(
      `https://www.drconsulta.com/api/v2/get/exames`,
    );

    const drcPrices: IDrcExamsDTO[] = drcExamsApiResponse.data;

    const drcLabsIds = drcLabs.map(lab => lab.id);

    const drcOriginalExams = await listOriginalExams.execute(drcLabsIds);

    const drc = drcOriginalExams.map(drcOriginalExam => {
      const priceIndex = drcPrices.findIndex(
        drcInfo =>
          drcInfo.id_produto.toString() === drcOriginalExam.exam_original_id,
      );

      const drcPrice: ICreatePriceDTO = {
        original_exam_id: drcOriginalExam.id,
        lab_id: drcOriginalExam.lab_id,
        price: drcPrices[priceIndex].preco_max,
        lab_id_exam_original_id: drcOriginalExam.lab_id_exam_original_id,
      };

      return drcPrice;
    });

    const prices = [...labi, ...cdc, ...drc];

    return prices;
  }
}
