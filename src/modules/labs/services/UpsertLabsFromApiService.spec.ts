import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import FakeLabInfoProvider from '@shared/container/providers/LabInfoProvider/fakes/FakeLabInfoProvider';
import UpsertLabsFromApiService from './UpsertLabsFromApiService';

let fakeLabsRepository: FakeLabsRepository;
let fakeLabInfoProvider: FakeLabInfoProvider;
let upsertLabsFromApi: UpsertLabsFromApiService;

describe('UpsertLabsFromApi', () => {
  beforeEach(() => {
    fakeLabsRepository = new FakeLabsRepository();
    fakeLabInfoProvider = new FakeLabInfoProvider();
    upsertLabsFromApi = new UpsertLabsFromApiService(
      fakeLabsRepository,
      fakeLabInfoProvider,
    );
  });

  it('should be able to insert new labs from a bulk upsert origin', async () => {
    const lab = await upsertLabsFromApi.execute();

    expect(lab).toHaveLength(2);
  });

  it('should be able to update new labs from a bulk upsert origin', async () => {
    await fakeLabsRepository.create({
      title: 'Test',
      slug: 'test',
      company_id: '3b20687a-beec-4e83-b875-53c5f07c0e77',
      original_id: '44120',
      company_id_original_id: '3b20687a-beec-4e83-b875-53c5f07c0e7744120',
      address: 'Address',
      city: 'Test City',
      latitude: -22,
      longitude: -46,
      collect_hour: 'Whenever',
      open_hour: 'Always',
    });

    await upsertLabsFromApi.execute();

    const labs = await fakeLabsRepository.findAll();

    const [lab1, lab2] = labs;

    expect(labs).toHaveLength(2);
    expect(lab1.title).toBe('Unidade Penha (temporariamente fechada)');
    expect(lab2.title).toBe('Unidade Vila Olímpia (temporariamente fechada)');
  });
});
