import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password_hash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const UserModel = mongoose.model('User', userSchema);

export interface UserSchema extends mongoose.Document {
    username: string;
    password_hash: string;
    createdAt: Date;
    updatedAt: Date;
}
