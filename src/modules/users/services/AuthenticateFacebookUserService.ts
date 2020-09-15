import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';
import { inject, injectable } from 'tsyringe';
import axios from 'axios';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  facebookTokenId: string;
}

interface IResponse {
  user: User;
  token: string;
}

interface IFacebookAccessTokenResponse {
  access_token: string;
  token_type: string;
}

interface IFacebookDebugToken {
  data: {
    app_id: string;
    type: string;
    application: string;
    data_access_expires_at: number;
    expires_at: number;
    is_valid: boolean;
    user_id: string;
  };
}

interface IFacebookUserData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

@injectable()
export default class AuthenticateFacebookUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ facebookTokenId }: IRequest): Promise<IResponse> {
    try {
      const { data: accessTokenData } = await axios.get<
        IFacebookAccessTokenResponse
      >('https://graph.facebook.com/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          grant_type: 'client_credentials',
        },
      });

      const appAccessToken = accessTokenData.access_token;

      const { data: debugTokenData } = await axios.get<IFacebookDebugToken>(
        'https://graph.facebook.com/debug_token',
        {
          params: {
            input_token: facebookTokenId,
            access_token: appAccessToken,
          },
        },
      );

      const { is_valid } = debugTokenData.data;

      if (!is_valid) {
        throw new AppError('Facebook token is no longer valid');
      }

      const { data: userData } = await axios.get<IFacebookUserData>(
        'https://graph.facebook.com/me',
        {
          params: {
            fields: 'id,name,first_name,last_name,email,birthday,picture',
          },
          headers: {
            Authorization: `Bearer ${facebookTokenId}`,
          },
        },
      );

      const {
        first_name,
        last_name,
        email,
        picture: {
          data: { url: avatar },
        },
      } = userData;

      if (!email) {
        throw new AppError('Facebook did not recognise the user email');
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
        });

        const token = sign({}, secret, {
          subject: createdUser.id,
          expiresIn,
        });

        return {
          user: createdUser,
          token,
        };
      }

      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.avatar = avatar || user.avatar;
      user.first_name = first_name || user.first_name;

      await this.usersRepository.save(user);

      const token = sign({}, secret, {
        subject: user.id,
        expiresIn,
      });

      return {
        user,
        token,
      };
    } catch (err) {
      throw new AppError(
        `Facebook could not retrieve the information. Error: ${err}`,
      );
    }
  }
}
