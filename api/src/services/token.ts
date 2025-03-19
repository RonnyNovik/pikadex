import jwt, { JwtPayload } from 'jsonwebtoken';

export class TokenService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || '';
    private readonly ACCESS_TOKEN_EXPIRES_IN = '14d';

    generateAccessToken(userId: string): string {
        return jwt.sign(
            { userId },
            this.JWT_SECRET,
            { expiresIn: this.ACCESS_TOKEN_EXPIRES_IN }
        );
    }

    verifyToken(token: string): string | JwtPayload {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}