const mysql = require('mysql2');

//* Create a MySQL connection
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db',
    },
    console.log('Connected to the example_db database')
);



//* Connect to the MySQL database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the MySQL database: ', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = connection;

