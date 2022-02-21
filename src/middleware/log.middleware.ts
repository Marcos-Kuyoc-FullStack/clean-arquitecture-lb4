import { Middleware } from "@loopback/rest";
import logger from '../adapters/logger/log-winston'

export const logMiddleaware: Middleware = async(ctx, next) => {
  const {request, response} = ctx
  try {
    const ip = request.header('x-forwarded-for') || request.connection.remoteAddress;
    logger.info(`[${ip}] - ${request.method} ${request.originalUrl}`)
    return await next();
  } catch (error) {
    logger.error(`[${error.statusCode}] ${error.message}`)
    response.status(error.statusCode).send(error);
  }
}