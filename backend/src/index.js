const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static assets
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Route files
const auth = require('./routes/auth');
const courses = require('./routes/courses');
const student = require('./routes/student');
const mentor = require('./routes/mentor');
const books = require('./routes/books');
const admin = require('./routes/admin');
const payment = require('./routes/payment');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/courses', courses);
app.use('/api/v1/student', student);
app.use('/api/v1/mentor', mentor);
app.use('/api/v1/books', books);
app.use('/api/v1/admin', admin);
app.use('/api/v1/payment', payment);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Coursiva API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
