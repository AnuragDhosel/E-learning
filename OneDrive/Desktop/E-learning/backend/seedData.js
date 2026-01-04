require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');
const Lecture = require('./models/Lecture');
const Assignment = require('./models/Assignment');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');
const CodingProblem = require('./models/CodingProblem');
const Announcement = require('./models/Announcement');
const Enrollment = require('./models/Enrollment');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Course.deleteMany({});
        await Lecture.deleteMany({});
        await Assignment.deleteMany({});
        await Quiz.deleteMany({});
        await Question.deleteMany({});
        await CodingProblem.deleteMany({});
        await Announcement.deleteMany({});
        await Enrollment.deleteMany({});

        console.log('Creating users...');
        // Create teacher
        const teacher = await User.create({
            name: 'Dr. Sarah Johnson',
            email: 'teacher@university.edu',
            passwordHash: 'password123',
            role: 'teacher',
            bio: 'Professor of Computer Science with 15 years of teaching experience',
            department: 'Computer Science',
        });

        // Create students
        const student1 = await User.create({
            name: 'John Doe',
            email: 'student@university.edu',
            passwordHash: 'password123',
            role: 'student',
            department: 'Computer Science',
            year: 3,
        });

        const student2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@university.edu',
            passwordHash: 'password123',
            role: 'student',
            department: 'Computer Science',
            year: 2,
        });

        console.log('Creating courses...');
        // Create courses
        const course1 = await Course.create({
            title: 'Introduction to Web Development',
            description: 'Learn the fundamentals of web development including HTML, CSS, JavaScript, and modern frameworks.',
            department: 'Computer Science',
            semester: 'Fall 2024',
            teacher: teacher._id,
            isPublished: true,
            tags: ['web', 'frontend', 'javascript'],
        });

        const course2 = await Course.create({
            title: 'Data Structures and Algorithms',
            description: 'Comprehensive study of fundamental data structures and algorithms with practical implementations.',
            department: 'Computer Science',
            semester: 'Fall 2024',
            teacher: teacher._id,
            isPublished: true,
            tags: ['algorithms', 'data-structures', 'programming'],
        });

        const course3 = await Course.create({
            title: 'Database Management Systems',
            description: 'Introduction to relational databases, SQL, and database design principles.',
            department: 'Computer Science',
            semester: 'Fall 2024',
            teacher: teacher._id,
            isPublished: true,
            tags: ['database', 'sql', 'backend'],
        });

        console.log('Creating lectures...');
        // Create lectures for course 1
        const lecture1 = await Lecture.create({
            course: course1._id,
            title: 'Introduction to HTML',
            description: 'Learn the basics of HTML structure and semantic markup',
            videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
            notes: '<h3>HTML Basics</h3><p>HTML (HyperText Markup Language) is the standard markup language for creating web pages...</p><ul><li>Elements and Tags</li><li>Attributes</li><li>Semantic HTML</li></ul>',
            resources: [
                { name: 'HTML Reference Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
                { name: 'Practice Exercises', url: '/resources/html-exercises.pdf' },
            ],
            order: 1,
        });

        const lecture2 = await Lecture.create({
            course: course1._id,
            title: 'CSS Fundamentals',
            description: 'Understanding CSS selectors, properties, and the box model',
            videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
            notes: '<h3>CSS Fundamentals</h3><p>CSS (Cascading Style Sheets) is used to style HTML elements...</p><ul><li>Selectors</li><li>Box Model</li><li>Flexbox and Grid</li></ul>',
            resources: [
                { name: 'CSS Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
            ],
            order: 2,
        });

        const lecture3 = await Lecture.create({
            course: course1._id,
            title: 'JavaScript Basics',
            description: 'Introduction to JavaScript programming fundamentals',
            videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
            notes: '<h3>JavaScript Basics</h3><p>JavaScript is the programming language of the web...</p><ul><li>Variables and Data Types</li><li>Functions</li><li>DOM Manipulation</li></ul>',
            resources: [],
            order: 3,
        });

        // Create lectures for course 2
        const lecture4 = await Lecture.create({
            course: course2._id,
            title: 'Arrays and Linked Lists',
            description: 'Understanding linear data structures',
            videoUrl: 'https://www.youtube.com/watch?v=DuDz6B4cqVc',
            notes: '<h3>Arrays and Linked Lists</h3><p>Learn about fundamental linear data structures and their time complexities...</p>',
            order: 1,
        });

        const lecture5 = await Lecture.create({
            course: course2._id,
            title: 'Stacks and Queues',
            description: 'LIFO and FIFO data structures',
            videoUrl: 'https://www.youtube.com/watch?v=wjI1WNcIntg',
            notes: '<h3>Stacks and Queues</h3><p>Understanding stack and queue implementations and applications...</p>',
            order: 2,
        });

        console.log('Creating assignments...');
        // Create assignments
        const assignment1 = await Assignment.create({
            course: course1._id,
            title: 'Build a Personal Portfolio Website',
            description: 'Create a responsive personal portfolio website using HTML, CSS, and JavaScript. Your website should include: Home page, About section, Projects showcase, and Contact form.',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            maxMarks: 100,
        });

        const assignment2 = await Assignment.create({
            course: course2._id,
            title: 'Implement Stack and Queue',
            description: 'Implement Stack and Queue data structures in your preferred programming language with all basic operations.',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            maxMarks: 50,
        });

        console.log('Creating quizzes...');
        // Create quiz
        const quiz1 = await Quiz.create({
            course: course1._id,
            title: 'HTML & CSS Fundamentals Quiz',
            description: 'Test your knowledge of HTML and CSS basics',
            timeLimit: 30,
            isPublished: true,
        });

        // Create questions for quiz
        await Question.create([
            {
                quiz: quiz1._id,
                text: 'What does HTML stand for?',
                options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Home Tool Markup Language',
                    'Hyperlinks and Text Markup Language',
                ],
                correctIndex: 0,
                order: 1,
            },
            {
                quiz: quiz1._id,
                text: 'Which CSS property is used to change the text color?',
                options: ['text-color', 'font-color', 'color', 'text-style'],
                correctIndex: 2,
                order: 2,
            },
            {
                quiz: quiz1._id,
                text: 'What is the correct HTML tag for the largest heading?',
                options: ['<heading>', '<h6>', '<h1>', '<head>'],
                correctIndex: 2,
                order: 3,
            },
            {
                quiz: quiz1._id,
                text: 'Which property is used to change the background color in CSS?',
                options: ['bgcolor', 'background-color', 'color', 'bg-color'],
                correctIndex: 1,
                order: 4,
            },
        ]);

        const quiz2 = await Quiz.create({
            course: course2._id,
            title: 'Data Structures Quiz',
            description: 'Test your understanding of basic data structures',
            timeLimit: 25,
            isPublished: true,
        });

        await Question.create([
            {
                quiz: quiz2._id,
                text: 'What is the time complexity of accessing an element in an array?',
                options: ['O(n)', 'O(log n)', 'O(1)', 'O(n^2)'],
                correctIndex: 2,
                order: 1,
            },
            {
                quiz: quiz2._id,
                text: 'Which data structure follows LIFO principle?',
                options: ['Queue', 'Stack', 'Array', 'Linked List'],
                correctIndex: 1,
                order: 2,
            },
        ]);

        console.log('Creating coding problems...');
        // Create coding problems
        await CodingProblem.create({
            course: course2._id,
            title: 'Two Sum',
            difficulty: 'easy',
            statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            inputDescription: 'nums = [2,7,11,15], target = 9',
            outputDescription: '[0,1]',
            samples: [
                {
                    input: 'nums = [2,7,11,15], target = 9',
                    output: '[0,1]',
                    explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
                },
                {
                    input: 'nums = [3,2,4], target = 6',
                    output: '[1,2]',
                    explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
                },
            ],
            constraints: '2 <= nums.length <= 10^4',
        });

        await CodingProblem.create({
            course: course2._id,
            title: 'Reverse Linked List',
            difficulty: 'medium',
            statement: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
            inputDescription: 'head = [1,2,3,4,5]',
            outputDescription: '[5,4,3,2,1]',
            samples: [
                {
                    input: 'head = [1,2,3,4,5]',
                    output: '[5,4,3,2,1]',
                    explanation: 'Reverse the linked list.',
                },
            ],
            constraints: 'The number of nodes in the list is the range [0, 5000].',
        });

        await CodingProblem.create({
            course: course1._id,
            title: 'FizzBuzz',
            difficulty: 'easy',
            statement: 'Write a program that prints numbers from 1 to n. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
            inputDescription: 'n = 15',
            outputDescription: '[1,2,"Fizz",4,"Buzz","Fizz",7,8,"Fizz","Buzz",11,"Fizz",13,14,"FizzBuzz"]',
            samples: [
                {
                    input: 'n = 15',
                    output: '[1,2,"Fizz",4,"Buzz","Fizz",7,8,"Fizz","Buzz",11,"Fizz",13,14,"FizzBuzz"]',
                    explanation: 'Return an array of strings.',
                },
            ],
            constraints: '1 <= n <= 10^4',
        });

        console.log('Creating announcements...');
        // Create announcements
        await Announcement.create({
            title: 'Welcome to the Fall 2024 Semester!',
            message: 'We are excited to have you in our E-learning platform. Please make sure to check course materials regularly and submit assignments on time.',
            audience: 'all',
            createdBy: teacher._id,
        });

        await Announcement.create({
            title: 'Midterm Exams Schedule Released',
            message: 'The midterm exam schedule has been posted. Please check your individual course pages for specific dates and times.',
            audience: 'students',
            createdBy: teacher._id,
        });

        await Announcement.create({
            title: 'Web Development Course Update',
            message: 'New lecture materials for JavaScript have been uploaded. Make sure to watch the videos before the next class.',
            audience: 'course',
            course: course1._id,
            createdBy: teacher._id,
        });

        console.log('Creating enrollments...');
        // Enroll students in courses
        await Enrollment.create({ student: student1._id, course: course1._id });
        await Enrollment.create({ student: student1._id, course: course2._id });
        await Enrollment.create({ student: student2._id, course: course1._id });
        await Enrollment.create({ student: student2._id, course: course3._id });

        console.log('✅ Database seeded successfully!');
        console.log('\n--- Sample Credentials ---');
        console.log('Teacher: teacher@university.edu / password123');
        console.log('Student 1: student@university.edu / password123');
        console.log('Student 2: jane@university.edu / password123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
