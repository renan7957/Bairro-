import mysql from 'mysql2/promise';
import 'dotenv/config';

export const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

console.log('MySQL conectado com sucesso!');