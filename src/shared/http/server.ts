import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import cors from 'cors';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(pagination);
app.use(express.urlencoded({ extended: true }));
app.use('./uploads', express.static(uploadConfig.directory));
app.use(routes);
app.use(errors());

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response
        .status(error.statusCode)
        .json({ status: 'error', message: error.message });
    }

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  },
);

app.listen(process.env.PORT);
