require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const Assignment = require('./models/Assignment');
const Quiz = require('./models/Quiz');
const Note = require('./models/Note');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany({});
        await Course.deleteMany({});
        await Assignment.deleteMany({});
        await Quiz.deleteMany({});
        await Note.deleteMany({});

        console.log('Data cleared');

        // Create Users (Indian Names)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('password123', salt);

        const teacher1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul.sharma@university.edu',
            passwordHash,
            role: 'teacher',
            department: 'Computer Science',
            bio: 'Senior Professor in Computer Science with 15 years of experience.'
        });

        const teacher2 = await User.create({
            name: 'Priya Verma',
            email: 'priya.verma@university.edu',
            passwordHash,
            role: 'teacher',
            department: 'Mathematics',
            bio: 'Expert in Applied Mathematics and Statistics.'
        });

        const student1 = await User.create({
            name: 'Ankit Mehra',
            email: 'ankit.mehra@student.edu',
            passwordHash,
            role: 'student',
            department: 'Computer Science',
            year: 3
        });

        const student2 = await User.create({
            name: 'Neha Singh',
            email: 'neha.singh@student.edu',
            passwordHash,
            role: 'student',
            department: 'Computer Science',
            year: 2
        });

        const student3 = await User.create({
            name: 'Vikram Patel',
            email: 'vikram.patel@student.edu',
            passwordHash,
            role: 'student',
            department: 'Mathematics',
            year: 1
        });

        console.log('Users created');

        // Create Courses
        const course1 = await Course.create({
            title: 'Advanced Web Development',
            description: 'Learn modern web technologies including React, Node.js, and MongoDB.',
            department: 'Computer Science',
            teacher: teacher1._id,
            isPublished: true,
            tags: ['Web', 'React', 'Node.js']
        });

        const course2 = await Course.create({
            title: 'Data Structures & Algorithms',
            description: 'Master the fundamentals of DSA with Java.',
            department: 'Computer Science',
            teacher: teacher1._id,
            isPublished: true,
            tags: ['DSA', 'Java', 'Algorithms']
        });

        const course3 = await Course.create({
            title: 'Applied Statistics',
            description: 'Introduction to statistical methods for data analysis.',
            department: 'Mathematics',
            teacher: teacher2._id,
            isPublished: true,
            tags: ['Math', 'Statistics']
        });

        console.log('Courses created');

        // Create Notes
        await Note.create({
            course: course1._id,
            title: 'React Hooks Introduction',
            content: 'Detailed explanation of useState and useEffect.',
            type: 'text'
        });

        await Note.create({
            course: course1._id,
            title: 'Node.js Architecture PDF',
            fileUrl: 'https://example.com/nodejs-arch.pdf',
            type: 'pdf'
        });

        console.log('Notes created');

        // Create Assignments
        await Assignment.create({
            course: course1._id,
            title: 'Build a Todo App',
            description: 'Create a full-stack Todo application using MERN stack.',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            maxMarks: 100
        });

        await Assignment.create({
            course: course2._id,
            title: 'Implement Binary Search Tree',
            description: 'Write a Java program to implement BST with insertion and deletion.',
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            maxMarks: 50
        });

        console.log('Assignments created');

        // Create Quizzes
        await Quiz.create({
            course: course1._id,
            title: 'React Fundamentals Quiz',
            description: 'Test your knowledge of components, props, and state.',
            timeLimit: 20,
            isPublished: true
        });

        console.log('Quizzes created');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
