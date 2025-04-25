const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://root:eDlG2kCB9J1Ag3JZ@cluster0.nmenbdj.mongodb.net/?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'GameHub' // You can change this to your preferred DB name
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  connectDB();
}

module.exports = connectDB;