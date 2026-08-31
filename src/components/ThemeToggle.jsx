'use client';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ width: 104, height: 34 }} />;

  return (
    <div className="flex gap-2 items-center" style={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', padding: '4px', borderRadius: '8px' }}>
      <button 
        onClick={() => setTheme('light')} 
        style={{ padding: '6px', background: theme === 'light' ? 'var(--primary)' : 'transparent', color: theme === 'light' ? 'white' : 'var(--text-muted)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button 
        onClick={() => setTheme('system')} 
        style={{ padding: '6px', background: theme === 'system' ? 'var(--primary)' : 'transparent', color: theme === 'system' ? 'white' : 'var(--text-muted)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
        title="System Preference"
      >
        <Monitor size={16} />
      </button>
      <button 
        onClick={() => setTheme('dark')} 
        style={{ padding: '6px', background: theme === 'dark' ? 'var(--primary)' : 'transparent', color: theme === 'dark' ? 'white' : 'var(--text-muted)', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
