import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DomainSearchForm } from './DomainSearchForm';

// Mock ResizeObserver which is needed for Shadcn Select
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserverMock;

// Mock PointerEvent which is needed for Shadcn Select in JSDOM
if (!window.PointerEvent) {
  class PointerEventMock extends Event {
    constructor(type: string, props?: any) {
      super(type, props);
    }
  }
  (window as any).PointerEvent = PointerEventMock;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
}

describe('DomainSearchForm', () => {
  const defaultProps = {
    targetUrl: '',
    setTargetUrl: vi.fn(),
    locationCode: 2724, // Spain as default
    setLocationCode: vi.fn(),
    isAnalyzing: false,
    onAnalyze: vi.fn(),
  };

  it('renders the input, select, and button correctly', () => {
    render(<DomainSearchForm {...defaultProps} />);
    
    expect(screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i)).toBeInTheDocument();
    expect(screen.getByText(/Explorar Sitio/i)).toBeInTheDocument();
    expect(screen.getByText(/País de Análisis/i)).toBeInTheDocument();
  });

  it('calls setTargetUrl when typing in the input', async () => {
    const user = userEvent.setup();
    render(<DomainSearchForm {...defaultProps} />);
    
    const input = screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i);
    await user.type(input, 'apple.com');
    
    // We expect it to be called multiple times (once per keystroke)
    expect(defaultProps.setTargetUrl).toHaveBeenCalled();
  });

  it('calls onAnalyze when pressing Enter', async () => {
    const user = userEvent.setup();
    const onAnalyzeMock = vi.fn();
    render(<DomainSearchForm {...defaultProps} onAnalyze={onAnalyzeMock} />);
    
    const input = screen.getByPlaceholderText(/ej: amazon.es, mercadolibre.com.co/i);
    await user.type(input, '{Enter}');
    
    expect(onAnalyzeMock).toHaveBeenCalledTimes(1);
  });

  it('calls onAnalyze when clicking the submit button', async () => {
    const user = userEvent.setup();
    const onAnalyzeMock = vi.fn();
    render(<DomainSearchForm {...defaultProps} onAnalyze={onAnalyzeMock} />);
    
    const button = screen.getByRole('button', { name: /Explorar Sitio/i });
    await user.click(button);
    
    expect(onAnalyzeMock).toHaveBeenCalledTimes(1);
  });

  it('disables the button and shows loading state when isAnalyzing is true', () => {
    render(<DomainSearchForm {...defaultProps} isAnalyzing={true} />);
    
    const button = screen.getByRole('button', { name: /Analizando.../i });
    expect(button).toBeDisabled();
  });
});
