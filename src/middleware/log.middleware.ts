import { Middleware } from "@loopback/rest";
import logger from '../adapters/logger/log-winston'

export const logMiddleaware: Middleware = async(ctx, next) => {
  const {request, response} = ctx
  try {
    logger.info(`${request.method} ${request.originalUrl}`)
    return await next();
  } catch (error) {
    logger.error(`${error}`)
    response.status(error.statusCode).send(error);
  }
}