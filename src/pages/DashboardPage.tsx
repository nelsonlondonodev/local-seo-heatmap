import { motion } from 'framer-motion';
import { Map, Search, Crosshair } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GRID_OPTIONS, RADIUS_OPTIONS } from '@/config/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Mapa de Calor
        </h1>
        <p className="text-muted-foreground">
          Configura y ejecuta un análisis de posicionamiento local
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Search Configuration */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-4 w-4" />
                Configuración
              </CardTitle>
              <CardDescription>
                Define los parámetros de tu búsqueda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">Palabra clave</Label>
                <Input
                  id="keyword"
                  placeholder="ej: peluquería cerca de mí"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business">Nombre del negocio</Label>
                <Input
                  id="business"
                  placeholder="ej: Mi Peluquería"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeId">Google Place ID</Label>
                <Input
                  id="placeId"
                  placeholder="ChIJ..."
                />
              </div>

              <div className="space-y-2">
                <Label>Tamaño del grid</Label>
                <div className="grid grid-cols-3 gap-2">
                  {GRID_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className="group relative flex flex-col items-center rounded-lg border border-border p-3 text-center transition-all hover:border-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <span className="text-sm font-semibold">{option.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {option.points} puntos
                      </span>
                      <Badge variant="secondary" className="mt-1 text-[10px]">
                        {option.description}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Radio (km)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar radio" />
                  </SelectTrigger>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((radius) => (
                      <SelectItem key={radius} value={String(radius)}>
                        {radius} km
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ubicación central</Label>
                <Button variant="outline" className="w-full gap-2">
                  <Crosshair className="h-4 w-4" />
                  Seleccionar en el mapa
                </Button>
              </div>

              <Button className="w-full gap-2">
                <Search className="h-4 w-4" />
                Ejecutar Análisis
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map Preview */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full min-h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Map className="h-4 w-4" />
                Vista del Mapa
              </CardTitle>
              <CardDescription>
                Haz clic en el mapa para seleccionar el punto central del análisis
              </CardDescription>
            </CardHeader>
            <CardContent className="relative flex-1">
              {/* Placeholder for the Leaflet map */}
              <div className="flex h-96 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                <div className="text-center">
                  <Map className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                  <p className="text-sm font-medium text-muted-foreground">
                    El mapa interactivo se renderizará aquí
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Integración con Leaflet + React-Leaflet
                  </p>
                </div>
              </div>

              {/* Color Legend */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Leyenda:
                </span>
                {[
                  { color: '#22c55e', label: '#1-3' },
                  { color: '#facc15', label: '#4-6' },
                  { color: '#f97316', label: '#7-9' },
                  { color: '#dc2626', label: '#10-15' },
                  { color: '#7f1d1d', label: '16+' },
                  { color: '#374151', label: 'N/A' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1">
                    <div
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
