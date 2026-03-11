const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./src/models/Book');

dotenv.config({ path: './.env' });

const dummyBooks = [
  { title: 'The Pragmatic Programmer', author: 'David Thomas', description: 'Your journey to mastery.', price: 45, category: 'programming', stock: 10, image: 'default' },
  { title: 'Clean Code', author: 'Robert C. Martin', description: 'A Handbook of Agile Software Craftsmanship.', price: 40, category: 'programming', stock: 20, image: 'default' },
  { title: 'Design Patterns', author: 'Erich Gamma', description: 'Elements of Reusable Object-Oriented Software.', price: 55, category: 'programming', stock: 5, image: 'default' },
  { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', description: '189 Programming Questions and Solutions.', price: 35, category: 'programming', stock: 50, image: 'default' },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', description: 'Comprehensive guide to algorithms.', price: 85, category: 'programming', stock: 12, image: 'default' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', description: 'Unearthing the Excellence in JavaScript.', price: 29, category: 'programming', stock: 15, image: 'default' },
  { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', description: 'A Modern Introduction to Programming.', price: 39, category: 'programming', stock: 8, image: 'default' },
  { title: 'You Don\'t Know JS', author: 'Kyle Simpson', description: 'Up & Going.', price: 25, category: 'programming', stock: 30, image: 'default' },
  { title: 'Python Crash Course', author: 'Eric Matthes', description: 'A Hands-On, Project-Based Introduction to Programming.', price: 30, category: 'programming', stock: 40, image: 'default' },
  { title: 'Automate the Boring Stuff with Python', author: 'Al Sweigart', description: 'Practical programming for total beginners.', price: 28, category: 'programming', stock: 25, image: 'default' },
  { title: 'The Lean Startup', author: 'Eric Ries', description: 'How Today\'s Entrepreneurs Use Continuous Innovation.', price: 22, category: 'business', stock: 18, image: 'default' },
  { title: 'Zero to One', author: 'Peter Thiel', description: 'Notes on Startups, or How to Build the Future.', price: 20, category: 'business', stock: 22, image: 'default' },
  { title: 'Good to Great', author: 'Jim Collins', description: 'Why Some Companies Make the Leap...And Others Don\'t.', price: 25, category: 'business', stock: 14, image: 'default' },
  { title: 'Dare to Lead', author: 'Brené Brown', description: 'Brave Work. Tough Conversations. Whole Hearts.', price: 24, category: 'business', stock: 19, image: 'default' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'Insights into how choices are made.', price: 18, category: 'science', stock: 28, image: 'default' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', description: 'A Brief History of Humankind.', price: 21, category: 'science', stock: 35, image: 'default' },
  { title: 'Cosmos', author: 'Carl Sagan', description: 'The story of cosmic evolution.', price: 19, category: 'science', stock: 12, image: 'default' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', description: 'Evolution from a gene\'s eye view.', price: 17, category: 'science', stock: 9, image: 'default' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'From the Big Bang to Black Holes.', price: 16, category: 'science', stock: 21, image: 'default' },
  { title: 'The Elements of Style', author: 'William Strunk Jr.', description: 'The classic manual on writing.', price: 10, category: 'language', stock: 50, image: 'default' },
  { title: 'Word Power Made Easy', author: 'Norman Lewis', description: 'The Complete Handbook for Building a Superior Vocabulary.', price: 14, category: 'language', stock: 45, image: 'default' },
  { title: 'Fluent in 3 Months', author: 'Benny Lewis', description: 'How Anyone at Any Age Can Learn to Speak Any Language.', price: 15, category: 'language', stock: 20, image: 'default' },
  { title: 'The Design of Everyday Things', author: 'Don Norman', description: 'Revised and Expanded Edition.', price: 23, category: 'design', stock: 16, image: 'default' },
  { title: 'Don\'t Make Me Think', author: 'Steve Krug', description: 'A Common Sense Approach to Web Usability.', price: 32, category: 'design', stock: 14, image: 'default' },
  { title: 'Steal Like an Artist', author: 'Austin Kleon', description: '10 Things Nobody Told You About Being Creative.', price: 12, category: 'design', stock: 30, image: 'default' },
  { title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', description: 'Being a very-simplest introduction to calculus.', price: 18, category: 'math', stock: 11, image: 'default' },
  { title: 'How to Solve It', author: 'G. Polya', description: 'A new aspect of mathematical method.', price: 20, category: 'math', stock: 13, image: 'default' },
  { title: 'The Joy of x', author: 'Steven Strogatz', description: 'A Guided Tour of Math, from One to Infinity.', price: 16, category: 'math', stock: 17, image: 'default' },
  { title: 'Gödel, Escher, Bach', author: 'Douglas R. Hofstadter', description: 'An Eternal Golden Braid.', price: 25, category: 'math', stock: 6, image: 'default' },
  { title: 'Flatland', author: 'Edwin A. Abbott', description: 'A Romance of Many Dimensions.', price: 9, category: 'math', stock: 22, image: 'default' },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    const existingTitles = await Book.find().select('title');
    const existingSet = new Set(existingTitles.map(b => b.title));

    let inserted = 0;
    for (const book of dummyBooks) {
      if (!existingSet.has(book.title)) {
        await Book.create(book);
        console.log(`+ Added: ${book.title}`);
        inserted++;
      } else {
        console.log(`- Skipped: ${book.title}`);
      }
    }

    console.log(`\n🎉 Seeded ${inserted} new books! Run imageUpdater.js next.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
