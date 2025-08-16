const mongoose = require('mongoose');
const User = require('./src/models/User');

const updateUserToAdmin = async () => {
  try {
    // Connect to MongoDB with auth
    await mongoose.connect('mongodb://admin:password123@localhost:27017/orderfood?authSource=admin');
    console.log('Connected to MongoDB');

    // Find all users first to see what emails exist
    const users = await User.find({}, 'email role');
    console.log('Existing users:', users);

    // Find user by email and update role to admin
    const result = await User.updateOne(
      { email: 'hung@gmail.com' }, // Update this email to your test email
      { role: 'admin' }
    );

    if (result.modifiedCount > 0) {
      console.log('User updated to admin successfully');
    } else {
      console.log('User not found or already admin');
    }

    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUserToAdmin();
