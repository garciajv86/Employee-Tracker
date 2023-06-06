const mysql = require("mysql2/promise");

//* Create a MySQL connection
async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "employee_db",
    });
    console.log("Connected to the MySQL database");
    return connection;
  } catch (err) {
    console.error("Error connecting to the MySQL database: ", err);
    process.exit(1);
  }
}

const connection = createConnection();

module.exports = connection;
