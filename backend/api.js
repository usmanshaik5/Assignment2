const express = require('express');
const { pool } = require('./db'); // Import the pool from db.js
const router = express.Router();

// Middleware to parse JSON bodies
router.use(express.json());

// Create a new rule
router.post('/rules', async (req, res) => {
    try {
        const { rule_string } = req.body;

        // Validate input
        if (!rule_string || typeof rule_string !== 'string' || rule_string.trim() === '') {
            return res.status(400).json({ message: 'Invalid rule string provided. It must be a non-empty string.' });
        }

        // Insert rule into the database
        const [result] = await pool.query('INSERT INTO rules (rule_string) VALUES (?)', [rule_string]);

        const savedRule = { id: result.insertId, rule_string };
        res.status(201).json(savedRule);
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(500).json({ message: 'Failed to create rule due to server error.' });
    }
});

// Get all rules
router.get('/rules', async (req, res) => {
    try {
        const [rules] = await pool.query('SELECT * FROM rules');
        res.status(200).json(rules);
    } catch (error) {
        console.error('Error retrieving rules:', error);
        res.status(500).json({ message: 'Failed to retrieve rules due to server error.' });
    }
});

// Combine rules or save a combined rule
router.post('/rules/combine', async (req, res) => {
    const { rules, combined_rule } = req.body;

    if (!combined_rule || typeof combined_rule !== 'string' || combined_rule.trim() === '') {
        return res.status(400).json({ message: 'Invalid combined rule string provided. It must be a non-empty string.' });
    }

    if (!Array.isArray(rules) || rules.length === 0 || !rules.every(rule => typeof rule === 'string' && rule.trim() !== '')) {
        return res.status(400).json({ message: 'Invalid rules input. Must be a non-empty array of non-empty strings.' });
    }

    try {
        const [result] = await pool.query('INSERT INTO combined_rules (combined_rule) VALUES (?)', [combined_rule]);

        const savedCombinedRule = { id: result.insertId, combined_rule };
        res.status(201).json(savedCombinedRule);
    } catch (error) {
        console.error('Error saving combined rule:', error);
        res.status(500).json({ message: 'Failed to save combined rule due to server error.' });
    }
});

// Evaluate a rule
router.post('/rules/evaluate', async (req, res) => {
    const { attributes, ast } = req.body;

    if (!ast || typeof ast !== 'string' || ast.trim() === '') {
        return res.status(400).json({ message: 'Invalid AST input. It must be a non-empty string.' });
    }

    if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) {
        return res.status(400).json({ message: 'Invalid attributes input. It must be a non-array object.' });
    }

    const result = true; // Simulated evaluation result
    res.status(200).json({ result });
});

// Export the router to use in the main app
module.exports = router;
