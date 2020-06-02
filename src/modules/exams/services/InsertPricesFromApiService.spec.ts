import FakePricesRepository from '@modules/exams/repositories/fakes/FakePricesRepository';
import FakeLabInfoProvider from '@shared/container/providers/LabInfoProvider/fakes/FakeLabInfoProvider';
import InsertPricesFromApiService from './InsertPricesFromApiService';

let fakePricesRepository: FakePricesRepository;
let fakeLabInfoProvider: FakeLabInfoProvider;
let insertPricesFromApi: InsertPricesFromApiService;

describe('InsertPricesFromApi', () => {
  beforeEach(() => {
    fakePricesRepository = new FakePricesRepository();
    fakeLabInfoProvider = new FakeLabInfoProvider();
    insertPricesFromApi = new InsertPricesFromApiService(
      fakePricesRepository,
      fakeLabInfoProvider,
    );
  });

  it('should be able to insert new original exams from a bulk upsert origin', async () => {
    const originalExam = await insertPricesFromApi.execute();

    expect(originalExam).toHaveLength(14);
  });
});
