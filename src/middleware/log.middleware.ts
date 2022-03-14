import {Middleware} from '@loopback/rest';
import {logger} from '../adapters/logger';

export const logMiddleaware: Middleware = async (ctx, next) => {
  const {request, response} = ctx;
  const ip =
    request.header('x-forwarded-for') ?? request.connection.remoteAddress;

  try {
    logger.info(`[${ip}] - ${request.method} ${request.originalUrl}`);
    return await next();
  } catch (error) {
    logger.error(`[${ip}] - [${error.statusCode}] ${error.message}`);
    logger.error(`${error}`);
    response.status(error.statusCode).send(error);
  }
};
