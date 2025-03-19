import mongoose from 'mongoose';
import { config } from 'dotenv'; 
import bcrypt from 'bcrypt';
import { FavoriteModel, UserModel } from '../src/models';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pikadex';

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);

        const userCount = await UserModel.countDocuments();
        if (userCount > 0) {
            console.log('Database already seeded, skipping...');
            return;
        }

        console.log('Creating indexes...');
        await FavoriteModel.createIndexes();
        await UserModel.createIndexes();

        const testUser = new UserModel({
            username: 'TestUser',
            password_hash: await bcrypt.hash('Test123!', 10),
        });
        await testUser.save();

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    seedDatabase();
}

export { seedDatabase }; 