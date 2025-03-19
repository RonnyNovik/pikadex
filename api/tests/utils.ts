import { expect } from "vitest";
import { Response, Express } from "express";
import request from 'supertest';

export const expectRequestError = (response: Response & { body: any }, expectedStatus: number) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('error');
};


export const mockAPIRequest = async (app: Express, method: string, path: string, body: any) => {
    return await request(app)
    [method](path)
        .send(body) as unknown as Response & { body: any };
};


