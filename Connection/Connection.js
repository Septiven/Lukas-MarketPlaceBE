const mysql = require('mysql')

// Connection
const db = mysql.createConnection({
    user: 'root',
    password: 'Lukas',
    database: 'lukas-marketplace',
    port: 3306
})

module.exports = db