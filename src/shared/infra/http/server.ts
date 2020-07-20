import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

/// MIGRAR PARA SERVIDOR DE FILAS ///
// import { container } from 'tsyringe';
/// ///

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';

/// MIGRAR PARA SERVIDOR DE FILAS ///
// import '@shared/container/providers/QueueProvider';

// import ProcessUserEmailQueueService from '@modules/users/services/ProcessUserEmailQueueService';
///
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());
// midleware para servir arquivos estáticos
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

// tratativa dos erros precisar ser depois das rotas
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  // verificar se o erro é uma instância do AppError
  if (err instanceof AppError) {
    // Se sim, significa que é um erro originado pela aplicação, conhecido
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀Server started on port 3333🚀');
});

/// MIGRAR PARA SERVIDOR DE FILAS ///
// const processUserMailQueue = container.resolve(ProcessUserEmailQueueService);

// processUserMailQueue.execute();

// console.log('⚗‎‎  Processing queue!');
/// ///
