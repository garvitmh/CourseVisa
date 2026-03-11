const courses = [
  {
    title: 'Fun with Phonics',
    subjectId: 'kg1',
    category: 'kindergarten',
    rating: 5,
    price: 499,
    image: 'https://placehold.co/300x200/ffadad/000?text=Phonics',
    description: 'A fun way for kids to learn phonics through stories and games.',
    videos: [
      { title: 'Introduction to Phonics', videoUrl: 'video/classes1.mp4', duration: '10:10' },
      { title: 'The Letter A', videoUrl: 'video/classes2.mp4', duration: '12:18' }
    ]
  },
  {
    title: 'Python for Beginners',
    subjectId: 'cs1',
    category: 'computer',
    rating: 5,
    price: 1999,
    image: 'https://placehold.co/300x200/9bf6ff/000?text=Python',
    description: 'Learn the fundamentals of Python programming from scratch.',
    videos: [
      { title: 'Python Installation', videoUrl: 'video/classes1.mp4', duration: '15:20' },
      { title: 'Variables and Data Types', videoUrl: 'video/classes2.mp4', duration: '20:45' }
    ]
  }
];

module.exports = courses;
