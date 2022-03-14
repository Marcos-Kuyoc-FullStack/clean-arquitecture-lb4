/**
 * Siestema de Logueo
 */
import {addColors, createLogger, format, transports} from 'winston';
const {timestamp, combine, printf} = format;

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  verbose: 'gray',
  debug: 'blue',
  silly: 'grey',
};

addColors(colors);

export const loggerDev = createLogger({
  format: combine(
    format.colorize({
      all: true,
    }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
  transports: [new transports.Console()],
});
