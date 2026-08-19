import mysql from "mysql2/promise";

const dbHost = process.env.DB_HOST || "localhost";

const db = mysql.createPool({
  host: dbHost,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kampusfind",
  ssl: dbHost.endsWith(".aivencloud.com")
    ? { rejectUnauthorized: false }
    : undefined,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

db.on("error", (error) => {
  console.error("MySQL pool error:", error);
});

export default db;