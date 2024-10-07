import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'pperso', 
    password: 'Swann!',
    database: 'pizzeria'
});

export default pool;
