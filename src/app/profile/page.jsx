'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { User, GraduationCap, Briefcase, Code, Link2, Globe, Save, Loader2, X, Plus } from 'lucide-react';

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

export default function Profile() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    graduationYear: '',
    skills: [],
    bio: '',
    linkedin: '',
    github: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === 'loading') return;
      if (!session) { setLoading(false); return; }
      try {
        const res = await fetch(`/api/profile?userId=${session.user.id}`);
        const json = await res.json();
        if (json.user) {
          setForm({
            name: json.user.name || '',
            email: json.user.email || '',
            college: json.user.college || '',
            degree: json.user.degree || '',
            graduationYear: json.user.graduationYear || '',
            skills: json.user.skills || [],
            bio: json.user.bio || '',
            linkedin: json.user.linkedin || '',
            github: json.user.github || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session, status]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, ...form })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full flex-col gap-4">
      <div className="typing-indicator" style={{ transform: 'scale(1.5)' }}>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
        <span style={{ backgroundColor: 'var(--primary)' }}></span>
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading your profile...</p>
    </div>
  );

  return (
    <motion.div 
      className="flex-col gap-6" 
      style={{ paddingBottom: '4rem', maxWidth: '900px', margin: '0 auto' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1>My <span className="gradient-text">Profile</span></h1>
          <p>Manage your details. The AI Mentor uses this information to personalize your experience.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving}>
          {saving ? <><Loader2 size={18} className="spin" /> Saving...</> : saved ? <><Save size={18} /> Saved!</> : <><Save size={18} /> Save Profile</>}
        </button>
      </motion.header>

      {saved && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.875rem' }}
        >
          ✅ Profile saved successfully! The AI Mentor will now use your updated profile for more personalized responses.
        </motion.div>
      )}

      {/* Avatar & Basic Info */}
      <motion.div variants={itemVariants} className="glass-panel">
        <div className="flex gap-6 items-center" style={{ marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 800, color: 'white', flexShrink: 0
          }}>
            {form.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0 }}>{form.name || 'Your Name'}</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{form.email}</p>
          </div>
        </div>

        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} color="var(--primary)" /> Full Name
            </label>
            <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Krishna Dubey" />
          </div>
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} color="var(--primary)" /> Short Bio
            </label>
            <input className="input-field" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Aspiring Full-Stack Developer" />
          </div>
        </div>
      </motion.div>

      {/* Education */}
      <motion.div variants={itemVariants} className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GraduationCap size={20} color="var(--primary)" /> Education
        </h3>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>College / University</label>
            <input className="input-field" value={form.college} onChange={e => setForm(p => ({ ...p, college: e.target.value }))} placeholder="e.g., IIT Delhi" />
          </div>
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Degree / Major</label>
            <input className="input-field" value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} placeholder="e.g., B.Tech Computer Science" />
          </div>
          <div style={{ flex: 1, minWidth: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Graduation Year</label>
            <input className="input-field" value={form.graduationYear} onChange={e => setForm(p => ({ ...p, graduationYear: e.target.value }))} placeholder="e.g., 2027" />
          </div>
        </div>
      </motion.div>

      {/* Skills */}
      <motion.div variants={itemVariants} className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={20} color="var(--primary)" /> Skills & Technologies
        </h3>
        <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: '1rem' }}>
          {form.skills.map((skill, i) => (
            <span key={i} className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', padding: '0.35rem 0.75rem' }} onClick={() => removeSkill(skill)}>
              {skill} <X size={12} />
            </span>
          ))}
          {form.skills.length === 0 && <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>No skills added yet. Type below and press Enter.</p>}
        </div>
        <div className="flex gap-2">
          <input 
            className="input-field" 
            value={skillInput} 
            onChange={e => setSkillInput(e.target.value)} 
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill (e.g., React, Python, MongoDB) and press Enter" 
            style={{ flex: 1 }}
          />
          <button onClick={addSkill} className="btn-secondary" style={{ flexShrink: 0 }}>
            <Plus size={18} /> Add
          </button>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div variants={itemVariants} className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem' }}>🔗 Social Links</h3>
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={16} color="#0077b5" /> LinkedIn Profile
            </label>
            <input className="input-field" value={form.linkedin} onChange={e => setForm(p => ({ ...p, linkedin: e.target.value }))} placeholder="https://linkedin.com/in/your-profile" />
          </div>
          <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={16} /> GitHub Profile
            </label>
            <input className="input-field" value={form.github} onChange={e => setForm(p => ({ ...p, github: e.target.value }))} placeholder="https://github.com/your-username" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
