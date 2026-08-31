'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, CheckCircle2, XCircle, ArrowRight, RefreshCw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setQuizFinished(false);
    setIsAnswered(false);
    setSelectedOption(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      });
      const data = await res.json();
      
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        setError(data.error || "Failed to generate quiz.");
      }
    } catch (err) {
      setError("An error occurred connecting to the AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
      if (score >= questions.length - 2) {
        // Confetti for good score
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-col items-center justify-center h-full gap-6 text-center" style={{ minHeight: '80vh' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', inset: 0, border: '4px dashed var(--primary)', borderRadius: '50%', opacity: 0.3 }}
          />
          <BrainCircuit size={40} color="var(--primary)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div>
          <h2>AI is crafting your quiz...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Analyzing your roadmap and generating contextual questions.</p>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="flex-col items-center justify-center h-full gap-6 text-center" style={{ minHeight: '80vh' }}>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '50%', 
          background: percentage >= 60 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: percentage >= 60 ? 'var(--success)' : 'var(--danger)',
          marginBottom: '1rem'
        }}>
          <Award size={50} />
        </div>
        <h1 style={{ fontSize: '3rem', margin: 0 }}>{score} / {questions.length}</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
          {percentage >= 80 ? 'Outstanding! You really know your stuff.' : 
           percentage >= 60 ? 'Good job! Keep learning and you will master this.' : 
           'Keep practicing! Review your roadmap and try again.'}
        </p>
        <button onClick={startQuiz} className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1.125rem' }}>
          <RefreshCw size={20} /> Generate New Quiz
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex-col items-center justify-center h-full gap-6 text-center" style={{ minHeight: '80vh', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ padding: '2rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '24px', marginBottom: '1rem' }}>
          <BrainCircuit size={64} color="var(--primary)" />
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Knowledge <span className="gradient-text">Check</span></h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Test your skills with an AI-generated quiz tailored strictly to your current learning path and completed milestones. 
        </p>
        {error && <div style={{ color: 'var(--danger)', marginTop: '1rem' }}>{error}</div>}
        <button onClick={startQuiz} className="btn-primary" style={{ marginTop: '2rem', padding: '1rem 3rem', fontSize: '1.25rem', borderRadius: '50px' }}>
          Start Quiz
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)', width: '80px' }}>
          Q {currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>/ {questions.length}</span>
        </div>
        <div style={{ flex: 1, height: '8px', background: 'var(--surface-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--accent))' }}
          />
        </div>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
          Score: {score}
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1 }}
        >
          <h2 style={{ fontSize: '2rem', lineHeight: 1.4, marginBottom: '3rem' }}>
            {currentQ.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentQ.options.map((opt, i) => {
              let btnStyle = { 
                padding: '1.5rem', 
                borderRadius: '16px', 
                border: '2px solid var(--surface-border)', 
                background: 'var(--surface)', 
                textAlign: 'left', 
                fontSize: '1.125rem',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              };
              
              let icon = null;

              if (isAnswered) {
                if (i === currentQ.correctAnswerIndex) {
                  btnStyle.background = 'rgba(16, 185, 129, 0.1)';
                  btnStyle.borderColor = 'var(--success)';
                  btnStyle.color = 'var(--success)';
                  icon = <CheckCircle2 size={24} />;
                } else if (i === selectedOption) {
                  btnStyle.background = 'rgba(239, 68, 68, 0.1)';
                  btnStyle.borderColor = 'var(--danger)';
                  btnStyle.color = 'var(--danger)';
                  icon = <XCircle size={24} />;
                } else {
                  btnStyle.opacity = 0.5;
                }
              } else {
                // Hover effect handled in CSS ideally, but inline for now we rely on standard interaction
              }

              return (
                <button 
                  key={i} 
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  style={btnStyle}
                  className={!isAnswered ? 'hover-scale' : ''}
                >
                  <span style={{ flex: 1 }}>{opt}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(56, 189, 248, 0.1)', borderLeft: '4px solid #38bdf8', borderRadius: '8px' }}
            >
              <h4 style={{ color: '#38bdf8', margin: '0 0 0.5rem 0' }}>Explanation</h4>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{currentQ.explanation}</p>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
        {isAnswered && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={handleNext} 
            className="btn-primary" 
            style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'} <ArrowRight size={20} />
          </motion.button>
        )}
      </div>

    </div>
  );
}
