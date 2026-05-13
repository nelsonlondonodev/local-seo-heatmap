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
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white font-sans overflow-x-hidden">
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
