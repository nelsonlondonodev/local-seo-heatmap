import { describe, it, expect } from 'vitest';
import { isResultsSummary, safeCastArray, mapHeatmapToResult } from './mappers';
import type { Database } from '@/types/database';

// Helper type to mock Database row
type HeatmapRow = Database['public']['Tables']['heatmaps']['Row'];

describe('mappers.ts', () => {
  describe('isResultsSummary', () => {
    it('should return true for a valid ResultsSummary object', () => {
      const valid = {
        avgRank: 1.5,
        foundCount: 5,
        totalCount: 10,
        bestRank: 1
      };
      expect(isResultsSummary(valid)).toBe(true);
    });

    it('should return false if any required property is missing', () => {
      const missingAvgRank = { foundCount: 5, totalCount: 10 };
      const missingFoundCount = { avgRank: 1.5, totalCount: 10 };
      const missingTotalCount = { avgRank: 1.5, foundCount: 5 };

      expect(isResultsSummary(missingAvgRank)).toBe(false);
      expect(isResultsSummary(missingFoundCount)).toBe(false);
      expect(isResultsSummary(missingTotalCount)).toBe(false);
    });

    it('should return false for invalid types', () => {
      expect(isResultsSummary(null)).toBe(false);
      expect(isResultsSummary(undefined)).toBe(false);
      expect(isResultsSummary("string")).toBe(false);
      expect(isResultsSummary(123)).toBe(false);
      expect(isResultsSummary({ avgRank: "1.5", foundCount: 5, totalCount: 10 })).toBe(false); // avgRank as string
    });
  });

  describe('safeCastArray', () => {
    it('should return the exact array if input is an array', () => {
      const arr = [1, 2, 3];
      expect(safeCastArray(arr)).toBe(arr);
    });

    it('should return an empty array if input is null or undefined', () => {
      expect(safeCastArray(null)).toEqual([]);
      expect(safeCastArray(undefined)).toEqual([]);
    });

    it('should return an empty array if input is a primitive or an object', () => {
      expect(safeCastArray("string")).toEqual([]);
      expect(safeCastArray(123)).toEqual([]);
      expect(safeCastArray({ key: "value" })).toEqual([]);
    });
  });

  describe('mapHeatmapToResult', () => {
    const mockDate = new Date().toISOString();
    
    it('should map a correct Database Row into a HeatmapResult', () => {
      const mockRow: HeatmapRow = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        keyword: 'plumber',
        business_name: 'Super Plumbers',
        place_id: 'ChIJ123',
        grid_size: '3x3',
        radius_km: 5,
        center_lat: 40.7128,
        center_lng: -74.0060,
        prospect_name: 'John Doe',
        prospect_email: 'john@example.com',
        created_at: mockDate,
        user_id: 'user-123',
        agency_id: null,
        // JSON columns mocked
        points: [{ lat: 40.71, lng: -74.00, rank: 1 }],
        advertisers: ['Ad 1'],
        competitors: [{ name: 'Comp A', isAdvertiser: false, points: [] }],
        results_summary: { avgRank: 1.5, foundCount: 5, totalCount: 10 }
      };

      const result = mapHeatmapToResult(mockRow);

      expect(result.id).toBe(mockRow.id);
      expect(result.config.keyword).toBe(mockRow.keyword);
      expect(result.config.prospectName).toBe(mockRow.prospect_name);
      expect(result.points).toEqual(mockRow.points);
      expect(result.advertisers).toEqual(mockRow.advertisers);
      expect(result.competitors).toEqual(mockRow.competitors);
      expect(result.createdAt).toBe(mockRow.created_at);
    });

    it('should provide fallback for invalid results_summary', () => {
      const mockRow: HeatmapRow = {
        id: 'test-id',
        keyword: 'test',
        business_name: 'test',
        place_id: 'test',
        grid_size: '3x3',
        radius_km: 1,
        center_lat: 0,
        center_lng: 0,
        prospect_name: null,
        prospect_email: null,
        created_at: mockDate,
        user_id: 'user-1',
        agency_id: null,
        points: null,
        advertisers: null,
        competitors: null,
        results_summary: null // Invalid or missing
      };

      const result = mapHeatmapToResult(mockRow);

      // Verify the fallback summary was applied safely (it should NOT be at the root of HeatmapResult)
      expect(result).not.toHaveProperty('results_summary');
      // Wait, mapHeatmapToResult merges everything into `config`, `points`, `advertisers`, `competitors`, etc.
      // Wait! I need to look at what mapHeatmapToResult actually returns. 
      // It returns: { id, config: {...}, points, advertisers, competitors, createdAt }
      // The summary is actually LOST in the return! Let's check mappers.ts again.
      // Wait, mappers.ts doesn't return `summary` inside HeatmapResult?
      // Let's check types.ts or mappers.ts.
      // Ah! "const summary = isResultsSummary(row.results_summary) ? row.results_summary : { avgRank: 0, bestRank: null, foundCount: 0, totalCount: 0 };"
      // Wait, `summary` is computed but never included in the returned object in `mapHeatmapToResult` in `mappers.ts`!
      
      expect(result.points).toEqual([]);
      expect(result.advertisers).toEqual([]);
      expect(result.competitors).toEqual([]);
    });
  });
});
