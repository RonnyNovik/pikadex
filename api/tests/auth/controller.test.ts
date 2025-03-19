import { describe, it, beforeAll } from 'vitest';
import app from '../../src/app';
import { expectAuthSuccess } from './utils';
import { expectRequestError, mockAPIRequest } from '../utils';
import { mockUser } from './mocks';
describe('Authentication', () => {


    describe('POST /auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await mockAPIRequest(app, 'post', '/auth/register', mockUser);

            expectAuthSuccess(res, 201);
        });

        it('should not allow duplicate usernames', async () => {
            await mockAPIRequest(app, 'post', '/auth/register', mockUser);

            const res = await mockAPIRequest(app, 'post', '/auth/register', mockUser);

            expectRequestError(res, 409);
        });
    });

    describe('POST /auth/login', () => {
        beforeAll(async () => {
            await mockAPIRequest(app, 'post', '/auth/register', mockUser);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await mockAPIRequest(app, 'post', '/auth/login', mockUser);

            expectAuthSuccess(res, 200);
        });

        it('should fail with incorrect password', async () => {
            const res = await mockAPIRequest(app, 'post', '/auth/login', {
                username: mockUser.username,
                password: 'wrongpassword'
            });

            expectRequestError(res, 400);
        });
    });
}); 