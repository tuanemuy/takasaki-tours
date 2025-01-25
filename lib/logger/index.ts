import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export class Logger {
  public readonly logger: winston.Logger;

  constructor() {
    const transports: winston.transport[] = [
      new winston.transports.Console({
        level: process.env.ENV_NAME === "production" ? "error" : "debug",
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    ];

    if (process.env.NEXT_RUNTIME !== "edge") {
      /*
      transports.push(
        new DailyRotateFile({
          level: "info",
          filename: "application-%DATE%.log",
          dirname: "logs",
          datePattern: "YYYYMMDD",
          maxFiles: "7d",
        }),
      );

      transports.push(
        new DailyRotateFile({
          level: "error",
          filename: "error-%DATE%.log",
          dirname: "logs",
          datePattern: "YYYYMMDD",
          maxFiles: "7d",
        }),
      );
      */
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      transports,
    });
  }

  // biome-ignore lint/suspicious/noExplicitAny: winston
  info(message: any, ...meta: any[]): void {
    this.logger.info(message, meta);
  }

  // biome-ignore lint/suspicious/noExplicitAny: winston
  error(message: any, ...meta: any[]): void {
    if (process.env.ENV_NAME !== "production") {
      console.error(message);
    }
    this.logger.error(message, meta);
  }
}
