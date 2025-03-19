import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

beforeAll(() => {
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
    }));

    window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
    cleanup();
}); 