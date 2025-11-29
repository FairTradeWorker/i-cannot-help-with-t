// src/components/LearningBrain.tsx
'use client';

import { useEffect, useState } from 'react';
import { learningDB } from '@/lib/learning-db';
import { Card } from '@/components/ui/card';
import { Brain, TrendUp, Sparkle } from '@phosphor-icons/react';

export function LearningBrain() {
  const [stats, setStats] = useState({ accuracy: 0, jobs: 0, improved: false });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const all = await learningDB.getAll();
      const scopeJobs = all.filter((f): f is typeof all[0] => f.predictionType === "scope");
      
      const accuracy = scopeJobs.length
        ? scopeJobs.reduce((sum, f) => sum + f.performanceMetrics.accuracy, 0) / scopeJobs.length
        : 0.6;

      const newStats = {
        accuracy: Math.round(accuracy * 1000) / 10,
        jobs: scopeJobs.length,
        improved: accuracy >= 0.90 && stats.accuracy < 90
      };

      setStats(newStats);
      
      if (newStats.improved) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 2000);
    return () => clearInterval(interval);
  }, [stats.accuracy]);

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkle className="w-4 h-4 text-yellow-400" weight="fill" />
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-8 text-center">
          <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" weight="duotone" />
          <div className="text-6xl font-bold">{stats.accuracy}%</div>
          <div className="text-xl mt-2 opacity-90">Current AI Accuracy</div>
        </Card>

        <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-8 text-center">
          <TrendUp className="w-16 h-16 mx-auto mb-4 text-green-400" weight="duotone" />
          <div className="text-6xl font-bold">{stats.jobs}</div>
          <div className="text-xl mt-2 opacity-90">Jobs Taught the AI</div>
        </Card>

        <Card className="bg-white/10 backdrop-blur border-white/20 text-white p-8 text-center">
          <Sparkle className="w-16 h-16 mx-auto mb-4 text-yellow-400" weight="duotone" />
          <div className="text-4xl font-bold">
            {stats.accuracy >= 90 ? "LIVE" : "LEARNING"}
          </div>
          <div className="text-xl mt-2 opacity-90">
            {stats.accuracy >= 90 ? "Exponential Mode Activated" : "Getting smarter..."}
          </div>
        </Card>
      </div>

      <div className="text-center mt-12 text-white/80">
        <p className="text-lg">
          {stats.jobs === 0 
            ? "Be the first to teach the AI — complete a job with feedback!"
            : stats.accuracy >= 90
            ? "The AI has entered self-improvement overdrive"
            : `Just ${Math.round((0.90 - stats.accuracy/100) * 100)} more accurate jobs until exponential takeoff`}
        </p>
      </div>
    </>
  );
}

