const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "KathaKoi",
        });
        console.log("MongoDB Connected Successfully".blue.bold);
        console.log(`MongoDB Connected ${connect.connection.host}");`.cyan.underline);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error}`.red.bold);
        process.exit(1);
    }
}

module.exports = connectDB;
