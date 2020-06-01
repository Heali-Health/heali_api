import FakeOriginalExamsRepository from '@modules/exams/repositories/fakes/FakeOriginalExamsRepository';
import FakeLabInfoProvider from '@shared/container/providers/LabInfoProvider/fakes/FakeLabInfoProvider';
import UpsertOriginalExamsFromApiService from './UpsertOriginalExamsFromApiService';

let fakeOriginalExamsRepository: FakeOriginalExamsRepository;
let fakeLabInfoProvider: FakeLabInfoProvider;
let upsertOriginalExamsFromApi: UpsertOriginalExamsFromApiService;

describe('UpsertOriginalExamsFromApi', () => {
  beforeEach(() => {
    fakeOriginalExamsRepository = new FakeOriginalExamsRepository();
    fakeLabInfoProvider = new FakeLabInfoProvider();
    upsertOriginalExamsFromApi = new UpsertOriginalExamsFromApiService(
      fakeOriginalExamsRepository,
      fakeLabInfoProvider,
    );
  });

  it('should be able to insert new original exams from a bulk upsert origin', async () => {
    const originalExam = await upsertOriginalExamsFromApi.execute();

    expect(originalExam).toHaveLength(14);
  });
});
