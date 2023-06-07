const mysql = require("mysql2/promise");
const { DB_USER, DB_PASSWORD, DB, DB_PORT } = process.env;

function buildConnectionOptions() {
  return {
    host: "127.0.0.1",
    port: DB_PORT || 3306,
    user: DB_USER || "root",
    password: DB_PASSWORD || "password",
    database: DB || "employee_db",
  };
}

module.exports = {
  buildConnectionOptions: buildConnectionOptions,
  createConnection: mysql.createConnection,
};
