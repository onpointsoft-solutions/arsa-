import mysql from 'mysql2/promise'
import config from '../config/index'
import logger from '../utils/logger'

/**
 * Parse a mysql:// URI into mysql2 connection options.
 * Supports ?socket=/path/to/mysql.sock for LAMPP/XAMPP setups.
 */
function parseDbUrl(url: string): mysql.PoolOptions {
  const parsed    = new URL(url)
  const socketArg = parsed.searchParams.get('socket')
  const sslArg    = parsed.searchParams.get('ssl')

  const base: mysql.PoolOptions = {
    user:     parsed.username || 'root',
    password: parsed.password ? decodeURIComponent(parsed.password) : undefined,
    database: parsed.pathname.replace(/^\//, ''),
    timezone: '+00:00',
    decimalNumbers: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }

  // SSL — either explicit ?ssl={"rejectUnauthorized":true} or auto-detect TiDB Cloud
  const isTiDB = parsed.hostname.includes('tidbcloud.com')
  if (sslArg || isTiDB) {
    let sslOpts: any = { rejectUnauthorized: true }
    if (sslArg) {
      try { sslOpts = { ...sslOpts, ...JSON.parse(sslArg) } } catch {}
    }
    (base as any).ssl = sslOpts
  }

  if (socketArg) {
    return { ...base, socketPath: socketArg }
  }

  return {
    ...base,
    host: parsed.hostname || 'localhost',
    port: parsed.port ? parseInt(parsed.port) : 3306,
  }
}

const pool = mysql.createPool(parseDbUrl(config.database.url))

pool.on('connection', () => {
  logger.debug('New MySQL connection established')
})

/**
 * Execute a SELECT and return all rows.
 */
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

/**
 * Execute a SELECT and return the first row or null.
 */
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] ?? null
}

/**
 * Execute INSERT / UPDATE / DELETE — returns the result header.
 */
export async function execute(sql: string, params?: any[]): Promise<mysql.ResultSetHeader> {
  const [result] = await pool.execute(sql, params)
  return result as mysql.ResultSetHeader
}

/**
 * Run multiple statements inside a single transaction.
 */
export async function transaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection()
  await conn.beginTransaction()
  try {
    const result = await fn(conn)
    await conn.commit()
    return result
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

export default pool
