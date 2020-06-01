import ILabInfoProvider from '@shared/container/providers/LabInfoProvider/models/ILabInfoProvider';

import ICreateLabDTO from '@modules/labs/dtos/ICreateLabDTO';
import ICreateOriginalExamDTO from '@modules/exams/dtos/ICreateOriginalExamDTO';
import ICreatePriceDTO from '@modules/exams/dtos/ICreatePriceDTO';
import fakeLabsFile from './fakeLabsFile.json';
import fakeExamsFile from './fakeExamsFile.json';

export default class FakeLabInfoProvider implements ILabInfoProvider {
  private labsToUpdate: ICreateLabDTO[] = [];

  private originalExamsToUpdate: ICreateOriginalExamDTO[] = [];

  private pricesToUpdate: ICreatePriceDTO[] = [];

  public async getLabsInfo(): Promise<ICreateLabDTO[]> {
    const fakeLabsToUpdate = fakeLabsFile.map(labiLab => {
      const lab: ICreateLabDTO = {
        title: labiLab.title,
        company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
        original_id: labiLab.id.toString(),
        company_id_original_id: `3b20687a-beec-4e83-b875-53c5f07c0e77${labiLab.id.toString()}`,
        address: `${labiLab.address.r} - ${labiLab.address.b} - ${labiLab.address.cep}`,
        city: labiLab.address.city,
        latitude: labiLab.address.location.lat,
        longitude: labiLab.address.location.lng,
        collect_hour: labiLab.results_hour,
        open_hour: labiLab.collect_hour,
      };
      return lab;
    });

    const addedLabsToUpdate = [...this.labsToUpdate, ...fakeLabsToUpdate];

    return addedLabsToUpdate;
  }

  public async getOriginalExamsInfo(): Promise<ICreateOriginalExamDTO[]> {
    const preAdjustedfakeOriginalExamsToUpdate = fakeLabsFile.map(labiLab => {
      const fakeLabOriginalExamsToUpdate = fakeExamsFile.map(
        labiOriginalExam => {
          const originalExam: ICreateOriginalExamDTO = {
            title: labiOriginalExam.title,
            exam_original_id: labiOriginalExam.id.toString(),
            lab_id: labiLab.id.toString(),
            lab_id_exam_original_id: `${labiLab.id.toString()}${labiOriginalExam.id.toString()}`,
          };

          return originalExam;
        },
      );

      return fakeLabOriginalExamsToUpdate;
    });

    const fakeOriginalExamsToUpdate = preAdjustedfakeOriginalExamsToUpdate.reduce(
      (result, current) => {
        result.push(...current);
        return result;
      },
    );

    const addedOriginalExamsToUpdate = [
      ...this.originalExamsToUpdate,
      ...fakeOriginalExamsToUpdate,
    ];

    return addedOriginalExamsToUpdate;
  }

  public async getPricesInfo(): Promise<ICreatePriceDTO[]> {
    return this.pricesToUpdate;
  }
}
