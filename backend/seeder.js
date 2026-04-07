const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Book = require('./src/models/Book');
const MentorApplication = require('./src/models/MentorApplication');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const users = [
  { username: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
  { username: 'John Mentor', email: 'mentor@test.com', password: 'password123', role: 'mentor' },
  { username: 'Jane Smith', email: 'jane@test.com', password: 'password123', role: 'mentor' },
  { username: 'Dr. Sarah Wilson', email: 'sarah@test.com', password: 'password123', role: 'mentor' },
  { username: 'Robert Brown', email: 'robert@test.com', password: 'password123', role: 'student' },
  { username: 'Emily Davis', email: 'emily@test.com', password: 'password123', role: 'student' },
  { username: 'Michael Wilson', email: 'michael@test.com', password: 'password123', role: 'student' },
  { username: 'Student User', email: 'student@test.com', password: 'password123', role: 'student' }
];

const mockMentorApplications = [
  {
    name: 'Alice Green',
    email: 'alice@test.com',
    phone: '1234567890',
    expertise: 'React Native',
    experience: 5,
    qualifications: 'B.Tech in CS, 5 years at TechCorp',
    bio: 'I love mobile dev. Expert in Expo and Native modules.',
    linkedinUrl: 'https://linkedin.com/in/alicegreen',
    status: 'pending'
  },
  {
    name: 'Bob White',
    email: 'bob@test.com',
    phone: '9876543210',
    expertise: 'Machine Learning',
    experience: 8,
    qualifications: 'PhD in AI from Stanford',
    bio: 'AI researcher focused on Natural Language Processing.',
    linkedinUrl: 'https://linkedin.com/in/bobwhite',
    status: 'pending'
  },
  {
    name: 'Charlie Black',
    email: 'charlie@test.com',
    phone: '5554443333',
    expertise: 'Cybersecurity',
    experience: 3,
    qualifications: 'Certified ethical hacker (CEH)',
    bio: 'Securing the web one site at a time.',
    linkedinUrl: 'https://linkedin.com/in/charlieblack',
    status: 'pending'
  }
];

const mockBooks = [
  { title: 'The Pragmatic Programmer', author: 'Andy Hunt', description: 'Your journey to mastery. Covers best practices, tips, and tricks for building robust software across all domains.', price: 599, category: 'programming', stock: 15, image: 'https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg' },
  { title: 'Clean Architecture', author: 'Robert C. Martin', description: 'A craftsman\'s guide to software structure and design. Learn how to build maintainable and scalable systems.', price: 649, category: 'programming', stock: 8, image: 'https://covers.openlibrary.org/b/isbn/9780134494166-L.jpg' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', description: 'The big ideas behind reliable, scalable, and maintainable systems. A must-read for backend engineers.', price: 799, category: 'programming', stock: 12, image: 'https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg' },
  { title: 'To Mock a Mockingbird', author: 'Raymond Smullyan', description: 'An entertaining collection of logical puzzles that introduce combinatory logic in an accessible way.', price: 299, category: 'math', stock: 20, image: 'https://covers.openlibrary.org/b/isbn/9780192801425-L.jpg' },
  { title: 'Deep Learning', author: 'Ian Goodfellow', description: 'A comprehensive guide to building AI systems. Covers neural networks, optimization, and practical applications.', price: 899, category: 'science', stock: 5, image: 'https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', description: 'Unearths the best features of JavaScript that make it an outstanding object-oriented programming language.', price: 399, category: 'programming', stock: 25, image: 'https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg' },
  { title: 'The Lean Startup', author: 'Eric Ries', description: 'How constant innovation and validated learning creates radically successful businesses with less waste.', price: 349, category: 'business', stock: 30, image: 'https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'Explores the two systems of thought that drive the way we think and make choices. A Nobel Prize winner\'s masterpiece.', price: 329, category: 'business', stock: 40, image: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg' }
];

const mockCourses = [
  // --- KINDERGARTEN ---
  {
    title: 'Fun with Phonics',
    description: 'A colorful, interactive phonics course designed for young learners ages 3-5. Learn letter sounds, simple words, and build the foundation for reading through games and songs.',
    subjectId: 'kg-phonics',
    category: 'kindergarten',
    price: 499,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1514059431411-cfac4e3346d0?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Welcome to Phonics!', videoUrl: '', duration: '8:00' },
      { title: 'The Letter A and B', videoUrl: '', duration: '10:30' },
      { title: 'Simple Word Blends', videoUrl: '', duration: '12:00' },
    ]
  },
  {
    title: 'Numbers and Counting',
    description: 'Help your child discover the magic of numbers! This animated course covers counting 1-100, basic addition & subtraction with fun visual games and songs.',
    subjectId: 'kg-math',
    category: 'kindergarten',
    price: 399,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Counting 1 to 10', videoUrl: '', duration: '9:00' },
      { title: 'Counting 11 to 20', videoUrl: '', duration: '9:30' },
    ]
  },
  {
    title: 'Creative Arts for Kids',
    description: 'Inspire creativity in your child with drawing, painting, and crafting lessons. Step-by-step projects using simple household materials that spark imagination.',
    subjectId: 'kg-art',
    category: 'kindergarten',
    price: 299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Drawing Shapes', videoUrl: '', duration: '11:00' },
      { title: 'Finger Painting Fun', videoUrl: '', duration: '13:00' },
    ]
  },

  // --- HIGH SCHOOL ---
  {
    title: 'Algebra Fundamentals',
    description: 'Master algebra from variables to quadratic equations. Aligned with standard curricula for grades 8-10, with step-by-step explanations and practice problems.',
    subjectId: 'hs-algebra',
    category: 'highschool',
    price: 799,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1632516643720-e7f5d7d6eca4?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Introduction to Variables', videoUrl: '', duration: '15:00' },
      { title: 'Linear Equations', videoUrl: '', duration: '18:30' },
      { title: 'Quadratic Equations', videoUrl: '', duration: '20:00' },
    ]
  },
  {
    title: 'World History Explored',
    description: 'Journey through human civilization from ancient Mesopotamia to the 21st century. Interactive timelines, primary sources, and engaging narratives for grade 9-12.',
    subjectId: 'hs-history',
    category: 'highschool',
    price: 699,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Ancient Civilizations', videoUrl: '', duration: '22:00' },
      { title: 'Rise of Empires', videoUrl: '', duration: '19:00' },
    ]
  },
  {
    title: 'English Literature & Writing',
    description: 'Develop critical reading, analytical writing, and literary appreciation. Study Shakespeare, modern novels, and poetry while honing your essay-writing skills.',
    subjectId: 'hs-english',
    category: 'highschool',
    price: 749,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Introduction to Literary Analysis', videoUrl: '', duration: '16:00' },
      { title: 'Shakespeare: Romeo & Juliet', videoUrl: '', duration: '25:00' },
    ]
  },
  {
    title: 'High School Physics',
    description: 'A complete high school physics course covering mechanics, electricity, magnetism, waves and optics. Includes simulations and lab activity guides.',
    subjectId: 'hs-physics',
    category: 'highschool',
    price: 899,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Forces and Motion', videoUrl: '', duration: '20:00' },
      { title: 'Energy and Work', videoUrl: '', duration: '18:00' },
    ]
  },

  // --- COLLEGE ---
  {
    title: 'Calculus 101',
    description: 'Build a strong foundation in differential and integral calculus. Covers limits, derivatives, integrals, and the Fundamental Theorem of Calculus with real-world applications.',
    subjectId: 'college-calc',
    category: 'college',
    price: 1299,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Limits and Continuity', videoUrl: '', duration: '25:00' },
      { title: 'Derivatives Defined', videoUrl: '', duration: '30:00' },
      { title: 'The Integral', videoUrl: '', duration: '28:00' },
    ]
  },
  {
    title: 'Microeconomics',
    description: 'Understand how individuals and firms make decisions. Covers supply & demand, market equilibrium, consumer theory, and game theory with real-world case studies.',
    subjectId: 'college-micro',
    category: 'college',
    price: 999,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Supply and Demand', videoUrl: '', duration: '22:00' },
      { title: 'Market Structures', videoUrl: '', duration: '20:00' },
    ]
  },
  {
    title: 'Introduction to Psychology',
    description: 'Explore the science of the mind and human behavior. Topics include perception, cognition, emotion, personality, social psychology, and mental health.',
    subjectId: 'college-psych',
    category: 'college',
    price: 1099,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'History of Psychology', videoUrl: '', duration: '20:00' },
      { title: 'Brain and Behavior', videoUrl: '', duration: '24:00' },
    ]
  },
  {
    title: 'Organic Chemistry',
    description: 'Master the structures, reactions, and mechanisms of carbon-based compounds. Essential for pre-med, biology, and chemistry majors with step-by-step synthesis problems.',
    subjectId: 'college-orgchem',
    category: 'college',
    price: 1499,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Introduction to Functional Groups', videoUrl: '', duration: '28:00' },
      { title: 'Alkanes and Alkenes', videoUrl: '', duration: '30:00' },
    ]
  },

  // --- COMPUTER ---
  {
    title: 'Python for Beginners',
    description: 'Learn Python from zero to hero. Covers data types, loops, functions, OOP, file handling, and a final project building a command-line application.',
    subjectId: 'cs-python',
    category: 'computer',
    price: 1299,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bfce8?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Getting Started with Python', videoUrl: '', duration: '18:00' },
      { title: 'Variables and Data Types', videoUrl: '', duration: '22:00' },
      { title: 'Control Flow', videoUrl: '', duration: '20:00' },
    ]
  },
  {
    title: 'Full-Stack React & Node.js',
    description: 'Build production-ready web apps with React on the frontend and Node.js/Express on the backend. Includes REST API design, authentication, and MongoDB integration.',
    subjectId: 'cs-fullstack',
    category: 'computer',
    price: 1999,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'React Fundamentals', videoUrl: '', duration: '30:00' },
      { title: 'Building RESTful APIs', videoUrl: '', duration: '35:00' },
      { title: 'Database with MongoDB', videoUrl: '', duration: '28:00' },
    ]
  },
  {
    title: 'Data Structures & Algorithms',
    description: 'Ace your technical interviews and write better code. Covers arrays, linked lists, trees, graphs, sorting, searching, and dynamic programming with practice problems.',
    subjectId: 'cs-dsa',
    category: 'computer',
    price: 1799,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Arrays and Strings', videoUrl: '', duration: '25:00' },
      { title: 'Linked Lists', videoUrl: '', duration: '28:00' },
      { title: 'Binary Trees', videoUrl: '', duration: '30:00' },
    ]
  },
  {
    title: 'Modern Web Design (HTML/CSS)',
    description: 'Create stunning, responsive websites from scratch. Covers semantic HTML, Flexbox, Grid, CSS animations, and modern design principles with portfolio projects.',
    subjectId: 'cs-webdesign',
    category: 'computer',
    price: 999,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'HTML Fundamentals', videoUrl: '', duration: '20:00' },
      { title: 'CSS Flexbox', videoUrl: '', duration: '22:00' },
      { title: 'CSS Grid', videoUrl: '', duration: '20:00' },
    ]
  },

  // --- SCIENCE ---
  {
    title: 'Astrophysics: Our Universe',
    description: 'Explore the cosmos from stellar formation to black holes and the Big Bang. This visually rich course is accessible to anyone with basic physics knowledge.',
    subjectId: 'sci-astro',
    category: 'science',
    price: 1199,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'The Scale of the Universe', videoUrl: '', duration: '25:00' },
      { title: 'Stars and Their Life Cycles', videoUrl: '', duration: '28:00' },
    ]
  },
  {
    title: 'Human Biology & Anatomy',
    description: 'A comprehensive tour of the human body. Covers all major systems including the nervous, cardiovascular, digestive, and immune systems with 3D diagrams.',
    subjectId: 'sci-biology',
    category: 'science',
    price: 1099,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Introduction to Human Anatomy', videoUrl: '', duration: '22:00' },
      { title: 'The Nervous System', videoUrl: '', duration: '26:00' },
    ]
  },
  {
    title: 'Environmental Science',
    description: 'Understand our planet — ecosystems, climate change, biodiversity, and sustainability. Gain the knowledge to make informed environmental decisions.',
    subjectId: 'sci-env',
    category: 'science',
    price: 799,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Ecosystems Explained', videoUrl: '', duration: '20:00' },
      { title: 'Climate Change Fundamentals', videoUrl: '', duration: '24:00' },
    ]
  },

  // --- ENGINEERING ---
  {
    title: 'Introduction to Mechanical Engineering',
    description: 'Foundation of mechanical engineering: thermodynamics, fluid mechanics, statics, dynamics, and materials science. Ideal for first-year engineering students.',
    subjectId: 'eng-mech',
    category: 'engineering',
    price: 1499,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1563284050-42211516e864?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Introduction to Thermodynamics', videoUrl: '', duration: '28:00' },
      { title: 'Fluid Mechanics Basics', videoUrl: '', duration: '25:00' },
    ]
  },
  {
    title: 'Circuit Analysis & Electronics',
    description: 'Master Ohm\'s Law, Kirchhoff\'s Laws, AC/DC circuits, op-amps, and transistors. Build confidence designing and analyzing real-world electronic circuits.',
    subjectId: 'eng-circuits',
    category: 'engineering',
    price: 1299,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: "Ohm's Law & Resistors", videoUrl: '', duration: '20:00' },
      { title: "Kirchhoff's Laws", videoUrl: '', duration: '22:00' },
      { title: 'Op-Amp Circuits', videoUrl: '', duration: '25:00' },
    ]
  },
  {
    title: 'Structural Engineering Basics',
    description: 'Learn how civil engineers design safe structures. Covers loads, beams, columns, foundations, and material properties with case studies of famous bridges and buildings.',
    subjectId: 'eng-structural',
    category: 'engineering',
    price: 1199,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
    videos: [
      { title: 'Types of Loads', videoUrl: '', duration: '18:00' },
      { title: 'Beam Analysis', videoUrl: '', duration: '22:00' },
    ]
  },
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Book.deleteMany();
    await MentorApplication.deleteMany();

    const createdUsers = await User.create(users);
    const mentors = createdUsers.filter(u => u.role === 'mentor');

    const coursesToCreate = mockCourses.map((c, index) => ({
      ...c,
      instructor: mentors[index % mentors.length]._id
    }));

    await Course.create(coursesToCreate);
    await Book.create(mockBooks);
    await MentorApplication.create(mockMentorApplications);

    console.log(`✅ Data Imported: ${coursesToCreate.length} courses, ${mockBooks.length} books, ${users.length} users`);
    process.exit();
  } catch (err) {
    console.error('❌ Error importing data:', err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Book.deleteMany();
    await MentorApplication.deleteMany();
    console.log('🗑️ Data Destroyed');
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
} else {
  console.log('Missing argument (-i for import, -d for delete)');
  process.exit(1);
}
