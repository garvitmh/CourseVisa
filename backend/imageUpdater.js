const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// We need the models
const Course = require('./src/models/Course');
const Book = require('./src/models/Book');

// Cloudinary config
const CLOUD_NAME = 'dgkzstbui';
const UPLOAD_PRESET = 'e-learning';

const IMAGE_MAP = {
  // --- COURSES ---
  'Numbers and Counting': 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&q=80',
  'Fun with Phonics': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'World History Explored': 'https://images.unsplash.com/photo-1447069387366-22a36d2e8b60?w=800&q=80',
  'Creative Arts for Kids': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  'Algebra Fundamentals': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80',
  'Calculus 101': 'https://images.unsplash.com/photo-1632516643720-17fec04f1208?w=800&q=80',
  'Introduction to Psychology': 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80',
  'Organic Chemistry': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80',
  'Microeconomics': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  'Python for Beginners': 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80',
  'Full-Stack React & Node.js': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  'Modern Web Design (HTML/CSS)': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
  'Data Structures & Algorithms': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'Human Biology & Anatomy': 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80',
  'Astrophysics: Our Universe': 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80',
  'Environmental Science': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Circuit Analysis & Electronics': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'Introduction to Mechanical Engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  'Structural Engineering Basics': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
  'English Literature & Writing': 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?w=800&q=80',
  'High School Physics': 'https://images.unsplash.com/photo-1555541571-5586940ffbfa?w=800&q=80',

  // --- BOOKS ---
  'Clean Architecture': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  'To Mock a Mockingbird': 'https://images.unsplash.com/photo-1555679427-1f6dfcce943b?w=800&q=80',
  'Designing Data-Intensive Applications': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  'Deep Learning': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
  'The Pragmatic Programmer': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
  'JavaScript: The Good Parts': 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
  'The Lean Startup': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
  'Thinking, Fast and Slow': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80',

  // Fallback
  'default': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80'
};

const uploadToCloudinary = async (imageUrl) => {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', imageUrl);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const res = await fetch(url, { method: 'POST', body: formData });
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

const updateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Update Courses
    const courses = await Course.find();
    console.log(`Found ${courses.length} courses to update.`);
    for (let course of courses) {
      if (course.image && course.image.includes('cloudinary.com') && !course.image.includes('default')) {
        console.log(`Skipping ${course.title}, already has custom image.`);
        continue;
      }
      const unsplashUrl = IMAGE_MAP[course.title] || IMAGE_MAP.default;
      console.log(`Uploading for course: ${course.title}...`);
      const cloudinaryUrl = await uploadToCloudinary(unsplashUrl);
      if (cloudinaryUrl) {
        course.image = cloudinaryUrl;
        await course.save();
        console.log(`✅ Updated ${course.title}`);
      }
    }

    // Update Books
    const books = await Book.find();
    console.log(`Found ${books.length} books to update.`);
    const dynamicBookFallbacks = [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80'
    ];

    for (let book of books) {
      if (book.image && book.image.includes('cloudinary.com') && !book.image.includes('default')) {
        console.log(`Skipping ${book.title}, already has custom image.`);
        continue;
      }
      const isMapped = IMAGE_MAP[book.title] !== undefined;
      const unsplashUrl = isMapped ? IMAGE_MAP[book.title] : dynamicBookFallbacks[Math.floor(Math.random() * dynamicBookFallbacks.length)];
      console.log(`Uploading for book: ${book.title}...`);
      const cloudinaryUrl = await uploadToCloudinary(unsplashUrl);
      if (cloudinaryUrl) {
        book.image = cloudinaryUrl;
        await book.save();
        console.log(`✅ Updated ${book.title}`);
      }
    }

    console.log('🎉 Database image update complete!');
    process.exit();
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

updateImages();
