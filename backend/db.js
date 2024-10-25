// db.js
const mysql = require('mysql2/promise'); // Import MySQL
const dotenv = require('dotenv'); // Import dotenv to load environment variables

dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // MySQL host
    user: process.env.DB_USER,                 // MySQL username
    password: process.env.DB_PASSWORD,         // MySQL password
    database: process.env.DB_NAME,             // Database name
});

// Function to connect to the database
const connectDB = async () => {
    try {
        // Test the connection
        await pool.getConnection();
        console.log("MySQL connected.");
    } catch (error) {
        console.error("MySQL connection error:", error);
        process.exit(1);
    }
};

// Export the pool and connectDB function
module.exports = { pool, connectDB };
