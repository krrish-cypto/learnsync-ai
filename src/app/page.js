'use client';
import { useEffect, useState } from 'react';
import { BookOpen, Target, Award, ArrowRight, Play, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Typewriter effect state (must be before early returns)
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      if (status === 'loading') return;
      if (!session) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/dashboard?userId=${session.user.id}`);
        const json = await res.json();
        if (json.user) setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [session, status]);

  // Typewriter effect logic
  useEffect(() => {
    if (!data?.path?.title) return;
    const fullText = data.path.title;
    let i = 0;
    setTypedText('');
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <div className="typing-indicator" style={{ transform: 'scale(1.5)' }}>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>AI is analyzing your progress...</p>
    </div>
  );

  if (!data) return (
    <div className="flex-col items-center justify-center h-full gap-4 text-center">
      <h2>Welcome to LearnSync</h2>
      <p>Configure your learning path to see your dashboard.</p>
      <Link href="/onboarding" className="btn-primary">Start Onboarding</Link>
    </div>
  );

  const { user, path, stats, nextAction, recentMilestones, allMilestones } = data;

  return (
    <motion.div 
      className="flex-col gap-6" 
      style={{ paddingBottom: '4rem' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <div>
          <h1>{stats.completed === 0 ? "Welcome" : "Welcome back"}, <span className="gradient-text">{session?.user?.name || 'Explorer'}</span></h1>
          <p>Here's your learning progress toward: <strong style={{ borderRight: '2px solid var(--primary)', paddingRight: '2px', animation: 'blink 1s step-end infinite' }}>{typedText}</strong></p>
        </div>
        <div className="flex gap-4">
          <Link href="/onboarding" className="btn-secondary">
            Update Goals
          </Link>
          <Link href="/chat" className="btn-primary">
            <Target size={18} />
            Ask AI Mentor
          </Link>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="flex gap-4" style={{ marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div className="glass-panel" style={{ flex: 1, minWidth: '200px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.completed}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Milestones Done</p>
            </div>
          </div>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '200px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
              <Target size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.total - stats.completed}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Active Tasks</p>
            </div>
          </div>
        </div>
        <div className="glass-panel" style={{ flex: 1, minWidth: '200px' }}>
          <div className="flex items-center gap-3">
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
              <Award size={24} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>Lvl {user.level}</h3>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>Skill Level</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-6" style={{ flexWrap: 'wrap' }}>
        <div className="flex-col gap-6" style={{ flex: 2, minWidth: '300px' }}>
          {nextAction ? (
            <div className="glass-panel">
              <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
                <h2>Next Recommended Action</h2>
                <span className="badge badge-primary">Up Next</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{nextAction.title}</h3>
                    <div className="flex gap-2 items-center">
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>{nextAction.type}</p>
                      {nextAction.estimatedTime && <span style={{ color: '#38bdf8', fontSize: '0.875rem' }}>• ⏱️ {nextAction.estimatedTime}</span>}
                    </div>
                  </div>
                  {nextAction.resourceUrl ? (
                    <a href={nextAction.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '1rem', textDecoration: 'none' }}>
                      <Play size={24} />
                    </a>
                  ) : (
                    <button className="btn-primary" style={{ padding: '1rem' }}><Play size={24} /></button>
                  )}
                </div>
                {nextAction.aiNote && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--surface-border)' }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                      <strong>AI Explanation:</strong> "{nextAction.aiNote}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
             <div className="glass-panel">
                <h2>All caught up!</h2>
                <p>You have completed your learning path. Check back later or generate a new one!</p>
             </div>
          )}

          {recentMilestones.length > 0 && (
            <div className="glass-panel">
              <h2>Recent Milestones</h2>
              <div className="flex-col gap-4" style={{ marginTop: '1.5rem' }}>
                {recentMilestones.map((item, i) => (
                  <div key={i} className="flex items-center gap-4" style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '8px' }}>
                    <CheckCircle2 color="#10b981" size={24} />
                    <div>
                      <h4 style={{ margin: 0 }}>{item.title}</h4>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-col gap-6" style={{ flex: 1, minWidth: '300px' }}>
          <div className="glass-panel">
            <h2>Overall Progress</h2>
            <div style={{ marginTop: '1.5rem' }}>
              <div className="flex justify-between" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                <span>Completion</span>
                <span>{stats.progress}%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.progress}%`, background: 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h2>Your Path</h2>
            <div style={{ marginTop: '1rem' }}>
              {allMilestones.slice(0, 4).map((m, i) => (
                 <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', opacity: m.status === 'locked' ? 0.5 : 1 }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: m.status === 'completed' ? 'none' : '2px solid var(--surface-border)', background: m.status === 'completed' ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                     {m.status === 'completed' ? <CheckCircle2 size={16} color="white" /> : i+1}
                   </div>
                   <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{m.title}</span>
                 </div>
              ))}
              {allMilestones.length > 4 && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>...and {allMilestones.length - 4} more</div>}
            </div>
            <Link href="/roadmap" className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>
              View Full Roadmap <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
