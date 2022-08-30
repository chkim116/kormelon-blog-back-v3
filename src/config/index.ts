import { config } from 'dotenv';

config();

export const env = {
  /**
   * 개발 or 상용 모드 여부
   */
  mode: process.env.NODE_ENV,
  /**
   * 서버에서 사용할 Port
   */
  port: process.env.PORT,
  /**
   * 현재 프로젝트의 루트 경로
   */
  cwd: process.cwd(),

  /**
   * DB host
   *
   * @example
   * dev - localhost, prod - kormelon.com
   */
  dbHost: process.env.DB_HOST,
  /**
   * DB port
   *
   */
  dbPort: process.env.DB_PORT,
  /**
   * DB username
   *
   * @example
   * dev - blog_dev, prod - blog_prod
   */
  dbUserName: process.env.DB_USERNAME,
  /**
   * DB password
   */
  dbPassword: process.env.DB_PASSWORD,
  /**
   * DB Name
   */
  dbName: process.env.DB_NAME,
};
