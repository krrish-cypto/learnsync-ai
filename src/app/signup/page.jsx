'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

import { Sparkles, Map, Target, MessageSquare } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      
      // Auto login after signup
      const loginRes = await signIn('credentials', { redirect: false, email, password });
      if (loginRes?.error) {
        setError("Account created but failed to log in.");
        setLoading(false);
      } else {
        router.push('/onboarding');
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', position: 'fixed', inset: 0, zIndex: 50, background: 'var(--background)' }}>
      {/* Left Side Branding */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
        padding: '4rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        color: 'white'
      }} className="hide-on-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          <Sparkles color="white" size={28} />
          <span>LearnSync</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', paddingLeft: '2.25rem', marginBottom: '2rem' }}>
          by KineticModifiers
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Your AI-Powered Learning Companion</h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '3rem', maxWidth: '500px' }}>
          Accelerate your career with personalized roadmaps, intelligent mentorship, and real-time progress tracking.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <Map size={24} />
            </div>
            <span style={{ fontSize: '1.1rem' }}>Custom AI-generated roadmaps</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <MessageSquare size={24} />
            </div>
            <span style={{ fontSize: '1.1rem' }}>Real-time AI mentorship</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
              <Target size={24} />
            </div>
            <span style={{ fontSize: '1.1rem' }}>Milestone tracking & progress</span>
          </div>
        </div>
      </div>

      {/* Right Side Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'var(--background)',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
          <ThemeToggle />
        </div>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: 0 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Sign up to generate your AI roadmap</p>
          </div>

          {/* Toggle Tabs */}
          <div style={{ display: 'flex', background: 'var(--surface)', padding: '4px', borderRadius: '8px', marginBottom: '2rem', border: '1px solid var(--surface-border)' }}>
            <Link href="/login" style={{ flex: 1, padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>
              Sign In
            </Link>
            <button style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'default' }}>
              Sign Up
            </button>
          </div>
          
          {error && <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
              <input type="text" required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
