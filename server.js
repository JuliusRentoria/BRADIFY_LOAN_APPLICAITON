const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = 'your_secret_key';

// In-memory user storage
let users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

app.use(bodyParser.json());
app.use(cors()); // Use CORS middleware

// Loan endpoint
app.post('/Loan', (req, res) => {
  // Handle the loan calculation logic here
  const { loanAmount, interestRate, loanTerm } = req.body;

  // Perform the loan calculation based on the provided data
  // For this example, let's just echo back the data received
  const responseData = {
    loanAmount,
    interestRate,
    loanTerm
  };

  // Simulate a delay for demonstration purposes
  setTimeout(() => {
    res.json(responseData);
  }, 1000); // Delayed response for 1 second
});

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
