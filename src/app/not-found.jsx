'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      textAlign: 'center',
      gap: '1.5rem',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 10 }}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 60px rgba(139, 92, 246, 0.4)',
        }}
      >
        <span style={{ fontSize: '3rem', fontWeight: 900, color: 'white' }}>404</span>
      </motion.div>

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: '2.5rem', margin: 0 }}
      >
        Lost in the <span className="gradient-text">Learning Path</span>?
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ color: 'var(--text-muted)', maxWidth: '500px', fontSize: '1.1rem' }}
      >
        This page doesn't exist. But don't worry — your AI mentor is waiting to get you back on track!
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex gap-4"
      >
        <Link href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
          <Home size={18} /> Back to Dashboard
        </Link>
        <Link href="/chat" className="btn-secondary" style={{ textDecoration: 'none' }}>
          <Sparkles size={18} /> Ask AI Mentor
        </Link>
      </motion.div>
    </div>
  );
}
