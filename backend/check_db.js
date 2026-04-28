const mongoose = require('mongoose');
const uri = "mongodb+srv://abdallahhfares_db_user:87p3y73Sa3w2splG@mazzady.tedodg0.mongodb.net/projectdata?appName=mazzady";

async function check() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log("SUCCESS: Connected to MongoDB");
        process.exit(0);
    } catch (err) {
        console.error("FAILURE: Could not connect to MongoDB", err.message);
        process.exit(1);
    }
}

check();
