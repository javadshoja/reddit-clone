import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import { env } from '@/env.mjs'

import * as schema from './schema'

neonConfig.fetchConnectionCache = true

// Create the connection
const sql = neon(env.DATABASE_URL)

const db = drizzle(sql, { schema })

export default db
