import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { env } from '@config';
import { entities } from '@models';

export const ormConfig: ConnectionOptions = {
  type: 'mysql',
  name: env.mode,
  host: env.dbHost,
  port: Number(env.dbPort),
  username: env.dbUserName,
  password: env.dbPassword,
  database: env.dbName,
  cache: true,
  logging: false,
  synchronize: false,
  timezone: 'Asia/Seoul',
  charset: 'utf8mb4',
  entities,
};

export const mysqlLoader = async (): Promise<Connection | null> => {
  try {
    await createConnection(ormConfig).then((connection) => {
      console.log(
        `✅ DB connection success. \n🔗 DB: ${connection.options.database}\n✏️ NAME: ${connection.name}`
      );
    });
  } catch (err) {
    console.log(err);
  }

  return null;
};
