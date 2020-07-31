import { container, registry } from 'tsyringe';

import LabInfoProvider from '@shared/container/providers/LabInfoProvider/implementations/LabInfoProvider';
import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';
import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import LabiLabInfoProvider from './implementations/LabiLabInfoProvider';
import CdCLabInfoProvider from './implementations/CdCLabInfoProvider';

@registry([
  {
    token: 'LabInfoProvider',
    useToken: LabiLabInfoProvider,
  },
  {
    token: 'LabInfoProvider',
    useToken: CdCLabInfoProvider,
  },
])
export default class LabInfoProviders implements ILabInfoProvider {
  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    const labsInfoProvider = container.resolveAll<ILabInfoProvider>(
      'LabInfoProvider',
    );

    const companiesLabsPromise = labsInfoProvider.map(async companyLabs => {
      const labs = await companyLabs.getLabsInfo();

      return labs;
    });

    const companiesLabsArray = await Promise.all(companiesLabsPromise);

    const companiesLabs = companiesLabsArray.reduce((result, current) => {
      result.push(...current);

      return result;
    });

    return companiesLabs;
  }

  public async getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]> {
    const labsInfoProvider = container.resolveAll<ILabInfoProvider>(
      'LabInfoProvider',
    );

    const companiesOriginalExamsPromise = labsInfoProvider.map(
      async companyOriginalExams => {
        const originalExams = await companyOriginalExams.getOriginalExamsInfo();

        return originalExams;
      },
    );

    const companiesOriginalExamsArray = await Promise.all(
      companiesOriginalExamsPromise,
    );

    const companiesOriginalExams = companiesOriginalExamsArray.reduce(
      (result, current) => {
        result.push(...current);

        return result;
      },
    );

    return companiesOriginalExams;
  }

  public async getPricesInfo(): Promise<ICreatePriceDTO[]> {
    const labsInfoProvider = container.resolveAll<ILabInfoProvider>(
      'LabInfoProvider',
    );

    const companiesPricesPromise = labsInfoProvider.map(async companyPrices => {
      const prices = await companyPrices.getPricesInfo();

      return prices;
    });

    const companiesPricesArray = await Promise.all(companiesPricesPromise);

    const companiesPrices = companiesPricesArray.reduce((result, current) => {
      result.push(...current);

      return result;
    });

    return companiesPrices;
  }
}

container.registerInstance<ILabInfoProvider>(
  'LabInfoProvider',
  container.resolve(LabInfoProvider),
);

// container.registerInstance<ILabInfoProvider>(
//   'LabInfoProvider',
//   container.resolve(LabInfoProvider),
// );
