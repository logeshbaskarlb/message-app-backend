const mongoose = require("mongoose")


const connectToMongoDB =  async () =>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error in connect database");
    }
}

module.exports = connectToMongoDB