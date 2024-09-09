import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'daseul',
  password: 'daseul0417',
  database: 'anonymous_board',
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  synchronize: false,
  logging: false,
};
