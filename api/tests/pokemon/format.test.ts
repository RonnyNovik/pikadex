import { describe, it, expect } from 'vitest';
import { getEvolutionChainData, formatName } from '../../src/utils/format';
import { PokeAPIChainLink } from '../../src/types';
import { mockCharmanderChain, mockEeveeChain } from './mocks';

describe('Pokemon Format Utils', () => {
    describe('getEvolutionChainData', () => {
        it('should handle linear evolution chains (Charmander line)', () => {

            const baseResult = getEvolutionChainData(mockCharmanderChain, "charmander");
            expect(baseResult.evolves_from).toHaveLength(0);
            expect(baseResult.evolves_to).toHaveLength(2);
            expect(baseResult.evolves_to[0]).toEqual({
                id: 5,
                name: "charmeleon",
                level: 0
            });
            expect(baseResult.evolves_to[1]).toEqual({
                id: 6,
                name: "charizard",
                level: 1
            });

            const middleResult = getEvolutionChainData(mockCharmanderChain, "charmeleon");
            expect(middleResult.evolves_from).toHaveLength(1);
            expect(middleResult.evolves_from[0]).toEqual({
                id: 4,
                name: "charmander",
                level: 0
            });
            expect(middleResult.evolves_to).toHaveLength(1);
            expect(middleResult.evolves_to[0]).toEqual({
                id: 6,
                name: "charizard",
                level: 0
            });

            const finalResult = getEvolutionChainData(mockCharmanderChain, "charizard");
            expect(finalResult.evolves_from).toHaveLength(2);
            expect(finalResult.evolves_from[1]).toEqual({
                id: 5,
                name: "charmeleon",
                level: 1
            });
            expect(finalResult.evolves_from[0]).toEqual({
                id: 4,
                name: "charmander",
                level: 0
            });
            expect(finalResult.evolves_to).toHaveLength(0);
        });

        it('should handle branching evolution chains (Eevee line)', () => {


            const result = getEvolutionChainData(mockEeveeChain, "eevee");
            expect(result.evolves_from).toHaveLength(0);
            expect(result.evolves_to).toHaveLength(3);
            expect(result.evolves_to).toEqual(expect.arrayContaining([
                { id: 134, name: "vaporeon", level: 0 },
                { id: 135, name: "jolteon", level: 0 },
                { id: 136, name: "flareon", level: 0 }
            ]));
        });
    });

    describe('formatName', () => {
        it('should format Pokemon names correctly', () => {
            expect(formatName('mr-mime')).toBe('mr mime');
            expect(formatName('ho-oh')).toBe('ho oh');
            expect(formatName('porygon-z')).toBe('porygon z');
        });
    });
}); 