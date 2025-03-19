import { expect } from "vitest";
import { Response } from "express";
import { ValidationError } from "../../src/utils/errors";

export const expectAuthSuccess = (response: Response & { body: any }, expectedStatus: number) => {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).not.toHaveProperty('password');
};

export const expectValidationError = (fn: () => any) => {
    expect(fn).toThrow(ValidationError);
};



