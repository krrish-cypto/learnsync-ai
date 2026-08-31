'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, MessageSquare, Map, Sparkles, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'AI Assistant', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'My Path', path: '/roadmap', icon: <Map size={20} /> },
    { name: 'Onboarding', path: '/onboarding', icon: <Compass size={20} /> },
  ];

  if (pathname === '/onboarding' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="brand-logo" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles color="#8b5cf6" size={24} />
          <span>Learn<span className="gradient-text">Sync</span></span>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', paddingLeft: '2.25rem' }}>
          by KineticModifiers
        </div>
      </div>
      
      <nav>
        {navItems.map((item) => {
          if (item.name === 'Onboarding') return null;
          return (
            <Link href={item.path} key={item.name} className={`nav-item ${pathname === item.path ? 'active' : ''}`}>
              {item.icon}
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
        <ThemeToggle />
      </div>

      {session?.user && (
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}

      <div className="profile-badge" style={{ marginTop: 0 }}>
        <div className="avatar">{session?.user?.name?.[0] || 'U'}</div>
        <div style={{ overflow: 'hidden' }}>
          <h4 style={{ margin: 0, fontSize: '0.875rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {session?.user?.name || 'Guest'}
          </h4>
        </div>
      </div>
    </aside>
  );
}
