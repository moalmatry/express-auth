require('dotenv').config();
import config from 'config';
import express, { NextFunction, Request, Response } from 'express';
import router from './routes';
import AppError from './utils/AppError';
import connectToDb from './utils/connectToDb';
import log from './utils/logger';
import globalErrorHandler from './controller/error.controller';

const app = express();

// bodyParser alternative
app.use(express.json());

// start routes
app.use(router);
// NOTE: this route will catch all undefined routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// Server configurations
const port = config.get('port');

app.listen(port, async () => {
  log.info(`Listening on port http://localhost:${port}`);
  connectToDb();
});
