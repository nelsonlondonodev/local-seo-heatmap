export function HeatmapLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-md border border-border bg-background/90 p-3 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-foreground">
          Leyenda de Posiciones
        </span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {[
            { color: '#22c55e', label: '#1-3' },
            { color: '#facc15', label: '#4-6' },
            { color: '#f97316', label: '#7-9' },
            { color: '#dc2626', label: '#10-15' },
            { color: '#7f1d1d', label: '16-20' },
            { color: '#374151', label: '20+' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[10px] text-muted-foreground font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
