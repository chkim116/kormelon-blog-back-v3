import { DataSource } from 'typeorm';

import 'reflect-metadata';

import { env } from '@config';
import entities from '@models';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.dbHost,
  port: Number(env.dbPort),
  username: env.dbUserName,
  password: env.dbPassword,
  database: env.dbName,
  cache: true,
  logging: true,
  entities,
});

export async function mysqlLoader() {
  await AppDataSource.initialize()
    .then((connection) => {
      console.log(
        `✅ DB connection success.\n🔗 DB: ${connection.options.database}\n✏️  NAME: ${connection.name}`
      );
    })
    .catch((error) => console.log(error));
}
