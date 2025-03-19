import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectToDatabase(uri?: string) {
    const connectionUri = uri || MONGODB_URI;
    if (!connectionUri) {
        throw new Error('MongoDB URI is not defined');
    }
    try {
        await mongoose.connect(connectionUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

export async function disconnectFromDatabase() {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}