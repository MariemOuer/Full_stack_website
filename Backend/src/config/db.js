const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "occasio-ocassio.e.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_hfdouDN5amzzSpdlppb",
  database: "OccasioDB",
  port: 25048,
  ssl: { rejectUnauthorized: false },  
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database!");
});

module.exports = db;

/**
 * This module establishes a connection to a MySQL database using the `mysql2` package.
 * The `db` object is created with the necessary credentials and configuration to connect 
 * to the remote database hosted at `occasio-ocassio.e.aivencloud.com` on port `25048`.
 * 
 * - `host`: The database server address.
 * - `user`: The username for authentication.
 * - `password`: The corresponding password for the database user.
 * - `database`: The specific database to connect to (`OccasioDB`).
 * - `port`: The port number where the MySQL server is running.
 * - `ssl`: The SSL configuration to allow secure connections. 
 *    - `{ rejectUnauthorized: false }` is used to bypass SSL verification, which is often needed for cloud-hosted databases.
 * 
 * The `db.connect()` method attempts to establish a connection, logging a success message
 * if successful or an error message if the connection fails. The `db` instance is then 
 * exported so it can be used in other parts of the application to interact with the database.
 */
