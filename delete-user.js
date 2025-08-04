import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const deleteUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const email = 'ganeshsaibendre4408@gmail.com';
    
    // Find and delete the user
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('❌ User not found:', email);
      return;
    }

    await User.deleteOne({ email });
    console.log('✅ User deleted successfully:', email);
    
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
deleteUser(); 