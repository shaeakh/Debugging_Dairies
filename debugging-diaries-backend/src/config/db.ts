import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import EnvConstant from '../constants/envConstants.js';

const connectionString = EnvConstant.DIRECT_URL || EnvConstant.DATABASE_URL || '';

const pool = new Pool({
  connectionString,
  // SSL সবসময় enable রাখো Supabase এর জন্য
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export default prisma;
