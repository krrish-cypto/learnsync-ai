'use client';
import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, Lock, Sparkles, Loader2, Download } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function Roadmap() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPath = async () => {
      if (status === 'loading') return;
      if (!session) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`/api/roadmap?userId=${session.user.id}`);
        const json = await res.json();
        if (json.milestones) {
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPath();
  }, [session, status]);

  const handleComplete = async (milestoneId) => {
    try {
      setLoading(true);
      await fetch('/api/milestone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, pathId: data.path.id })
      });

      // Fire celebration confetti!
      const duration = 2000;
      const end = Date.now() + duration;
      const colors = ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
      
      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      // Wait a moment so user sees the confetti, then reload
      setTimeout(() => window.location.reload(), 1500);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.text('LearnSync Candidate Progress Report', 14, 22);
    
    // User Details
    doc.setFontSize(12);
    doc.text(`Candidate: ${session?.user?.name || 'User'}`, 14, 32);
    doc.text(`Path: ${data.path.title}`, 14, 38);
    doc.text(`Description: ${data.path.description}`, 14, 44);

    // Table Data
    const tableColumn = ["Milestone", "Type", "Status", "Est. Time"];
    const tableRows = [];

    data.milestones.forEach(m => {
      const milestoneData = [
        m.title,
        m.type,
        m.status.toUpperCase(),
        m.estimatedTime || 'N/A'
      ];
      tableRows.push(milestoneData);
    });

    doc.autoTable({
      startY: 50,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }, // Brand primary purple
    });

    doc.save(`LearnSync_Report_${session?.user?.name || 'User'}.pdf`);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <div className="typing-indicator" style={{ transform: 'scale(1.5)' }}>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>AI is rendering your roadmap...</p>
    </div>
  );

  if (!data) return (
    <div className="flex-col items-center justify-center h-full gap-4 text-center">
      <h2>No Learning Path Found</h2>
      <p>Please complete the onboarding flow to generate your personalized AI roadmap.</p>
      <Link href="/onboarding" className="btn-primary">Go to Onboarding</Link>
    </div>
  );

  const { path, milestones } = data;

  return (
    <div className="flex-col gap-6" style={{ paddingBottom: '4rem' }}>
      <header className="flex justify-between items-center">
        <div>
          <h1>Your Personalized <span className="gradient-text">Roadmap</span></h1>
          <p>{path.title} - {path.description}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={downloadPDF} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
            <Download size={16} /> Download Report
          </button>
          <Link href="/onboarding" className="btn-primary" style={{ fontSize: '0.875rem' }}>
            <Sparkles size={16} /> Update Goals
          </Link>
        </div>
      </header>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <motion.div 
          className="flex-col" 
          style={{ position: 'relative', padding: '2rem 0' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ position: 'absolute', left: '2.5rem', top: '0', width: '2px', background: 'linear-gradient(180deg, var(--primary) 0%, var(--surface-border) 100%)', zIndex: 0 }}
          ></motion.div>

          {milestones.map((node, index) => (
            <motion.div variants={itemVariants} key={node.id} className="flex gap-6" style={{ position: 'relative', zIndex: 1, marginBottom: index === milestones.length - 1 ? 0 : '3rem' }}>
              
              <div style={{ width: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexShrink: 0 }}>
                <div style={{
                  width: '3rem', height: '3rem', borderRadius: '50%',
                  background: node.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : node.status === 'in-progress' ? 'rgba(139, 92, 246, 0.2)' : 'var(--surface)',
                  border: `2px solid ${node.status === 'completed' ? 'var(--success)' : node.status === 'in-progress' ? 'var(--primary)' : 'var(--surface-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: node.status === 'completed' ? 'var(--success)' : node.status === 'in-progress' ? 'var(--primary)' : 'var(--text-muted)'
                }}>
                  {node.status === 'completed' && <CheckCircle2 size={24} />}
                  {node.status === 'in-progress' && <Circle size={24} />}
                  {node.status === 'locked' && <Lock size={20} />}
                </div>
              </div>

              <div className="glass-panel" style={{ 
                flex: 1, padding: '1.5rem', 
                background: node.status === 'locked' ? 'var(--surface)' : 'var(--glass-bg)',
                opacity: node.status === 'locked' ? 0.7 : 1,
                border: node.status === 'in-progress' ? '1px solid var(--primary)' : '1px solid var(--glass-border)'
              }}>
                <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, color: node.status === 'locked' ? 'var(--text-muted)' : 'var(--foreground)' }}>{node.title}</h3>
                  <div className="flex gap-2">
                    {node.estimatedTime && (
                      <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
                        ⏱️ {node.estimatedTime}
                      </span>
                    )}
                    <span className={`badge ${node.type === 'Project' ? 'badge-warning' : ''}`} style={{ background: node.type === 'Project' ? 'rgba(245, 158, 11, 0.1)' : 'var(--surface-border)' }}>
                      {node.type}
                    </span>
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{node.description}</p>
                
                {node.aiNote && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', borderLeft: '3px solid var(--primary)', fontSize: '0.875rem' }}>
                    <strong style={{ color: 'var(--primary)' }}>AI Insight:</strong> {node.aiNote}
                  </div>
                )}

                {node.resourceUrl && node.status !== 'locked' && (
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <a href={node.resourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'inline-block', fontSize: '0.875rem', textDecoration: 'none' }}>
                      {node.type === 'Project' ? 'View Project Specs' : 'Start Learning'} →
                    </a>
                    {node.status === 'in-progress' && (
                      <button onClick={() => handleComplete(node.id)} className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                        Mark as Complete <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
