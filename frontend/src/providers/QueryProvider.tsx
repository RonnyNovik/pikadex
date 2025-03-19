import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const staleTime = 5 * 60 * 1000;
const gcTime = 30 * 60 * 1000;
const retry = 1;
const retryDelay = 1000;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime,
            gcTime,
            retry,
            retryDelay,
        },
    },
});

export default function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}; 