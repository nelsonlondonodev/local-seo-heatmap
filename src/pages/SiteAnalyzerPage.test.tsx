import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SiteAnalyzerPage } from './SiteAnalyzerPage';
import { dataForSeoService } from '@/features/keywords/services/dataForSeoService';
import { toast } from 'sonner';

// Mocks
vi.mock('@/features/keywords/services/dataForSeoService', () => ({
  dataForSeoService: {
    getDomainRankOverview: vi.fn(),
    getDomainRankedKeywords: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock ResizeObserver/PointerEvent for Shadcn UI inner workings in JsDom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;
if (!window.PointerEvent) {
  (window as any).PointerEvent = class extends Event {};
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

describe('SiteAnalyzerPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for window.confirm to simulate user clicking "OK"
    window.confirm = vi.fn().mockReturnValue(true);
  });

  it('renders the initial state with no results', () => {
    render(<SiteAnalyzerPage />);
    expect(screen.getByText('Explorador de Dominios')).toBeInTheDocument();
    // Form should be present
    expect(screen.getByRole('button', { name: /Explorar Sitio/i })).toBeInTheDocument();
    // No results or empty state should be present yet
    expect(screen.queryByText('No se encontraron datos')).not.toBeInTheDocument();
  });

  it('stops analysis if user cancels the confirm dialog', async () => {
    window.confirm = vi.fn().mockReturnValue(false); // User clicks Cancel
    const user = userEvent.setup();
    render(<SiteAnalyzerPage />);

    const input = screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i);
    await user.type(input, 'test.com');
    
    const analyzeButton = screen.getByRole('button', { name: /Explorar Sitio/i });
    await user.click(analyzeButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(dataForSeoService.getDomainRankOverview).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it('performs analysis and renders results on success', async () => {
    const user = userEvent.setup();
    
    const mockOverview = {
      metrics: {
        organic: { pos_1: 10, pos_2_3: 5, pos_4_10: 20, count: 35 },
      }
    };
    const mockKeywords = [
      {
        keyword_data: { keyword: 'zapatos', keyword_info: { search_volume: 1000 } },
        ranked_serp_element: { serp_item: { rank_absolute: 1, url: 'https://test.com/zapatos' } }
      },
      {
        keyword_data: { keyword: 'camisas', keyword_info: { search_volume: 500 } },
        ranked_serp_element: { serp_item: { rank_absolute: 5, url: 'https://test.com/camisas' } }
      },
    ];

    (dataForSeoService.getDomainRankOverview as any).mockResolvedValue(mockOverview);
    (dataForSeoService.getDomainRankedKeywords as any).mockResolvedValue(mockKeywords);

    render(<SiteAnalyzerPage />);

    const input = screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i);
    await user.type(input, 'test.com');
    
    const analyzeButton = screen.getByRole('button', { name: /Explorar Sitio/i });
    await user.click(analyzeButton);

    // Verify loading state appears briefly
    // The button text changes to "Analizando..." (this might be too fast to catch without fine-grained mock control, but we check service calls)
    
    await waitFor(() => {
      expect(dataForSeoService.getDomainRankOverview).toHaveBeenCalledWith('test.com', 2724);
      expect(dataForSeoService.getDomainRankedKeywords).toHaveBeenCalledWith('test.com', 2724);
    });

    // Check if table renders the keywords
    // RankedKeywordsTable should render text based on keywords
    await waitFor(() => {
      expect(screen.getByText('zapatos')).toBeInTheDocument();
      expect(screen.getByText('camisas')).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith('Análisis completado con éxito.');
  });

  it('renders the empty state if analysis returns no data', async () => {
    const user = userEvent.setup();
    
    (dataForSeoService.getDomainRankOverview as any).mockResolvedValue(null); // No metrics
    (dataForSeoService.getDomainRankedKeywords as any).mockResolvedValue([]); // No keywords

    render(<SiteAnalyzerPage />);

    const input = screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i);
    await user.type(input, 'empty.com');
    
    const analyzeButton = screen.getByRole('button', { name: /Explorar Sitio/i });
    await user.click(analyzeButton);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron datos')).toBeInTheDocument();
    });
  });
});
