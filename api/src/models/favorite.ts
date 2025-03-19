import mongoose from 'mongoose';


export const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pokemonId: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export const FavoriteModel = mongoose.model('Favorite', favoriteSchema);

export interface FavoriteSchema extends mongoose.Document {
    userId: string;
    pokemonId: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
favoriteSchema.index({ userId: 1, pokemonId: 1 }, { unique: true });
