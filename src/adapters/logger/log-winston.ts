import winston from "winston";

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  verbose: "gray",
  debug: "blue",
  silly: "grey"
}

winston.addColors(colors);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize({
      all: true
    }),
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.printf(info => `{"level": "${info.level}", "message":"[${info.timestamp}] ${info.message}"}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'debug',
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp(),
        winston.format.printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)
      )
    })
  );
}

export default logger;