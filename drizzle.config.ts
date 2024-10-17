import 'dotenv/config'
import 'dotenv-expand/config'

import { defineConfig } from "drizzle-kit";


const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const DATABASE_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

console.log(DATABASE_URL)

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});