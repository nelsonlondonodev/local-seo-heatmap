import { useState, useEffect } from 'react';
import { Globe, Save, Info, CheckCircle2, AlertCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

interface SiteSettingsCardProps {
  projectId: string;
  initialUrl?: string | null;
  projectName: string;
  onUpdate: () => void;
}

export function SiteSettingsCard({ projectId, initialUrl, projectName, onUpdate }: SiteSettingsCardProps) {
  const [url, setUrl] = useState(initialUrl || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isValid, setIsValid] = useState(!!initialUrl);

  useEffect(() => {
    setUrl(initialUrl || '');
    setIsValid(!!initialUrl);
  }, [initialUrl]);

  const cleanUrl = (input: string) => {
    return input
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');
  };

  const handleSave = async () => {
    const cleaned = cleanUrl(url);
    if (!cleaned) {
      toast.error('La URL es obligatoria para el rastreo.');
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('keyword_projects')
        .update({ target_url: cleaned })
        .eq('id', projectId);

      if (error) throw error;

      setUrl(cleaned);
      setIsValid(true);
      toast.success('Configuración del sitio actualizada.');
      onUpdate();
    } catch (error) {
      logger.error('[SITE_SETTINGS] Error updating URL:', error);
      toast.error('Error al guardar la configuración.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-brand-primary/20 bg-brand-primary/5 backdrop-blur-md shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center gap-2 text-brand-primary">
              <Globe className="h-4 w-4" />
              <h3 className="text-sm font-black uppercase tracking-widest">Configuración del Activo</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Define la URL de tu sitio web para que la IA pueda rastrear tus posiciones en Google automáticamente.
            </p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-xl">
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </div>
              <Input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="ej: misitio.com" 
                className={`pl-10 h-11 rounded-xl transition-all border-2 ${isValid ? 'border-emerald-500/20 focus:border-emerald-500' : 'border-amber-500/20 focus:border-amber-500'}`}
              />
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isUpdating}
              className="h-11 px-6 rounded-xl font-bold gap-2 w-full sm:w-auto shadow-lg shadow-brand-primary/20"
            >
              <Save className="h-4 w-4" />
              {isUpdating ? 'Guardando...' : 'Vincular Sitio'}
            </Button>
          </div>
        </div>

        {!isValid && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 animate-pulse">
            <Info className="h-4 w-4 text-amber-600 mt-0.5" />
            <p className="text-[11px] text-amber-700 font-medium">
              <strong>Atención:</strong> Debes vincular una URL para activar el rastreo automático y las métricas de monitoreo.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
