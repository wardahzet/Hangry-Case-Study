import dbConfig from "../config/db.config";
import * as mysql from "mysql2";

export default mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});
