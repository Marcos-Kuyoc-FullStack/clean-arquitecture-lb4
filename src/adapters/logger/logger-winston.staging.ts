/**
 * Siestema de Logueo
 */
import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
import {createLogger, format, transports} from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
dotenv.config();
const {timestamp, combine, printf, json} = format;

export const loggerStaging = createLogger({
  level: 'info',
  format: combine(
    json(),
    timestamp(),
    printf(
      info =>
        `{"level": "${info.level}", "message":"[${info.timestamp}] ${info.message}"}`,
    ),
  ),
  transports: [
    new transports.File({filename: 'logs/error.log', level: 'error'}),
    new transports.File({filename: 'logs/combined.log'}),
  ],
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

loggerStaging.add(
  new WinstonCloudWatch({
    name: process.env.LOGGER_NAME ?? '[staging]api-name',
    cloudWatchLogs: new AWS.CloudWatchLogs(),
    logGroupName: process.env.LOGGER_GROUP_NAME ?? '[staging]api-name',
    logStreamName: process.env.LOGGER_STREAM_NAME ?? '[staging]api-name',
  }),
);
