const mongoose = require('mongoose');
const dns = require('dns');

// Fallback DNS servers (Google & Cloudflare) to fix Windows DNS querySrv ECONNREFUSED issues with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('Could not set custom DNS servers:', e.message);
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoapp';
    
    // Check if user still has placeholder Atlas URI
    if (connStr.includes('<username>') || connStr.includes('user:password')) {
      console.warn('\x1b[33m%s\x1b[0m', '⚠️  MongoDB Atlas URI contains placeholder credentials in backend/.env!');
      console.warn('\x1b[33m%s\x1b[0m', '👉 Please update MONGODB_URI in backend/.env with your actual MongoDB Atlas connection string.');
    }

    const conn = await mongoose.connect(connStr);
    console.log(`\x1b[32m%s\x1b[0m`, `MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `Error connecting to MongoDB: ${error.message}`);
    console.error(`👉 Please ensure your MongoDB Atlas credentials and Network Access IP whitelist in MongoDB Atlas are correctly configured in backend/.env.`);
  }
};

module.exports = connectDB;
