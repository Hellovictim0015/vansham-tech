import mysql from "mysql2/promise";

const globalForDb = globalThis as unknown as { __mysqlPool?: mysql.Pool };

export const db: mysql.Pool =
  globalForDb.__mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "vansham",
    charset: "utf8mb4",
    waitForConnections: true,
    connectionLimit: 10,
  });

if (process.env.NODE_ENV !== "production") globalForDb.__mysqlPool = db;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export async function query<T = Row>(sql: string, params: unknown[] = []) {
  const [rows] = await db.query(sql, params);
  return rows as T[];
}

export async function exec(sql: string, params: unknown[] = []) {
  const [res] = await db.query(sql, params);
  return res as mysql.ResultSetHeader;
}
