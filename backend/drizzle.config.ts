import 'dotenv/config';


export default {
  schema: ['./src/**/*.schema.ts',
     './src/core/infra/db/schema/**/*.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
};