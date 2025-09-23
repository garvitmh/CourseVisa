const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// In-memory array to store applications
let applications = [];

// POST route for "Apply Now"
app.post('/apply', (req, res) => {
    const { name, email, position } = req.body;

    if (!name || !email || !position) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newApplication = { name, email, position, appliedAt: new Date() };
    applications.push(newApplication);

    res.status(200).json({
        message: 'Application submitted successfully!',
        application: newApplication
    });
});

// GET route to see all applications (for testing)
app.get('/applications', (req, res) => {
    res.json(applications);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});