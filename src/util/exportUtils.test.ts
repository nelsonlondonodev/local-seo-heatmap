import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCsv, copyToClipboardAsTsv } from './exportUtils';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('exportUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('exportToCsv', () => {
    const originalCreateObjectURL = URL.createObjectURL;
    
    beforeEach(() => {
      // Mock URL.createObjectURL
      URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('should show an error toast if data array is empty', () => {
      exportToCsv([], 'test-file');
      expect(toast.error).toHaveBeenCalledWith('No hay datos para exportar.');
      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('should create a CSV file and trigger download', () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');
      
      const mockAnchor = document.createElement('a');
      vi.spyOn(mockAnchor, 'click').mockImplementation(() => {});
      vi.spyOn(mockAnchor, 'setAttribute');
      
      createElementSpy.mockReturnValue(mockAnchor);

      const data = [
        { name: 'Alice', age: 30, city: 'Bogotá' },
        { name: 'Bob', age: 25, city: 'Medellín' }
      ];

      exportToCsv(data, 'users');

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(mockAnchor.setAttribute).toHaveBeenCalledWith('href', 'blob:mock-url');
      expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', 'users.csv');
      expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor);
      expect(mockAnchor.click).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor);
      expect(toast.success).toHaveBeenCalledWith('Archivo "users.csv" descargado.');
    });

    it('should handle custom headers and escape commas correctly', () => {
      // We spy on Blob creation to inspect the content
      const blobSpy = vi.spyOn(global, 'Blob').mockImplementation(function(content: any, options: any) {
        return { content, options } as unknown as Blob;
      });
      const data = [{ notes: 'Hello, World', val: '"quoted"' }];
      
      exportToCsv(data, 'test', ['Notes Header', 'Value Header']);
      
      expect(blobSpy).toHaveBeenCalled();
      // Inspecting the payload sent to Blob
      const blobCallArg = blobSpy.mock.calls[0]?.[0]?.[0] as string;
      expect(blobCallArg).toContain('Notes Header,Value Header');
      expect(blobCallArg).toContain('"Hello, World"');
      expect(blobCallArg).toContain('"""quoted"""'); // testing quote escaping
    });
  });

  describe('copyToClipboardAsTsv', () => {
    let originalClipboard: any;

    beforeEach(() => {
      originalClipboard = navigator.clipboard;
      // Mock clipboard API
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });
    });

    afterEach(() => {
      Object.assign(navigator, { clipboard: originalClipboard });
    });

    it('should do nothing if data is empty', async () => {
      await copyToClipboardAsTsv([]);
      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should format data as TSV and copy to clipboard', async () => {
      const data = [
        { name: 'Alice', role: 'Dev' },
        { name: 'Bob', role: 'Designer' }
      ];

      await copyToClipboardAsTsv(data, ['Name', 'Role']);

      const expectedTsv = "Name\tRole\nAlice\tDev\nBob\tDesigner";
      
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedTsv);
      expect(toast.success).toHaveBeenCalledWith('Datos copiados al portapapeles. ¡Pégalos en Excel!');
    });

    it('should show an error toast if clipboard write fails', async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
        },
      });

      const data = [{ test: 1 }];
      await copyToClipboardAsTsv(data);

      expect(toast.error).toHaveBeenCalledWith('No se pudo copiar al portapapeles.');
    });
  });
});
