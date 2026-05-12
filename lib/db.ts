import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "tpw.sqlite");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("busy_timeout = 5000");

export default db;
