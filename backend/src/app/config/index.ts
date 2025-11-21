import dotenv from "dotenv";
dotenv.config();
const Config = {
  MONGO_URI: process.env.MONGO_URI,
  bcrypt_salt_rounds: process.env.SALT_ROUND,
  nodeEnv: process.env.NODE_ENV,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
};

export default Config;
