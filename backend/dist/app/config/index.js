"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Config = {
    MONGO_URI: process.env.MONGO_URI,
    bcrypt_salt_rounds: process.env.SALT_ROUND,
    nodeEnv: process.env.NODE_ENV,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
    NODE_ENV: process.env.NODE_ENV,
};
exports.default = Config;
