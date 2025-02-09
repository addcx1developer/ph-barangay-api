import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

export const mongodbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ph-barangay-db',
};
