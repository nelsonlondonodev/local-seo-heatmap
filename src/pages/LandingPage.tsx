import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Workflow } from '@/components/landing/Workflow';
import { Pricing } from '@/components/landing/Pricing';
import { FAQ } from '@/components/landing/FAQ';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export function LandingPage() {
  return (
    <div className="dark min-h-screen bg-[#030712] text-slate-50 selection:bg-primary/30 font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
