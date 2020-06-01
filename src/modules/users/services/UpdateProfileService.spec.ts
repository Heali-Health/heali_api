import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_whatsapp: '2345678',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      first_name: 'John',
      last_name: 'Trê',
      email: 'johntre@example.com',
      phone_whatsapp: '2345678',
    });

    expect(updatedUser.first_name).toBe('John');
    expect(updatedUser.last_name).toBe('Trê');
    expect(updatedUser.email).toBe('johntre@example.com');
  });

  it('should not be able to update the user`s email to an already used email', async () => {
    await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone_whatsapp: '2345678',
    });

    const user = await fakeUsersRepository.create({
      first_name: 'Test',
      last_name: 'Feature',
      email: 'test@example.com',
      password: '123456',
      phone_whatsapp: '2345678',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        phone_whatsapp: '2345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update an user`s password', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_whatsapp: '2345678',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      first_name: 'John',
      last_name: 'Trê',
      email: 'johntre@example.com',
      phone_whatsapp: '2345678',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to change an user password without informing its old password', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_whatsapp: '2345678',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Trê',
        email: 'johntre@example.com',
        phone_whatsapp: '2345678',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change an user password informing its wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_whatsapp: '2345678',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        first_name: 'John',
        last_name: 'Trê',
        email: 'johntre@example.com',
        phone_whatsapp: '2345678',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile from non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        first_name: 'John',
        last_name: 'Trê',
        email: 'johntre@example.com',
        phone_whatsapp: '2345678',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
