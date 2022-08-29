import { config } from "dotenv";

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
};
