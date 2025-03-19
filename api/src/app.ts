import express from 'express';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { AuthRouter, FavoriteRouter, PokemonRouter } from './routes';
import { handleError } from './utils';


const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
];

app.use(express.json());


app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use('/auth', AuthRouter);
app.use('/pokemons', PokemonRouter);
app.use('/favorites', FavoriteRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    handleError(err, res, 'An unexpected error occurred');
});

export default app;