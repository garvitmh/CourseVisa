const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://garvitmaheshwari000_db_user:hmAfgHaQm8o4i1vz@cluster0.olkrtm5.mongodb.net/coursiva?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
    const db = mongoose.connection.db;
    const books = await db.collection('books').find().toArray();
    console.log('BOOKS:', JSON.stringify(books, null, 2));
    const courses = await db.collection('courses').find().toArray();
    console.log('COURSE IMAGES:', courses.filter(c => c.image).map(c => c.image));
    const users = await db.collection('users').find().toArray();
    console.log('USER AVATARS:', users.filter(u => u.avatar).map(u => u.avatar));
    process.exit(0);
});
