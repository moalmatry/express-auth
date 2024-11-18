/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import config from 'config';
import express, { NextFunction, Request, Response } from 'express';
import router from './routes';
import AppError from './utils/AppError';
// import connectToDb from './utils/connectToDb';
import log from './utils/logger';
import globalErrorHandler from './controller/error.controller';
import { CustomRequest } from './types';

const app = express();

// bodyParser alternative
app.use(express.json());

app.use((req: CustomRequest, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
// start routes
app.use(router);
// NOTE: this route will catch all undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find on this server! ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

// Server configurations
const port = config.get('port');

const server = app.listen(port, async () => {
  log.info(`Listening on port http://localhost:${port}`);
  // connectToDb();
});

////////////////////////////////////////////////////////////////////////////
/* handle Unhandled Rejection  */
process.on('unhandledRejection', (err: any) => {
  log.error(err);
  log.error('Unhandled Rejection 💥 shutting down.....');

  server.close(() => {
    process.exit(1);
  });
});
/* handle Uncaught Exception  */
process.on('uncaughtException', (err: any) => {
  log.error(err);
  log.error('Uncaught Exception 💥 shutting down.....');
  process.exit(1);
});

export default app;
