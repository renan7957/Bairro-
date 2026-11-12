import mysql from 'mysql2/promise'

const con = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'bairro_mais',
    password: 'Renan010709@'
})

console.log('Conectou com MYSQL!');

export { con };