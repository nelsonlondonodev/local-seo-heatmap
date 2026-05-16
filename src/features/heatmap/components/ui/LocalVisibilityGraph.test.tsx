import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalVisibilityGraph } from './LocalVisibilityGraph';
import { useRankingHistory } from '../../hooks/useRankingHistory';
import type { ReactNode } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';

// Mock Recharts to avoid issues with SVG and DOM dimensions in JSDOM
// Using a Record<string, unknown> and casting to unknown then to the module type is the clean way
// to mock modules in Vitest without using 'any'.
vi.mock('recharts', () => {
  const MockComponent = ({ children }: { children?: ReactNode }) => <div>{children}</div>;
  return {
    ResponsiveContainer: MockComponent,
    AreaChart: MockComponent,
    Area: MockComponent,
    XAxis: MockComponent,
    YAxis: MockComponent,
    CartesianGrid: MockComponent,
    Tooltip: MockComponent,
  };
});

// Mock the hook
vi.mock('../../hooks/useRankingHistory', () => ({
  useRankingHistory: vi.fn(),
}));

describe('LocalVisibilityGraph Component', () => {
  const mockPlaceId = 'ChIJ123';
  const mockKeyword = 'abogados';
  const mockedUseRankingHistory = vi.mocked(useRankingHistory);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null (not render) if isLoading is true', () => {
    mockedUseRankingHistory.mockReturnValue({ 
      data: [], 
      isLoading: true 
    } as unknown as UseQueryResult<unknown[], Error>);
    
    const { container } = render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    expect(container.firstChild).toBeNull();
  });

  it('should return null if history has less than 2 items', () => {
    mockedUseRankingHistory.mockReturnValue({ 
      data: [{ date: '2026-05-01', avgRank: 5, bestRank: 2 }], 
      isLoading: false 
    } as unknown as UseQueryResult<unknown[], Error>);
    
    const { container } = render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the graph, keyword, and trend if data is valid', () => {
    mockedUseRankingHistory.mockReturnValue({ 
      data: [
        { date: '2026-05-01T00:00:00Z', avgRank: 8, bestRank: 5 },
        { date: '2026-05-02T00:00:00Z', avgRank: 3, bestRank: 1 },
      ], 
      isLoading: false 
    } as unknown as UseQueryResult<unknown[], Error>);
    
    render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    
    expect(screen.getByText('Histórico de Visibilidad')).toBeInTheDocument();
    expect(screen.getByText('abogados')).toBeInTheDocument();
    expect(screen.getByText(/5\.0 pts de evolución/i)).toBeInTheDocument();
  });

  it('should render correct trend text when rank drops (worsens)', () => {
    mockedUseRankingHistory.mockReturnValue({ 
      data: [
        { date: '2026-05-01T00:00:00Z', avgRank: 2, bestRank: 1 },
        { date: '2026-05-02T00:00:00Z', avgRank: 6, bestRank: 4 },
      ], 
      isLoading: false 
    } as unknown as UseQueryResult<unknown[], Error>);
    
    render(<LocalVisibilityGraph placeId={mockPlaceId} keyword={mockKeyword} />);
    expect(screen.getByText(/4\.0 pts de evolución/i)).toBeInTheDocument();
  });
});
