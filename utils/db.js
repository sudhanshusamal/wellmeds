import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// dotenv.config();
const connection = {};

export async function connectDb() {
    if (connection.isConnected) {
        console.log('Already Connected to Database');
        return;
    }
    if (mongoose.connections.length > 0) {
        connection.isConnected = mongoose.connections[0].readyState;
        if (connection.isConnected === 1) {
            console.log('Use previous connection to the database.')
            return;
        }
        await mongoose.disconnect();
    }
    const db = await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('New connection to the database');
    connection.isConnected = db.connections[0].readyState;
}

export async function disconnectDb() {
    if (connection.isConnected){
        if (process.env.NODE_ENV === "production"){
            await mongoose.disconnect();
            connection.isConnected = false;
        } else {
            console.log("Already Disconnected to the database.")
        }
    }
}

const db = { connectDb, disconnectDb };
export default db;