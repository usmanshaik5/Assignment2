// models/ruleModel.js
const db = require('../config/database'); // Import your database connection pool

// Define a Rule class for handling rules in the database
class Rule {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    // Method to save a rule to the MySQL database
    async save() {
        const query = 'INSERT INTO rules (name, description) VALUES (?, ?)';
        const [result] = await db.execute(query, [this.name, this.description]);
        return result.insertId; // Return the ID of the newly inserted rule
    }

    // Static method to retrieve all rules from the database
    static async findAll() {
        const query = 'SELECT * FROM rules';
        const [rows] = await db.query(query);
        return rows; // Return all retrieved rules
    }
}

// Export the Rule class
module.exports = Rule;
