# Rule Engine with Abstract Syntax Tree (AST)

## Objective

This project is a simple 3-tier rule engine application designed to determine user eligibility based on various attributes such as age, department, income, and spending. It utilizes an Abstract Syntax Tree (AST) to represent conditional rules, enabling dynamic creation, combination, and modification of these rules.

## Data Structure

The application defines a data structure to represent the AST with the following properties:

- **Node**: Represents a node in the AST.
  - **type**: A string indicating the node type (e.g., "operator" for AND/OR, "operand" for conditions).
  - **left**: A reference to another Node (left child).
  - **right**: A reference to another Node (right child for operators).
  - **value**: An optional value for operand nodes (e.g., a number for comparisons).

## Data Storage

The application uses a database (e.g., MongoDB, PostgreSQL) to store rules and application metadata. The schema for storing rules can be defined as follows:

### Example Schema
```json
{
  "rules": [
    {
      "rule_id": "string",
      "rule_string": "string",
      "created_at": "date",
      "updated_at": "date"
    }
  ]
}





Sample Rules
Rule 1: ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
Rule 2: ((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)
API Design
Endpoints
Create Rule

Function: create_rule(rule_string)
Description: Takes a string representing a rule and returns a Node object representing the corresponding AST.
Combine Rules

Function: combine_rules(rules)
Description: Takes a list of rule strings and combines them into a single AST, minimizing redundant checks. Returns the root node of the combined AST.
Evaluate Rule

Function: evaluate_rule(JSON data)
Description: Takes a JSON representation of the combined rule's AST and a dictionary of attributes (e.g., data = {"age": 35, "department": "Sales", "salary": 60000, "experience": 3}). Returns True if the user is eligible based on the rule, otherwise False.






################ INSTALLATION ##################
Installation
Clone the repository:

bash

git clone https://github.com/yourusername/rule-engine-ast.git
cd rule-engine-ast
Install dependencies for the backend:

bash

cd backend
npm install
Install dependencies for the frontend (if applicable):

bash

cd frontend
npm install
Set up the database and ensure it is running.

Configure environment variables (e.g., database connection string) in a .env file.

Running the Project
Backend
To start the backend server:

bash

cd backend
npm start
Frontend (if applicable)
To start the frontend application:

bash

cd frontend
npm start


Usage
Create individual rules using the create_rule function and verify their AST representation.
Combine multiple rules using the combine_rules function to see the resulting AST.
Use the evaluate_rule function with sample JSON data to test different scenarios.

Test Cases
Create individual rules and verify their AST representation.
Combine rules and ensure the resulting AST reflects the combined logic.
Test with sample JSON data to evaluate rules for various scenarios.
Explore combining additional rules to validate the functionality.

Bonus Features
Implemented error handling for invalid rule strings or data formats (e.g., missing operators, invalid comparisons).
Validate attributes to be part of a catalog.
Allow modification of existing rules through additional functionalities within create_rule or separate functions.
Consider extending the system to support user-defined functions within the rule language for advanced conditions.
License
This project is licensed under the MIT License - see the LICENSE file for details.


### Additional Notes
- Replace `yourusername` in the clone URL with your actual GitHub username.
- Feel free to modify the sections as needed to better fit your project specifics.
- Add sections for any additional features or configurations specific to your implementation.
  
Once you have your project details for **Application 2**, I can help create a similar template for that as well!



Prerequisites
Make sure you have the following installed on your system:

Node.js
XAMPP (for MySQL)
Installation Instructions
Clone the Repository: Clone your repository to your local machine.

git clone <your-github-repo-url>
cd <your-repo-directory>
Install Backend Dependencies: Navigate to your backend directory (if you have a separate one) and install the required packages.

npm install express body-parser cors mysql2
Dependencies Explained:
express: Web framework for Node.js to create server applications.
body-parser: Middleware for parsing incoming request bodies.
cors: Middleware to enable CORS (Cross-Origin Resource Sharing).
mysql2: MySQL client for Node.js.
Setup the Database:

Start XAMPP and launch the phpMyAdmin.
Create a new database (e.g., rule_engine).
Define the necessary schema for your rules. You can use the following SQL commands as an example:

CREATE TABLE rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rule_string TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Install Frontend Dependencies: If you are using React for the frontend, navigate to your React application directory and run:

npx create-react-app my-rule-engine-ui
cd my-rule-engine-ui
npm install axios react-router-dom
Dependencies Explained:
axios: Promise-based HTTP client for the browser and Node.js.
react-router-dom: DOM bindings for React Router, enabling navigation in your application.
Run the Applications:

Start your backend server (assuming you have an index.js or server.js file):

node index.js
In another terminal, navigate to your React app directory and start the React application:

npm start
Using the Application
Access the backend API on http://localhost:<backend-port>/api/rules to manage rules.
Use the frontend at http://localhost:3000 to interact with the rule engine.
Bonus Considerations
Implement error handling for invalid inputs.
Create tests for the functionalities of rule creation and evaluation.

