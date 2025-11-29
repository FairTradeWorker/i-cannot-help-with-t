// src/lib/material-corrections.ts
// Phase 2: Material quantity corrections based on learned patterns

import { learningDB } from '@/lib/learning-db';

export interface Correction {
  material: string;
  trade?: string;
  zipPrefix?: string;
  adjustmentPct: number;
  confidence: number;
  count: number;
}

export async function getMaterialCorrections(
  trade?: string,
  zipPrefix?: string
): Promise<Correction[]> {
  const feedbacks = await learningDB.getAll();
  const corrections: Record<string, Correction> = {};

  for (const f of feedbacks) {
    if (f.predictionType !== "scope") continue;
    
    const prediction = f.prediction as any;
    const actual = f.actualOutcome;
    
    // Extract zip prefix from jobId or prediction metadata
    const prefix = zipPrefix || (prediction?.zipCode?.substring(0, 3));
    const materialTrade = trade || prediction?.trade || 'all';

    // Compare predicted vs actual materials
    const predictedMaterials = prediction?.materials || [];
    const actualMaterials = actual.materials || [];

    // Find material quantity differences
    for (const predMat of predictedMaterials) {
      const actualMat = actualMaterials.find((am: any) => 
        am.name?.toLowerCase().includes(predMat.name?.toLowerCase() || '') ||
        predMat.name?.toLowerCase().includes(am.name?.toLowerCase() || '')
      );

      if (actualMat && predMat.quantity) {
        const quantityError = ((actualMat.quantity || 0) - predMat.quantity) / predMat.quantity;
        const key = `${predMat.name?.toLowerCase() || 'unknown'}__${materialTrade}__${prefix || 'all'}`;

        if (!corrections[key]) {
          corrections[key] = {
            material: predMat.name || 'Unknown',
            trade: materialTrade !== 'all' ? materialTrade : undefined,
            zipPrefix: prefix,
            adjustmentPct: 0,
            confidence: 0,
            count: 0
          };
        }

        const c = corrections[key];
        c.count++;
        c.adjustmentPct += quantityError * 100;
        c.confidence = c.count > 5 ? 0.9 : Math.min(0.9, c.count / 10);
      }
    }
  }

  return Object.values(corrections)
    .map(c => ({ ...c, adjustmentPct: c.adjustmentPct / c.count }))
    .filter(c => Math.abs(c.adjustmentPct) > 5 && c.confidence > 0.5)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

