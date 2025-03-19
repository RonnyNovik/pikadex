import { AxiosResponse } from "axios";
import { httpClient } from "./http-client";
import { DEFAULT_BATCH_SIZE, DEFAULT_DELAY } from "../constants";
import { delay } from "./delay";

type Batch = Promise<AxiosResponse<any, any>>[];

/**
 * Creates batches of API requests for Pokemon data
 * @param endpoints - Array of API endpoints to be batched
 * @param batchSize - Number of requests per batch
 * @returns Array of Promise batches
 * @example
 * const batches = createPokeAPIBatches(abilityIds);
 */
export const createPokeAPIBatches = (endpoints: string[], batchSize: number = DEFAULT_BATCH_SIZE): Batch[] => {
    const batches: Batch[] = [[]];

    for (const endpoint of endpoints) {
        const lastBatchIndex = batches.length - 1;
        const lastBatchLength = batches[lastBatchIndex].length;
        const batchedRequest = httpClient.get(endpoint);

        if (lastBatchLength === batchSize) batches.push([batchedRequest])
        else batches[lastBatchIndex].push(batchedRequest);
    }

    return batches;
}

/**
 * Processes API requests in batches with delay to prevent rate limiting
 * @param batches - Array of Promise batches to be executed
 * @param delayBetweenBatches - Milliseconds to wait between batch executions
 * @returns Array of successful responses, skipping failed requests
 * @example
 * const batches = createPokeAPIBatches(abilityIds);
 * const results = await handlePokeAPIBatches(batches, 200);
 */
export const handlePokeAPIBatches = async (batches: Batch[], delayBetweenBatches: number = DEFAULT_DELAY): Promise<any[]> => {
    const result: any[] = [];

    for (const batch of batches) {
        const batchResponses = await Promise.allSettled(batch);

        for (const response of batchResponses) {
            if (response.status === 'fulfilled') result.push(response.value.data);
            else {
                console.error("Failed to fetch response in batch: ",
                    response.reason instanceof Error ? response.reason.message : response.reason)
            }
        }

        await delay(delayBetweenBatches);
    }

    return result;
}