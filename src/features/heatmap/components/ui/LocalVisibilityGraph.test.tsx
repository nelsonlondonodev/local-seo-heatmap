import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LocalVisibilityGraph } from './LocalVisibilityGraph';
import { useRankingHistory } from '../../hooks/useRankingHistory';

// Mock Recharts to avoid issues with SVG and DOM dimensions in JSDOM
vi.mock('recharts', async () => {
  const OriginalRecharts = await vi.importActual('recharts');
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: '500px', height: '300px' }}>{children}</div>
    ),
    // Mock AreaChart since JSDOM might struggle with its internals, or leave it. 
    // We can just mock the Tooltip to test its strictly typed implementation.
  };
});

// Mock the hook
vi.mock('../../hooks/useRankingHistory', () => ({
  useRankingHistory: vi.fn(),
}));

describe('LocalVisibilityGraph Component', () => {
  const mockPlaceId = 'ChIJ123';
  const mockKeyword = 'abogados';

  it('should return null (not render) if isLoading is true', () => {
    (useRankingHistory as any).mockReturnValue({ data: [], isLoading: true });
    
    const { container } = render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null if history has less than 2 items', () => {
    (useRankingHistory as any).mockReturnValue({ 
      data: [{ date: '2026-05-01', avgRank: 5, bestRank: 2 }], 
      isLoading: false 
    });
    
    const { container } = render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the graph, keyword, and trend if data is valid', () => {
    (useRankingHistory as any).mockReturnValue({ 
      data: [
        { date: '2026-05-01T00:00:00Z', avgRank: 8, bestRank: 5 },
        { date: '2026-05-02T00:00:00Z', avgRank: 3, bestRank: 1 },
      ], 
      isLoading: false 
    });
    
    render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    
    // Check if the title and keyword render
    expect(screen.getByText('Histórico de Visibilidad')).toBeInTheDocument();
    expect(screen.getByText('abogados')).toBeInTheDocument();
    
    // Trend should say "5.0 pts de evolución" (since 8 -> 3 = 5 points improvement)
    expect(screen.getByText(/5\.0 pts de evolución/i)).toBeInTheDocument();
  });

  it('should render correct trend text when rank drops (worsens)', () => {
    (useRankingHistory as any).mockReturnValue({ 
      data: [
        { date: '2026-05-01T00:00:00Z', avgRank: 2, bestRank: 1 },
        { date: '2026-05-02T00:00:00Z', avgRank: 6, bestRank: 4 },
      ], 
      isLoading: false 
    });
    
    render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    
    // 2 -> 6 means it worsened by 4. So improvement is -4. Math.abs(-4) = 4.0
    expect(screen.getByText(/4\.0 pts de evolución/i)).toBeInTheDocument();
  });
});
