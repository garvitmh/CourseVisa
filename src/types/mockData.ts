import { Subject, Course, Video } from './index';

/* Subjects Database - 35+ items across 7 categories */
export const subjectsDB: Record<string, Subject[]> = {
  kindergarten: [
    { id: 'kg1', title: 'Alphabet', description: 'Learning the alphabet from A to Z.', icon: 'A', color: '#f78f8f' },
    { id: 'kg2', title: 'Numbers', description: 'Counting and basic number concepts.', icon: '1', color: '#fcc17e' },
    { id: 'kg3', title: 'Colors', description: 'Identifying and naming primary colors.', icon: 'C', color: '#f9ff97' },
    { id: 'kg4', title: 'Shapes', description: 'Recognizing circles, squares, and triangles.', icon: 'S', color: '#aef7a1' },
  ],
  highschool: [
    { id: 'hs1', title: 'Standard One', description: 'A foundation reflecting 7 important concepts.', icon: '1', color: '#f78f8f' },
    { id: 'hs2', title: 'Standard Two', description: 'Builds on the foundations of Standard 1.', icon: '2', color: '#fcc17e' },
    { id: 'hs3', title: 'Standard Three', description: 'Applies to all services delivering personal care.', icon: '3', color: '#f9ff97' },
    { id: 'hs4', title: 'Standard Four', description: 'Focuses on service and support for daily living.', icon: '4', color: '#aef7a1' },
    { id: 'hs5', title: 'Standard Five', description: 'Learning Resources ensure the school has the resources.', icon: '5', color: '#74f2ff' },
    { id: 'hs6', title: 'Standard Six', description: 'Requires an organisation to have a system.', icon: '6', color: '#8ab6f9' },
    { id: 'hs7', title: 'Standard Seven', description: 'Mandates that leaders of health service.', icon: '7', color: '#a699f7' },
    { id: 'hs8', title: 'Standard Eight', description: 'Course from NCERT Solutions help students.', icon: '8', color: '#ffc6ff' },
    { id: 'hs9', title: 'Standard Nine', description: 'Defines governance, leadership and culture.', icon: '9', color: '#f1c0e8' },
    { id: 'hs10', title: 'O-Level', description: 'Prepares students for further academic pursuits.', icon: 'O', color: '#cfbaf0' },
    { id: 'hs11', title: 'A-Level', description: 'Advanced level qualifications for university entry.', icon: 'A', color: '#a3c4f3' },
  ],
  college: [
    { id: 'cl1', title: 'Calculus', description: 'Advanced mathematical concepts for university.', icon: 'C', color: '#8ab6f9' },
    { id: 'cl2', title: 'Physics', description: 'Understanding the physical world and its laws.', icon: 'P', color: '#a699f7' },
    { id: 'cl3', title: 'Literature', description: 'Analysis of classic and modern texts.', icon: 'L', color: '#ffc6ff' },
    { id: 'cl4', title: 'History', description: 'Studying past events and their impact.', icon: 'H', color: '#f1c0e8' },
  ],
  computer: [
    { id: 'cs1', title: 'Programming', description: 'Learn to code in Python and JavaScript.', icon: 'P', color: '#74f2ff' },
    { id: 'cs2', title: 'Networking', description: 'Understand how the internet and networks work.', icon: 'N', color: '#8ab6f9' },
  ],
  science: [
    { id: 'sci1', title: 'Biology', description: 'The study of life and living organisms.', icon: 'B', color: '#8cc8ca' },
    { id: 'sci2', title: 'Chemistry', description: 'The science of matter and its properties.', icon: 'C', color: '#3a6a8a' },
  ],
  engineering: [
    { id: 'eng1', title: 'Mechanics', description: 'The study of motion, forces, and energy.', icon: 'M', color: '#e6910a' },
    { id: 'eng2', title: 'Circuits', description: 'The fundamentals of electrical circuits.', icon: 'E', color: '#101a30' },
  ],
};

/* Courses Database - 28 courses */
export const coursesDB: Course[] = [
  // Kindergarten Courses
  { id: '1', subjectId: 'kg1', category: 'kindergarten', title: 'Fun with Phonics', rating: 5, price: 499, image: 'https://placehold.co/300x200/ffadad/000?text=Phonics' },
  { id: '2', subjectId: 'kg1', category: 'kindergarten', title: 'Alphabet Stories', rating: 4, price: 449, image: 'https://placehold.co/300x200/ffadad/000?text=Stories' },
  { id: '3', subjectId: 'kg2', category: 'kindergarten', title: 'Counting to 100', rating: 5, price: 599, image: 'https://placehold.co/300x200/ffd6a5/000?text=1-100' },
  { id: '4', subjectId: 'kg2', category: 'kindergarten', title: 'Simple Addition', rating: 4, price: 549, image: 'https://placehold.co/300x200/ffd6a5/000?text=1+1' },
  // High School Courses
  { id: '5', subjectId: 'hs1', category: 'highschool', title: 'The Three Musketeers', rating: 5, price: 999, image: 'https://placehold.co/300x200/fca311/ffffff?text=Course' },
  { id: '6', subjectId: 'hs1', category: 'highschool', title: 'History of Ancient Rome', rating: 4, price: 899, image: 'https://placehold.co/300x200/14213d/ffffff?text=Course' },
  { id: '7', subjectId: 'hs2', category: 'highschool', title: 'Introduction to Algebra', rating: 5, price: 1299, image: 'https://placehold.co/300x200/003049/ffffff?text=Course' },
  { id: '8', subjectId: 'hs2', category: 'highschool', title: 'Basic Geometry', rating: 3, price: 799, image: 'https://placehold.co/300x200/d62828/ffffff?text=Course' },
  { id: '9', subjectId: 'hs3', category: 'highschool', title: 'World War II History', rating: 5, price: 999, image: 'https://placehold.co/300x200/f77f00/ffffff?text=Course' },
  { id: '10', subjectId: 'hs3', category: 'highschool', title: 'The American Revolution', rating: 4, price: 899, image: 'https://placehold.co/300x200/f77f00/ffffff?text=Course' },
  { id: '11', subjectId: 'hs4', category: 'highschool', title: 'Biology Basics', rating: 5, price: 1499, image: 'https://placehold.co/300x200/2a9d8f/ffffff?text=Course' },
  { id: '12', subjectId: 'hs4', category: 'highschool', title: 'Intro to Chemistry', rating: 4, price: 1399, image: 'https://placehold.co/300x200/2a9d8f/ffffff?text=Course' },
  // College Courses
  { id: '13', subjectId: 'cl1', category: 'college', title: 'Advanced Calculus', rating: 5, price: 2499, image: 'https://placehold.co/300x200/a0c4ff/000?text=Calculus' },
  { id: '14', subjectId: 'cl1', category: 'college', title: 'Linear Algebra', rating: 4, price: 2299, image: 'https://placehold.co/300x200/a0c4ff/000?text=Algebra' },
  { id: '15', subjectId: 'cl2', category: 'college', title: 'Quantum Physics', rating: 5, price: 2999, image: 'https://placehold.co/300x200/bdb2ff/000?text=Physics' },
  { id: '16', subjectId: 'cl2', category: 'college', title: 'Thermodynamics', rating: 4, price: 2799, image: 'https://placehold.co/300x200/bdb2ff/000?text=Thermo' },
  // Computer Courses
  { id: '17', subjectId: 'cs1', category: 'computer', title: 'Python for Beginners', rating: 5, price: 1999, image: 'https://placehold.co/300x200/9bf6ff/000?text=Python' },
  { id: '18', subjectId: 'cs1', category: 'computer', title: 'JavaScript Essentials', rating: 5, price: 1999, image: 'https://placehold.co/300x200/9bf6ff/000?text=JS' },
  { id: '19', subjectId: 'cs2', category: 'computer', title: 'Cybersecurity Basics', rating: 4, price: 2499, image: 'https://placehold.co/300x200/a0c4ff/000?text=Security' },
  { id: '20', subjectId: 'cs2', category: 'computer', title: 'Cloud Computing (AWS)', rating: 4, price: 2999, image: 'https://placehold.co/300x200/a0c4ff/000?text=AWS' },
  // Science Courses
  { id: '21', subjectId: 'sci1', category: 'science', title: 'Genetics and Evolution', rating: 5, price: 1599, image: 'https://placehold.co/300x200/a8dadc/000?text=Genetics' },
  { id: '22', subjectId: 'sci1', category: 'science', title: 'Cellular Biology', rating: 4, price: 1499, image: 'https://placehold.co/300x200/a8dadc/000?text=Cells' },
  { id: '23', subjectId: 'sci2', category: 'science', title: 'Organic Chemistry', rating: 5, price: 1799, image: 'https://placehold.co/300x200/457b9d/FFF?text=Chemistry' },
  { id: '24', subjectId: 'sci2', category: 'science', title: 'The Periodic Table', rating: 4, price: 1699, image: 'https://placehold.co/300x200/457b9d/FFF?text=Elements' },
  // Engineering Courses
  { id: '25', subjectId: 'eng1', category: 'engineering', title: 'Statics and Dynamics', rating: 5, price: 3499, image: 'https://placehold.co/300x200/fca311/000?text=Statics' },
  { id: '26', subjectId: 'eng1', category: 'engineering', title: 'Materials Science', rating: 4, price: 3299, image: 'https://placehold.co/300x200/fca311/000?text=Materials' },
  { id: '27', subjectId: 'eng2', category: 'engineering', title: 'Analog Circuits', rating: 5, price: 3999, image: 'https://placehold.co/300x200/14213d/FFF?text=Circuits' },
  { id: '28', subjectId: 'eng2', category: 'engineering', title: 'Digital Logic Design', rating: 4, price: 3799, image: 'https://placehold.co/300x200/14213d/FFF?text=Logic' },
];

/* Video Playlists Database */
export const videoPlaylistsDB: Record<string, Video[]> = {
  '1': [
    { id: 'v1', title: 'Animated Stories - Types of Teacher', videoUrl: 'video/classes1.mp4', duration: '10:10' },
    { id: 'v2', title: 'Phonics Basics - Part 1', videoUrl: 'video/classes2.mp4', duration: '12:18' },
    { id: 'v3', title: 'Phonics Basics - Part 2', videoUrl: 'video/classes3.mp4', duration: '11:39' },
    { id: 'v4', title: 'Practice Exercise', videoUrl: 'video/classes4.mp4', duration: '9:51' },
  ],
  '2': [
    { id: 'v5', title: 'Letter Recognition', videoUrl: 'video/classes1.mp4', duration: '14:20' },
    { id: 'v6', title: 'Alphabet Song', videoUrl: 'video/classes2.mp4', duration: '8:45' },
  ],
  // Add more playlists as needed
};

/* Utility function to get courses by category */
export const getCoursesByCategory = (category: string): Course[] => {
  if (category === 'all') return coursesDB;
  return coursesDB.filter(course => course.category === category);
};

/* Utility function to get subjects by category */
export const getSubjectsByCategory = (category: string): Subject[] => {
  if (category === 'all') return Object.values(subjectsDB).flat();
  return subjectsDB[category] || [];
};

/* Utility function to search courses */
export const searchCourses = (term: string): Course[] => {
  const lowerTerm = term.toLowerCase();
  return coursesDB.filter(course =>
    course.title.toLowerCase().includes(lowerTerm) ||
    course.description?.toLowerCase().includes(lowerTerm)
  );
};

/* Utility function to get course by ID */
export const getCourseById = (id: string): Course | undefined => {
  return coursesDB.find(course => course.id === id);
};

/* Utility function to get videos for a course */
export const getVideosByCategory = (courseId: string): Video[] => {
  return videoPlaylistsDB[courseId] || [];
};
