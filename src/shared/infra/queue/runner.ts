import 'dotenv/config';
import 'reflect-metadata';
// import * as Sentry from '@sentry/node';
// import sentryConfig from '@config/sentry';

import { container } from 'tsyringe';

import '@shared/container/providers/MailTemplateProvider';
import '@shared/container/providers/MailProvider';
import '@shared/container/providers/QueueProvider';
// import '@shared/infra/mongoose/connection';

import '@shared/infra/typeorm';
import '@shared/container';

import ProcessUserEmailQueueService from '@modules/users/services/ProcessUserEmailQueueService';

// Sentry.init({ dsn: sentryConfig.dsn });

const processUserMailQueue = container.resolve(ProcessUserEmailQueueService);

processUserMailQueue.execute();

console.log('⚗‎‎  Processing queue!');
