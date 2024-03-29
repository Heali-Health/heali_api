import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { inject, injectable } from 'tsyringe';
import { OAuth2Client } from 'google-auth-library';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  googleTokenId: string;
}

interface IResponse {
  user: User;
  token: string;
  new_user: boolean;
}

@injectable()
export default class AuthenticateGoogleUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  public async execute({ googleTokenId }: IRequest): Promise<IResponse> {
    const ticket = await this.client.verifyIdToken({
      idToken: googleTokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError('Google did not recognise the user');
    }

    const first_name = payload.given_name;
    const last_name = payload.family_name;
    const { email } = payload;
    const avatar = payload.picture;

    if (!email) {
      throw new AppError('Google did not recognise the user email');
    }

    const user = await this.usersRepository.findByEmail(email);

    const { secret, expiresIn } = authConfig.jwt;

    if (!user) {
      const createdUser = await this.usersRepository.create({
        first_name: first_name || '',
        last_name: last_name || '',
        email,
        password: '',
        avatar,
        uploaded_avatar: false,
        defined_password: false,
      });

      const token = sign({}, secret, {
        subject: createdUser.id,
        expiresIn,
      });

      return {
        user: createdUser,
        token,
        new_user: true,
      };
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;

    if (user.uploaded_avatar === false) {
      user.avatar = avatar || user.avatar;
    }

    await this.usersRepository.save(user);

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
      new_user: false,
    };
  }
}
