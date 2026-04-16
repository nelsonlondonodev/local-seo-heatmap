import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: No se encontraron las variables de Supabase en el .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedHistory() {
  console.log('🔍 Buscando el último análisis para duplicar...');
  
  // 1. Obtener el último heatmap
  const { data: lastHeatmap, error: fetchError } = await supabase
    .from('heatmaps')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !lastHeatmap) {
    console.error('❌ No se encontró ningún análisis previo para usar como base.');
    return;
  }

  console.log(`✅ Base encontrada: ${lastHeatmap.business_name} - ${lastHeatmap.keyword}`);

  // 2. Crear una versión "hace 7 días" con peor ranking
  const oldSummary = lastHeatmap.results_summary ? { ...lastHeatmap.results_summary } : { avgRank: 10, bestRank: 5 };
  // Empeoramos el ranking para que se vea una mejoría en el gráfico
  (oldSummary as any).avgRank = (oldSummary as any).avgRank + 3.5;
  (oldSummary as any).bestRank = (oldSummary as any).bestRank + 2;

  const mockHeatmap = {
    ...lastHeatmap,
    id: crypto.randomUUID(), // Nuevo ID
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Hace 7 días
    results_summary: oldSummary,
  };

  // 3. Insertar
  const { error: insertError } = await supabase
    .from('heatmaps')
    .insert(mockHeatmap);

  if (insertError) {
    console.error('❌ Error al inyectar historial:', insertError.message);
  } else {
    console.log('🚀 ¡Misión cumplida! Se ha creado un registro histórico con éxito.');
    console.log('   Ahora refresca tu navegador en la página de resultados y verás el gráfico.');
  }
}

seedHistory();
