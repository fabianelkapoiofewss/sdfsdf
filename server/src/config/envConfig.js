import 'dotenv/config';

export const envConfig = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    PASSWORD_ADMIN1: process.env.PASSWORD_ADMIN1,
    PASSWORD_ADMIN2: process.env.PASSWORD_ADMIN2,
    MONGO_URL: process.env.MONGO_URL,
    DATABASE_TEST: process.env.DATABASE_TEST,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY_CLOUD: process.env.API_KEY_CLOUD,
    API_SECRET_CLOUD: process.env.API_SECRET_CLOUD,
    NODE_ENV: process.env.NODE_ENV
}