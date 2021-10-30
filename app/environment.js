import 'dotenv/config';

export const { PROJECT_NAME } = process.env;
export const { SERVER_PORT } = process.env;
export const { PG_URL } = process.env;
export const { PG_USER } = process.env;
export const { PG_PASS } = process.env;
export const { PG_DB } = process.env;
export const { API_PREFIX } = process.env;
export const { PG_EXPRESS_PORT } = process.env;
export const { PG_PORT } = process.env;
export const { CHECK_AUTH } = process.env;
export const { CHECK_CHANGE_PASSWORD } = process.env;
export const { CHECK_REQUEST_SIGNATURE } = process.env;
export const { UPLOAD_PATH } = process.env;
export const { SEED_DATA } = process.env;
export const { VERSION } = process.env;
export const { MEMORY_LIMIT } = process.env;
export const { MEMORY_RESERVATIONS } = process.env;
export const { UPLOAD_DIR } = process.env;
export const { URL } = process.env;
export const { FRONTEND_BASE_URL } = process.env;
export const { MAIL_NAME } = process.env;
export const { MAIL_PASS } = process.env;

export const { STRIPE_TOKEN } = process.env;
export const { STRIPE_API_KEY } = process.env;
export const { STRIPE_PUBLIC_KEY } = process.env;

export const { AWS_BUCKET_NAME } = process.env;
export const { AWS_ACCESS_KEY_ID } = process.env;
export const { AWS_SECRET_ACCESS_KEY } = process.env;

export const IMAGE = ['.svg', '.png', '.jpg', '.jpeg'];
export const WATCH = ['.mp4', '.mpeg4'];
export const READ = ['.pdf'];

export const IMAGE_SIZE = 10000000;
export const WATCH_SIZE = 1000000000;
export const READ_SIZE = 50000000;
