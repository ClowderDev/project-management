import { getEnv } from "../utils/get-env";

const envConfig = () => ({
  PORT: getEnv("PORT", "5000"),
  NODE_ENV: getEnv("NODE_ENV", "development"),
  MONGO_URI: getEnv("MONGO_URI", ""),
  JWT_SECRET: getEnv("JWT_SECRET", "your_jwt_secret"),
  JWT_EXPIRATION: getEnv("JWT_EXPIRATION", "1h"),
  RESEND_API_KEY: getEnv("RESEND_API_KEY"),
  RESEND_MAILER_SENDER: getEnv("RESEND_MAILER_SENDER", ""),
  FRONTEND_URL: getEnv("FRONTEND_URL", "http://localhost:5173"),
});

export const Env = envConfig();
