import { toast } from 'sonner';

/**
 * Utility to export data to a CSV file and trigger a download.
 */
export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  headers?: string[]
) {
  if (data.length === 0) {
    toast.error('No hay datos para exportar.');
    return;
  }

  const columns = Object.keys(data[0]);
  const headerRow = headers ? headers.join(',') : columns.join(',');
  
  const csvRows = data.map(row => 
    columns.map(col => {
      const val = row[col];
      // Escape commas and quotes
      const escaped = String(val ?? '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',')
  );

  const csvContent = [headerRow, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`Archivo "${filename}.csv" descargado.`);
}

/**
 * Utility to copy data to clipboard in a format suitable for Excel/Sheets (TSV).
 */
export async function copyToClipboardAsTsv<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
) {
  if (data.length === 0) return;

  const columns = Object.keys(data[0]);
  const headerRow = headers ? headers.join('\t') : columns.join('\t');
  
  const rows = data.map(row => 
    columns.map(col => {
      const val = row[col];
      return String(val ?? '');
    }).join('\t')
  );

  const tsvContent = [headerRow, ...rows].join('\n');

  try {
    await navigator.clipboard.writeText(tsvContent);
    toast.success('Datos copiados al portapapeles. ¡Pégalos en Excel!');
  } catch (err) {
    toast.error('No se pudo copiar al portapapeles.');
  }
}
