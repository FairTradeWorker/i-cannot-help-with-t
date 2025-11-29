// src/components/LearningBrain.tsx
'use client';

import { useEffect, useState } from 'react';
import { learningDB } from '@/lib/learning-db';
import { getMaterialCorrections } from '@/lib/material-corrections';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Confetti from 'react-confetti';

export function LearningBrain() {
  const [stats, setStats] = useState({ accuracy: 0, jobs: 0, savings: 0, hit90: false });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topMaterials, setTopMaterials] = useState<any[]>([]);

  useEffect(() => {
    const update = async () => {
      const all = await learningDB.getAll();
      const scope = all.filter((f): f is typeof all[0] => f.predictionType === "scope");
      const accuracy = scope.length 
        ? scope.reduce((s, f) => s + f.performanceMetrics.accuracy, 0) / scope.length 
        : 0.6;

      // Calculate total savings (over-estimates that were corrected)
      const savings = scope.reduce((s, f) => {
        const pred = (f.prediction.estimatedCost?.min + f.prediction.estimatedCost?.max) / 2 || 0;
        const actual = f.actualOutcome.totalCost || 0;
        return s + Math.max(0, pred - actual);
      }, 0);

      const newAcc = Math.round(accuracy * 1000) / 10;
      setStats(prev => ({
        accuracy: newAcc,
        jobs: scope.length,
        savings: Math.round(savings),
        hit90: newAcc >= 90 && prev.accuracy < 90
      }));

      // Chart data - group by batches of 5 jobs
      const grouped = scope.reduce((acc, f, i) => {
        const bucket = Math.floor(i / 5);
        if (!acc[bucket]) acc[bucket] = { job: bucket * 5 + 5, acc: 0, count: 0 };
        acc[bucket].acc += f.performanceMetrics.accuracy;
        acc[bucket].count++;
        return acc;
      }, {} as any);
      
      setChartData(Object.values(grouped).map((g: any) => ({ 
        job: g.job, 
        accuracy: Math.round((g.acc / g.count) * 1000) / 10 
      })));

      // Top materials corrections
      const corrections = await getMaterialCorrections();
      setTopMaterials(corrections.slice(0, 5));
    };

    update();
    const id = setInterval(update, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {stats.hit90 && <Confetti recycle={false} width={window.innerWidth} height={window.innerHeight} />}
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <div className="text-4xl font-bold">{stats.accuracy}%</div>
          <p className="text-muted-foreground">AI Accuracy</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold">{stats.jobs}</div>
          <p className="text-muted-foreground">Jobs Learned</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold">${stats.savings.toLocaleString()}</div>
          <p className="text-muted-foreground">Saved by AI</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold">{stats.accuracy >= 90 ? 'LIVE' : 'GROWING'}</div>
          <p className="text-muted-foreground">Status</p>
        </Card>
      </div>

      {chartData.length > 1 && (
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Accuracy Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="job" />
              <YAxis domain={[50, 100]} />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Accuracy']}
                labelFormatter={(label) => `After ${label} jobs`}
              />
              <Line type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {topMaterials.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Top AI Improvements</h3>
          <div className="space-y-3">
            {topMaterials.map((m, i) => (
              <div key={i} className="flex justify-between items-center">
                <span>{m.material}</span>
                <span className={`font-semibold ${m.adjustmentPct > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {m.adjustmentPct > 0 ? '+' : ''}{m.adjustmentPct.toFixed(0)}% adjustment
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
