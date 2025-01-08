require("dotenv").config(); // Load environment variables dari .env
const { Pool } = require("pg");

// Konfigurasi database menggunakan environment variables
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
};

const db = new Pool(dbConfig);

db.on("connect", () => {
  console.log("Connected to the database");
});

db.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = db;
