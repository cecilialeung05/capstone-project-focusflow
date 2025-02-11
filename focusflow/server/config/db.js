const knex = require("knex");
const knexConfig = require("../knexfile");

const db = knex(knexConfig.development);

db.raw("SELECT 1")
  .then(() => console.log("✅ Connected to MySQL database"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = db;
