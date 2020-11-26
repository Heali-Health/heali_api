import { container } from 'tsyringe';

import '@modules/users/providers';
import '@shared/container/providers';

import IPatientsRepository from '@modules/users/repositories/IPatientsRepository';
import PatientsRepository from '@modules/users/infra/typeorm/repositories/PatientsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import IQuotesRepository from '@modules/quotes/repositories/IQuotesRepository';
import QuotesRepository from '@modules/quotes/infra/typeorm/repositories/QuotesRepository';

import IExamsRepository from '@modules/exams/repositories/IExamsRepository';
import ExamsRepository from '@modules/exams/infra/typeorm/repositories/ExamsRepository';

import ILabsRepository from '@modules/labs/repositories/ILabsRepository';
import LabsRepository from '@modules/labs/infra/typeorm/repositories/LabsRepository';

import IOriginalExamsRepository from '@modules/exams/repositories/IOriginalExamsRepository';
import OriginalExamsRepository from '@modules/exams/infra/typeorm/repositories/OriginalExamsRepository';

import IPricesRepository from '@modules/exams/repositories/IPricesRepository';
import PricesRepository from '@modules/exams/infra/typeorm/repositories/PricesRepository';

import IBagsRepository from '@modules/bags/repositories/IBagsRepository';
import BagsRepository from '@modules/bags/infra/typeorm/repositories/BagsRepository';
import IUserCardsRepository from '@modules/payments/repositories/IUserCardsRepository';
import UserCardsRepository from '@modules/payments/infra/typeorm/repositories/UserCardsRepository';
import IPaymentsRepository from '@modules/payments/repositories/IPaymentsRepository';
import PaymentsRepository from '@modules/payments/infra/typeorm/repositories/PaymentsRepository';

container.registerSingleton<IPatientsRepository>(
  'PatientsRepository',
  PatientsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<IQuotesRepository>(
  'QuotesRepository',
  QuotesRepository,
);

container.registerSingleton<IExamsRepository>(
  'ExamsRepository',
  ExamsRepository,
);

container.registerSingleton<ILabsRepository>('LabsRepository', LabsRepository);

container.registerSingleton<IOriginalExamsRepository>(
  'OriginalExamsRepository',
  OriginalExamsRepository,
);

container.registerSingleton<IPricesRepository>(
  'PricesRepository',
  PricesRepository,
);

container.registerSingleton<IBagsRepository>('BagsRepository', BagsRepository);

container.registerSingleton<IUserCardsRepository>(
  'UserCardsRepository',
  UserCardsRepository,
);

container.registerSingleton<IPaymentsRepository>(
  'PaymentsRepository',
  PaymentsRepository,
);
