// src/components/LearningBrain.tsx
'use client';

import { useEffect, useState } from 'react';
import { learningDB } from '@/lib/learning-db';
import { Card } from '@/components/ui/card';
import { TrendingUp, Brain, Zap } from 'lucide-react';

export function LearningBrain() {
  const [stats, setStats] = useState({ accuracy: 0, jobs: 0, justHit90: false });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const update = async () => {
      const all = await learningDB.getAll();
      const scopeJobs = all.filter((f): f is typeof all[0] => f.predictionType === "scope");
      const accuracy = scopeJobs.length
        ? scopeJobs.reduce((s, f) => s + f.performanceMetrics.accuracy, 0) / scopeJobs.length
        : 0.6;

      const newAcc = Math.round(accuracy * 1000) / 10;
      const justHit90 = newAcc >= 90 && stats.accuracy < 90;
      
      setStats(prev => ({
        accuracy: newAcc,
        jobs: scopeJobs.length,
        justHit90: justHit90
      }));

      if (justHit90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
    };

    update();
    const id = setInterval(update, 3000);
    return () => clearInterval(id);
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
              <div className="w-4 h-4 bg-yellow-400 rounded-full" />
            </div>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
          <div className="text-5xl font-bold">{stats.accuracy}%</div>
          <p className="text-muted-foreground mt-2">Current AI Accuracy</p>
        </Card>

        <Card className="p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto mb-4 text-green-600" />
          <div className="text-5xl font-bold">{stats.jobs}</div>
          <p className="text-muted-foreground mt-2">Jobs Taught AI</p>
        </Card>

        <Card className="p-8 text-center">
          <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
          <div className="text-3xl font-bold">
            {stats.accuracy >= 90 ? 'LIVE' : 'LEARNING'}
          </div>
          <p className="text-muted-foreground mt-2">
            {stats.accuracy >= 90 ? 'Exponential mode active' : 'Getting smarter fast'}
          </p>
        </Card>
      </div>
    </>
  );
}
