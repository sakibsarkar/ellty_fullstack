import dotenv from "dotenv";
dotenv.config();
const Config = {
  MONGO_URI: process.env.MONGO_URI,
  bcrypt_salt_rounds: process.env.SALT_ROUND,
  nodeEnv: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  CD_CLOUD_NAME: process.env.CD_CLOUD_NAME,
  CD_API_SECRET: process.env.CD_API_SECRET,
  CD_API_KEY: process.env.CD_API_KEY,
};

export default Config;
