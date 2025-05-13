const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@example.com' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
            lastName: process.env.ADMIN_LAST_NAME || 'User',
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123',
            phoneNumber: process.env.ADMIN_PHONE || '1234567890',
            gender: 'prefer-not-to-say',
            role: 'admin',
            agreedToTerms: true,
            isActive: true
        });

        console.log('Admin user created successfully:', adminUser.email);
    } catch (error) {
        console.error('Error creating admin user:', error.message);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
        process.exit(0);
    }
};

// Run the script
createAdmin(); 