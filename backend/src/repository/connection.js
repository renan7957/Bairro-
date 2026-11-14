import 'dotenv/config'
import mysql from 'mysql2/promise'

const con = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || ''
})

console.log('Conectou com MYSQL!');

export { con };