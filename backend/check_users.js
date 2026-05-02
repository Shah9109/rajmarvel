const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const users = await User.find({});
    console.log('Found users:', users.map(u => ({ email: u.email, role: u.role })));
    
    let adminEmail = 'admin@admin.com';
    let adminPass = 'password123';
    let userEmail = 'user@user.com';
    let userPass = 'password123';

    // Create admin if none exists
    const adminExists = users.some(u => u.role === 'admin');
    if (!adminExists) {
        const admin = new User({ name: 'Admin User', email: adminEmail, password: adminPass, role: 'admin' });
        await admin.save();
        console.log('Created admin account:', adminEmail, '/', adminPass);
    } else {
        const existingAdmin = users.find(u => u.role === 'admin');
        console.log('Existing admin:', existingAdmin.email, '(password is encrypted)');
    }

    // Create a regular user if none exists
    const userExists = users.some(u => u.role === 'user');
    if (!userExists) {
        const regularUser = new User({ name: 'Regular User', email: userEmail, password: userPass, role: 'user' });
        await regularUser.save();
        console.log('Created user account:', userEmail, '/', userPass);
    } else {
        const existingUser = users.find(u => u.role === 'user');
        console.log('Existing user:', existingUser.email, '(password is encrypted)');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
