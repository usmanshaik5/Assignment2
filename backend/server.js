const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv'); // Import dotenv to load environment variables
const { pool, connectDB } = require('./db'); // Import MySQL connection from db.js

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000; // Use port from .env or fallback to 5000

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON requests

// Connect to MySQL database
connectDB()
    .then(() => console.log('Connected to MySQL database.'))
    .catch((err) => console.error('Database connection error:', err));

// Array to store created rules (if you want to keep this, but it's not really necessary)
const createdRules = [];

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Rule Evaluation API (MySQL Version)!');
});

// Function to create an AST from rule string
function createRule(ruleString) {
    const tokens = ruleString.match(/([A-Za-z_][A-Za-z_0-9]*|>=|<=|==|!=|>|<|\s+AND\s+|\s+OR\s+|\s+|\(|\))/g)
        .filter(t => t.trim());

    console.log('Tokens:', tokens); // Log the tokens for debugging

    const ast = parseTokens(tokens);
    return ast;
}

// Parsing tokens to create an AST
function parseTokens(tokens) {
    const stack = [];
    const output = [];

    const precedence = {
        'OR': 1,
        'AND': 2,
        '==': 3,
        '!=': 3,
        '>': 3,
        '<': 3,
        '>=': 3,
        '<=': 3
    };

    tokens.forEach(token => {
        if (/^\d+$/.test(token) || /^[A-Za-z_][A-Za-z_0-9]*$/.test(token)) {
            output.push(new Node("operand", null, null, token));
        } else if (precedence[token]) {
            while (stack.length && precedence[stack[stack.length - 1]] >= precedence[token]) {
                output.push(new Node("operator", output.pop(), output.pop(), stack.pop()));
            }
            stack.push(token);
        } else if (token === '(') {
            stack.push(token);
        } else if (token === ')') {
            while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(new Node("operator", output.pop(), output.pop(), stack.pop()));
            }
            stack.pop(); // Pop the '('
        }
    });

    while (stack.length) {
        output.push(new Node("operator", output.pop(), output.pop(), stack.pop()));
    }

    return output[0]; // Return the root node of the AST
}

// Node constructor function
function Node(type, left, right, value) {
    return { type, left, right, value };
}

// Updated Endpoint to create a rule
app.post('/rules/create', (req, res) => {
    const { rule_string } = req.body;
    if (!rule_string) {
        return res.status(400).json({ error: 'No rule string provided.' });
    }

    try {
        const ast = createRule(rule_string);
        createdRules.push({ rule_string, ast }); // Store the created rule
        console.log('Generated AST:', JSON.stringify(ast, null, 2)); // Log the complete AST
        res.json({ rule_string, ast });
    } catch (error) {
        console.error('Error creating rule:', error);
        res.status(500).json({ error: 'Failed to create rule.' });
    }
});

// Endpoint to save a rule in MySQL
app.post('/rules/save', async (req, res) => {
    const { rule_string } = req.body;
    if (!rule_string) {
        return res.status(400).json({ error: 'No rule string provided.' });
    }

    try {
        const query = 'INSERT INTO rules (rule_string) VALUES (?)';
        const [result] = await pool.execute(query, [rule_string]); // Use the pool for executing queries
        res.status(201).json({ id: result.insertId, rule_string });
    } catch (error) {
        console.error('Error saving rule:', error);
        res.status(500).json({ error: 'Failed to save rule.' });
    }
});

// Endpoint to retrieve all saved rules from MySQL
app.get('/rules', async (req, res) => {
    const query = 'SELECT * FROM rules';
    try {
        const [rows] = await pool.query(query); // Use the pool for querying
        res.json(rows);
    } catch (error) {
        console.error('Error fetching rules:', error);
        res.status(500).json({ error: 'Failed to fetch rules.' });
    }
});

// Updated Endpoint to evaluate a rule against given attributes
// Updated Endpoint to evaluate a rule against given attributes

// Updated Endpoint to evaluate a rule against given attributes
app.post('/rules/evaluate', (req, res) => {
    const { attributes, ast } = req.body; // Receive AST and attributes from request body

    // Validate input
    if (!ast || !attributes) {
        console.error('Missing AST or attributes for evaluation.');
        return res.status(400).json({ error: 'Missing AST or attributes for evaluation.' });
    }

    try {
        const evaluationResult = evaluateRule(ast, attributes); // Call evaluation with the new rule
        console.log('Evaluation Result:', evaluationResult);
        res.json({ result: evaluationResult });
    } catch (error) {
        console.error('Error evaluating rule:', error);
        res.status(500).json({ error: 'Failed to evaluate rule.' });
    }
});





// Function to evaluate the rule (AST or plain string rule) against the given attributes
function evaluateRule(rule, attributes) {
    if (!rule) {
        return false; // Rule not provided
    }

    // Parse the rule string into an AST if needed (you can modify this depending on your rule format)
    const ast = parseRuleToAST(rule);

    if (!ast) {
        console.error('Invalid rule structure');
        return false;
    }

    return evaluateAST(ast, attributes); // Evaluate the parsed AST
}

// Function to parse the rule string into an AST (this is a placeholder; you need to implement actual parsing logic)
function parseRuleToAST(ruleString) {
    // Example: Convert the string rule to an AST format
    // Here we assume that the `ruleString` is in a format we can parse (like "age >= 18 AND department === 'Engineering'")
    
    // You can use a custom parser or define a standard AST structure for rules
    // For now, return the rule as-is or implement your own parsing logic
    return {
        type: 'operator',
        value: 'AND',
        left: {
            type: 'operator',
            value: '>=',
            left: {
                type: 'operand',
                value: 'age'
            },
            right: {
                type: 'constant',
                value: 18
            }
        },
        right: {
            type: 'operator',
            value: '===',
            left: {
                type: 'operand',
                value: 'department'
            },
            right: {
                type: 'constant',
                value: 'Engineering'
            }
        }
    };
}

// Function to evaluate the AST against the given attributes
function evaluateAST(ast, attributes) {
    if (!ast) {
        return false; // AST not provided
    }

    if (ast.type === 'operand') {
        const attributeValue = attributes[ast.value];
        return attributeValue !== undefined ? attributeValue : false;
    } else if (ast.type === 'constant') {
        return ast.value;
    } else if (ast.type === 'operator') {
        const leftEval = evaluateAST(ast.left, attributes);
        const rightEval = evaluateAST(ast.right, attributes);

        switch (ast.value) {
            case 'AND':
                return leftEval && rightEval;
            case 'OR':
                return leftEval || rightEval;
            case '>':
                return leftEval > rightEval;
            case '<':
                return leftEval < rightEval;
            case '==':
                return leftEval == rightEval;
            case '===':
                return leftEval === rightEval;
            case '>=':
                return leftEval >= rightEval;
            case '<=':
                return leftEval <= rightEval;
            case '!=':
                return leftEval != rightEval;
            default:
                return false;
        }
    }

    return false;
}

app.post('/rules/combine', async (req, res) => {
    const { rules } = req.body; // Get the rule strings from the request

    // Validate that 'rules' is an array with at least two items
    if (!Array.isArray(rules) || rules.length < 2) {
        return res.status(400).json({ message: 'Not enough valid rules to combine.' });
    }

    try {
        // Log the received rules for debugging
        console.log('Received Rules:', rules);

        // Combine the rule strings using "AND"
        const combinedRuleString = rules.join(' AND ');

        // Log the combined rule string for debugging
        console.log('Combined Rule:', combinedRuleString);

        // Save the combined rule back to the database if necessary
        const result = await pool.query('INSERT INTO combined_rules (rule_string) VALUES (?)', [combinedRuleString]);

        // Check if the rule was saved successfully
        if (result.affectedRows === 0) {
            throw new Error('Failed to save the combined rule to the database.');
        }

        // Send the combined rule string back to the client
        res.status(200).json({ combined_rule: combinedRuleString });
    } catch (error) {
        // Log any errors that occur during the process
        console.error('Error combining rules:', error.message);
        res.status(500).json({ message: 'Failed to combine rules due to server error.' });
    }
});


// Endpoint to update an existing rule in MySQL
app.put('/rules/update/:id', async (req, res) => {
    const { id } = req.params; // Get the rule ID from the URL parameters
    const { rule_string } = req.body; // Get the new rule string from the request body

    if (!rule_string) {
        return res.status(400).json({ error: 'No rule string provided.' });
    }

    try {
        // Update the rule in the database
        const query = 'UPDATE rules SET rule_string = ? WHERE id = ?';
        const [result] = await pool.execute(query, [rule_string, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Rule not found.' });
        }

        res.json({ id, rule_string });
    } catch (error) {
        console.error('Error updating rule:', error);
        res.status(500).json({ error: 'Failed to update rule.' });
    }
});


// Test route to verify server status
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
