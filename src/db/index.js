"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var db_config_1 = require("../config/db.config");
var mysql = require("mysql2");
exports.default = mysql.createConnection({
    host: db_config_1.default.HOST,
    user: db_config_1.default.USER,
    password: db_config_1.default.PASSWORD,
    database: db_config_1.default.DB
});
