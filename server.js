const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware

// In-memory user storage
let users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// In-memory loan storage
let loans = [
    // Sample data
    { id: 1, first_name: 'John', last_name: 'Doe', loan_amount: 500, interest: 5, due_date: '2024-06-01' },
    // Add more loans as needed
];


// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        // User found, generate JWT token
        jwt.sign({ user }, SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                res.status(500).json({ error: 'Failed to generate token' });
            } else {
                res.json({ token });
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // Check if the username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        res.status(400).json({ error: 'Username already exists' });
    } else {
        // Add the new user to the users array
        const newUser = { id: users.length + 1, username, password };
        users.push(newUser);
        res.json({ message: 'User created successfully' });
    }
});

// Repayment endpoint
app.post('/loan/repayment/:id', (req, res) => {
    const { id } = req.params;
    const loan = loans.find(l => l.id === id);

    if (loan) {
        loan.loan_amount = 0; // Mark the loan amount as repaid
        loan.interest = 0; // Set interest to 0 after repayment
        loan.status = 'Completed'; // Update status to Completed
        res.status(200).json({ message: 'Loan repaid successfully', loan });
    } else {
        res.status(404).json({ message: 'Loan not found' });
    }
});


// Completed loans storage
let completedLoans = [];

// Endpoint to get all completed loans
app.get('/completed', (req, res) => {
    res.json(completedLoans);
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
