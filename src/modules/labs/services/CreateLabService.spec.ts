import AppError from '@shared/errors/AppError';

import FakeLabsRepository from '@modules/labs/repositories/fakes/FakeLabsRepository';
import CreateLabService from './CreateLabService';

let fakeLabsRepository: FakeLabsRepository;
let createLab: CreateLabService;

describe('CreateLab', () => {
  beforeEach(() => {
    fakeLabsRepository = new FakeLabsRepository();
    createLab = new CreateLabService(fakeLabsRepository);
  });

  it('should be able to create a new lab', async () => {
    const lab = await createLab.execute({
      title: 'Sherlock`s lab',
      company_id: '123456',
      original_id: '007',
      address: 'Backer St.',
      city: 'London',
      state: 'London',
      latitude: 1.521456,
      longitude: 1.68741,
      collect_hour: '06h00',
      open_hour: '22h00',
    });

    expect(lab).toHaveProperty(`id`);
    expect(lab.title).toBe('Sherlock`s lab');
    expect(lab.address).toBe('Backer St.');
  });

  it('should not be able to create an lab with an existing company/original_id', async () => {
    await createLab.execute({
      title: 'Sherlock`s lab',
      company_id: '123456',
      original_id: '007',
      address: 'Backer St.',
      city: 'London',
      state: 'London',
      latitude: 1.521456,
      longitude: 1.68741,
      collect_hour: '06h00',
      open_hour: '22h00',
    });

    await expect(
      createLab.execute({
        title: 'Sherlock`s lab',
        company_id: '123456',
        original_id: '007',
        address: 'Backer St.',
        city: 'London',
        state: 'London',
        latitude: 1.521456,
        longitude: 1.68741,
        collect_hour: '06h00',
        open_hour: '22h00',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
