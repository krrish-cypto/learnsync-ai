'use client';
import Link from 'next/link';
import { Sparkles, ArrowRight, BrainCircuit, Target, LayoutDashboard } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1.5rem 4rem', 
        borderBottom: '1px solid var(--surface-border)',
        background: 'rgba(var(--background-rgb), 0.5)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <Sparkles color="#8b5cf6" size={28} />
          <span>Learn<span className="gradient-text">Sync</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <ThemeToggle />
          <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>
            Login
          </Link>
          <Link href="/signup" className="btn-primary" style={{ textDecoration: 'none', fontWeight: 500 }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', position: 'relative' }}>
        
        {/* Floating background elements for depth */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', zIndex: -1 }}>
          <div style={{ position: 'absolute', top: '10%', left: '15%', opacity: 0.1, transform: 'scale(2)' }}>
            <BrainCircuit size={200} color="var(--primary)" />
          </div>
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', opacity: 0.1, transform: 'scale(1.5)' }}>
            <Target size={150} color="var(--accent)" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '800px' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '2rem', fontSize: '0.875rem', fontWeight: 600 }}>
            <Sparkles size={16} /> Official HCLTech AMPlified Submission
          </div>
          
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Your <span className="gradient-text">Ultra-Personalized</span> AI Learning Companion
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
            Stop watching generic tutorials. LearnSync generates a dynamic, 3D interactive roadmap tailored to your exact skills and career goals, complete with a contextual AI mentor.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              Start Learning Free <ArrowRight size={20} />
            </Link>
            <Link href="https://github.com/krrish-cypto/learnsync-ai" target="_blank" className="btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2.5rem', textDecoration: 'none' }}>
              View GitHub
            </Link>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          style={{ display: 'flex', gap: '2rem', marginTop: '6rem', maxWidth: '1000px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {[
            { icon: <LayoutDashboard size={24} color="var(--primary)" />, title: 'Interactive Roadmaps', desc: 'Visual 3D timelines that track your real-time progress.' },
            { icon: <BrainCircuit size={24} color="var(--primary)" />, title: 'Contextual AI Mentor', desc: 'An AI that knows your skills and dynamically answers your questions.' },
            { icon: <Target size={24} color="var(--primary)" />, title: 'Hyper-Personalized', desc: 'No cookie-cutter courses. Every curriculum is generated uniquely for you.' }
          ].map((feat, i) => (
            <div key={i} className="glass-panel" style={{ flex: '1 1 300px', padding: '2rem', textAlign: 'left' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
