// src/components/LearningBrain.tsx
'use client';

import { useEffect, useState } from 'react';
import { learningDB } from '@/lib/learning-db';
import { Card } from '@/components/ui/card';
import { TrendingUp, Brain, Zap } from 'lucide-react';
import Confetti from 'react-confetti';

export function LearningBrain() {
  const [stats, setStats] = useState({ accuracy: 0, jobs: 0, justHit90: false });

  useEffect(() => {
    const update = async () => {
      const all = await learningDB.getAll();
      const scopeJobs = all.filter((f): f is typeof all[0] => f.predictionType === "scope");
      const accuracy = scopeJobs.length
        ? scopeJobs.reduce((s, f) => s + f.performanceMetrics.accuracy, 0) / scopeJobs.length
        : 0.6;

      const newAcc = Math.round(accuracy * 1000) / 10;
      setStats(prev => ({
        accuracy: newAcc,
        jobs: scopeJobs.length,
        justHit90: newAcc >= 90 && prev.accuracy < 90
      }));
    };

    update();
    const id = setInterval(update, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {stats.justHit90 && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />}
      
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
