const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const courses = require('./seederData');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coursiva');

const importData = async () => {
  try {
    await Course.create(courses);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Course.deleteMany();
    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
