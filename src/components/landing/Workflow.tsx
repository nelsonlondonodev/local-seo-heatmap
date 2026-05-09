export function Workflow() {
  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
             <div className="relative p-3 rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-2xl rotate-1">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000" alt="Dashboard" className="rounded-[2rem] opacity-80" />
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-16 text-white leading-none">Resultados en <br/> <span className="text-primary italic">segundos.</span></h2>
            <div className="space-y-12">
              {[
                { title: 'Conecta tu GMB', desc: 'Sincroniza tus fichas de Google Business de forma segura.' },
                { title: 'Ejecuta el Escaneo', desc: 'Define el radio de acción y deja que nuestra IA haga el resto.' },
                { title: 'Domina el Mercado', desc: 'Identifica dónde necesitas más reseñas o optimización local.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="text-5xl font-black text-white/5 group-hover:text-primary/40 transition-colors">{i+1}</div>
                  <div>
                    <h4 className="text-2xl font-black mb-3 text-white">{item.title}</h4>
                    <p className="text-slate-400 font-medium text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
