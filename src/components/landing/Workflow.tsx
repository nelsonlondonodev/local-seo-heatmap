import { cn } from "@/lib/utils";

const WORKFLOW_STEPS = [
  { title: 'Conecta tu GMB', desc: 'Sincroniza tus fichas de Google Business de forma segura y automática.' },
  { title: 'Ejecuta el Escaneo', desc: 'Define el radio de acción y deja que nuestra inteligencia procese los datos.' },
  { title: 'Domina el Mercado', desc: 'Identifica brechas de oportunidad y optimiza tu presencia local.' }
];

interface WorkflowStepProps {
  step: typeof WORKFLOW_STEPS[number];
  index: number;
}

function WorkflowStep({ step, index }: WorkflowStepProps) {
  return (
    <div className="flex gap-6 group">
      <div className={cn(
        "flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900",
        "text-sm font-bold text-zinc-400 group-hover:text-white group-hover:border-zinc-600 transition-colors"
      )}>
        {index + 1}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-2 text-white">{step.title}</h4>
        <p className="text-zinc-400 font-normal text-base leading-relaxed">{step.desc}</p>
      </div>
    </div>
  );
}

export function Workflow() {
  return (
    <section className="py-24 border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="relative p-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000" 
                  alt="Dashboard" 
                  className="rounded-xl opacity-90 border border-zinc-800/50" 
                />
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-12 text-white leading-tight">
              Resultados en <span className="text-zinc-500">segundos.</span>
            </h2>
            <div className="space-y-10">
              {WORKFLOW_STEPS.map((step, i) => (
                <WorkflowStep key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
