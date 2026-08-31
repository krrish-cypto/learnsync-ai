'use client';
import { useState } from 'react';
import { BrainCircuit, Target, Code, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Onboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ interests: '', experience: 'beginner', goals: '' });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Submit to AI backend
    setLoading(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          interests: formData.interests,
          experience: formData.experience,
          goals: formData.goals
        })
      });
      const data = await res.json();
      
      if (data.success) {
        router.push('/roadmap'); // Navigate directly to the generated roadmap
      } else {
        alert(data.error || "Failed to generate path.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate path. Is the API key configured?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col items-center justify-center" style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', padding: '2rem' }}>
      <div className="glass-panel text-center" style={{ width: '100%', maxWidth: '600px', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <BrainCircuit className="gradient-text" size={48} style={{ margin: '0 auto 1rem' }} color="#8b5cf6" />
          <h1 style={{ fontSize: '2rem' }}>Configure Your <span className="gradient-text">Learning Path</span></h1>
          <p>Let AI map out the perfect journey for your career goals.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', background: i <= step ? 'var(--primary)' : 'var(--surface-border)', borderRadius: '2px', transition: 'all 0.3s ease' }} />
          ))}
        </div>

        <div style={{ minHeight: '200px' }}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-col gap-4">
                <h2>What are your core interests?</h2>
                <input 
                  className="input-field" 
                  placeholder="e.g. Next.js, Data Science, AI..." 
                  value={formData.interests}
                  onChange={(e) => setFormData({...formData, interests: e.target.value})}
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-col gap-4">
                <h2>What is your current experience level?</h2>
                <div className="flex-col gap-3" style={{ marginTop: '1rem' }}>
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: formData.experience === level ? 'rgba(139, 92, 246, 0.1)' : 'var(--secondary)', border: `1px solid ${formData.experience === level ? 'var(--primary)' : 'var(--surface-border)'}`, borderRadius: '8px', cursor: 'pointer' }}>
                      <input 
                        type="radio" 
                        name="experience" 
                        value={level}
                        checked={formData.experience === level}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        style={{ accentColor: 'var(--primary)', transform: 'scale(1.2)' }}
                      />
                      <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{level}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="flex-col gap-4">
                <h2>What is your ultimate goal?</h2>
                <textarea 
                  className="input-field" 
                  placeholder="I want to..." 
                  rows={4}
                  value={formData.goals}
                  onChange={(e) => setFormData({...formData, goals: e.target.value})}
                  style={{ resize: 'none', fontFamily: 'inherit' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-between items-center" style={{ marginTop: '3rem' }}>
          {step > 1 ? (
            <button className="btn-secondary" onClick={() => setStep(step - 1)} disabled={loading}>Back</button>
          ) : <div></div>}
          
          <button className="btn-primary" onClick={handleNext} disabled={loading}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>AI is thinking</span>
                <div className="typing-indicator" style={{ padding: 0 }}>
                  <span style={{ backgroundColor: 'white' }}></span>
                  <span style={{ backgroundColor: 'white' }}></span>
                  <span style={{ backgroundColor: 'white' }}></span>
                </div>
              </div>
            ) : step === 3 ? <><Sparkles size={18} /> Generate Path</> : <><ArrowRight size={18} /> Next</>}
          </button>
        </div>
      </div>
    </div>
  );
}
