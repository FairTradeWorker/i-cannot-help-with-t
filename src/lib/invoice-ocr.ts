// src/lib/invoice-ocr.ts
// Phase 3 Zero-Click: Automated invoice reading with GPT-4o Vision

import { recordLearningFeedback, recordJobOutcome } from '@/lib/ai-service';
import { dataStore } from '@/lib/store';

export async function uploadInvoiceImages(jobId: string, files: File[]): Promise<void> {
  // Convert images to base64
  const base64Images = await Promise.all(
    files.map(async (file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })
  );

  // Use GPT-4o Vision to extract invoice data
  const imagesText = base64Images.map((img, i) => `IMAGE ${i + 1}:\n${img}`).join('\n\n');
  
  const promptText = `You are an expert at reading construction invoices and receipts.

Analyze these invoice/receipt images and extract:
1. Total cost (final amount charged)
2. Labor hours (if mentioned)
3. Materials used (list of items purchased with quantities and costs)

Return ONLY valid JSON in this exact format:
{
  "totalCost": 5000,
  "laborHours": 24,
  "materials": [
    {"name": "Shingles", "quantity": 30, "unit": "bundles", "cost": 1200},
    {"name": "Nails", "quantity": 5, "unit": "boxes", "cost": 50}
  ]
}

Be extremely accurate. If a field is not found, use 0 or empty array.

${imagesText}`;

  const response = await window.spark.llm(promptText, "gpt-4o", true);
  
  let parsed: {
    totalCost: number;
    laborHours: number;
    materials: Array<{ name: string; quantity: number; unit: string; cost: number }>;
  };

  try {
    const jsonStr = response.trim();
    // Remove markdown code blocks if present
    const cleanJson = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    parsed = JSON.parse(cleanJson);
  } catch (error) {
    console.error('Failed to parse invoice data:', error);
    parsed = { totalCost: 0, laborHours: 0, materials: [] };
  }

  // Get the job
  const job = await dataStore.getJobById(jobId);
  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  if (!job.predictionId) {
    throw new Error(`Job ${jobId} has no predictionId - cannot learn from this job`);
  }

  // Update job with actuals
  job.actualCost = parsed.totalCost || 0;
  job.actualLaborHours = parsed.laborHours || 0;
  job.actualMaterials = parsed.materials.map(m => ({
    name: m.name,
    quantity: m.quantity,
    unit: m.unit,
    estimatedCost: m.cost
  }));
  job.feedbackCollected = true;
  job.feedbackCollectedAt = new Date();
  await dataStore.saveJob(job);

  // Trigger learning automatically (zero-click)
  // Record learning feedback
  await recordLearningFeedback(
    job.predictionId,
    job.id,
    {
      totalCost: parsed.totalCost || 0,
      laborHours: parsed.laborHours || 0
    }
  );

  // Record full job outcome
  await recordJobOutcome(
    jobId,
    {
      materials: parsed.materials.map(m => ({
        name: m.name,
        quantity: m.quantity,
        unit: m.unit,
        estimatedCost: m.cost
      })),
      laborHours: parsed.laborHours || 0,
      totalCost: parsed.totalCost || 0
    }
  );

  console.log("✅ Invoice processed automatically — AI learned from job", jobId);
}

