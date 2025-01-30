// database/database.js
import mysql from "mysql2/promise";

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "sachin@313",
    database: "mayoor",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db;