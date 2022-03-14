import * as dotenv from 'dotenv';
import {loggerDev} from './logger-winston.dev';
import {loggerProd} from './logger-winston.prod';
import {loggerStaging} from './logger-winston.staging';
dotenv.config();

let miLogger;

if (process.env.NODE_ENV !== 'production') {
  if (process.env.NODE_ENV === 'staging') {
    miLogger = loggerStaging;
  } else {
    miLogger = loggerDev;
  }
} else {
  miLogger = loggerProd;
}

export const logger = miLogger;
