// Script để update role từ 'user' sang 'customer' cho tất cả users hiện tại
const mongoose = require('mongoose');
const User = require('../src/models/User');

const updateUserRoles = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orderfood', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Update all users with role 'user' to 'customer'
    const result = await User.updateMany(
      { role: 'user' },
      { $set: { role: 'customer' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users from 'user' to 'customer' role`);

    // Show current user statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Current user statistics by role:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} users`);
    });

    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating user roles:', error);
    process.exit(1);
  }
};

// Run the script
updateUserRoles();
