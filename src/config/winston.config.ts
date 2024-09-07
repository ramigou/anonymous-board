import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // 콘솔에 로그 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.colorize(),
      ),
    }),
    // error 로그를 별도로 저장
    new winston.transports.DailyRotateFile({
      level: 'error', // error 레벨 이상의 로그만 저장
      dirname: 'logs', // 로그 디렉토리
      filename: 'error-%DATE%.log', // 파일명 패턴
      datePattern: 'YYYY-MM-DD', // 매일 새로운 파일 생성
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // info 로그를 combined 파일로 저장
    new winston.transports.DailyRotateFile({
      level: 'info', // info 레벨 이상의 로그를 저장 (info, warn, error)
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
