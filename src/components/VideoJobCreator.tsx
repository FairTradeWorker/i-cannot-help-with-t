import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  VideoCamera, 
  Upload, 
  Eye, 
  Package, 
  Clock, 
  CurrencyDollar,
  CheckCircle,
  Warning,
  Certificate,
  TrendUp,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { extractVideoFrame, analyzeVideoFrames, analyzeJobFromVideo, type VideoAnalysis } from '@/lib/ai-service';
import type { JobScope } from '@/lib/types';
import { toast } from 'sonner';

interface VideoJobCreatorProps {
  onJobCreated: (jobData: { scope: JobScope; videoUrl: string; thumbnailUrl?: string; predictionId?: string }) => void;
  onCancel: () => void;
}

type Step = 'upload' | 'analyzing' | 'scope' | 'complete';

export function VideoJobCreator({ onJobCreated, onCancel }: VideoJobCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [extractedFrame, setExtractedFrame] = useState<string>('');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [jobScope, setJobScope] = useState<JobScope | null>(null);
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file');
      toast.error('Invalid file type');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video file must be less than 100MB');
      toast.error('File too large');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!videoFile) return;

    setCurrentStep('analyzing');
    setAnalysisProgress(0);

    try {
      setAnalysisProgress(20);
      toast.info('Extracting frame from video...');
      
      const frameBase64 = await extractVideoFrame(videoFile);
      setExtractedFrame(frameBase64);
      setAnalysisProgress(40);
      
      toast.info('Analyzing damage...');
      const analysis = await analyzeVideoFrames(frameBase64);
      setVideoAnalysis(analysis);
      setAnalysisProgress(70);
      
      toast.info('Generating job scope...');
      const scope = await analyzeJobFromVideo(analysis);
      setJobScope(scope);
      setAnalysisProgress(100);
      
      setCurrentStep('scope');
      toast.success('Analysis complete!');
    } catch (err) {
      setError('Failed to analyze video. Please try again.');
      toast.error('Analysis failed');
      setCurrentStep('upload');
      console.error(err);
    }
  };

  const handleCreateJob = async () => {
    if (!jobScope || !videoFile || !videoAnalysis) return;
    
    // Generate prediction ID
    const predictionId = `pred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Use extracted frame as thumbnail
    const thumbnailDataUrl = extractedFrame;
    
    // Call onJobCreated with all data
    onJobCreated({
      scope: jobScope,
      videoUrl: videoPreview,
      thumbnailUrl: thumbnailDataUrl,
      predictionId: predictionId
    });
    
    // Store prediction in KV
    try {
      await window.spark.kv.set(`prediction:${predictionId}`, {
        type: 'scope',
        prediction: jobScope,
        createdAt: new Date().toISOString(),
        damageType: videoAnalysis.damageType,
        urgency: videoAnalysis.urgencyLevel
      });
    } catch (err) {
      console.error('Failed to store prediction:', err);
      // Don't block job creation if storage fails
    }
    
    setCurrentStep('complete');
    toast.success('Job created successfully!');
  };

  const stepLabels = {
    upload: 'Upload Video',
    analyzing: 'Analyzing',
    scope: 'Review Scope',
    complete: 'Complete',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.177, ease: [0.4, 0, 0.2, 1] }}
      className="max-w-4xl mx-auto"
    >
      <Card className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <VideoCamera className="w-7 h-7 text-white" weight="fill" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Create Job from Video</h2>
              <p className="text-muted-foreground">Upload video to analyze and estimate your repair</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {(Object.keys(stepLabels) as Step[]).map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: currentStep === step ? 1.1 : 1, 
                      opacity: 1,
                    }}
                    transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      currentStep === step
                        ? 'bg-gradient-to-br from-primary to-accent text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </motion.div>
                  <span className="text-sm mt-2 text-center">{stepLabels[step]}</span>
                </div>
                {index < Object.keys(stepLabels).length - 1 && (
                  <div className="h-0.5 flex-1 bg-muted mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-[133ms] ${
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {!videoFile ? (
                  <>
                    <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Upload Repair Video</h3>
                    <p className="text-muted-foreground mb-4">
                      Film the damage for 60 seconds. We'll analyze and estimate the repair.
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload">
                      <Button asChild>
                        <span>Choose Video</span>
                      </Button>
                    </label>
                  </>
                ) : (
                  <>
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-w-2xl mx-auto rounded-lg mb-4"
                    />
                    <div className="flex gap-3 justify-center">
                      <Button onClick={handleAnalyze}>
                        <Eye className="w-5 h-5 mr-2" />
                        Analyze Video
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview('');
                        }}
                      >
                        Choose Different Video
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Warning className="w-4 h-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </motion.div>
          )}

          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
              className="py-12"
            >
              <div className="max-w-md mx-auto text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
                />
                <h3 className="text-xl font-bold mb-2">AI Analyzing Your Video</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI is examining the damage and generating a detailed estimate...
                </p>
                <Progress value={analysisProgress} className="mb-4" />
                <p className="text-sm text-muted-foreground">{analysisProgress}% Complete</p>
              </div>
            </motion.div>
          )}

          {currentStep === 'scope' && jobScope && (
            <motion.div
              key="scope"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.133, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Extracted Frame</h3>
                    {extractedFrame && (
                      <img 
                        src={extractedFrame} 
                        alt="Analyzed frame" 
                        className="w-full rounded-lg border border-border"
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{jobScope.jobTitle}</h3>
                      <p className="text-muted-foreground mt-2">{jobScope.summary}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="flex items-center gap-2">
                        <TrendUp className="w-4 h-4" />
                        {jobScope.confidenceScore}% Confident
                      </Badge>
                      {jobScope.permitRequired && (
                        <Badge variant="secondary" className="flex items-center gap-2">
                          <Certificate className="w-4 h-4" />
                          Permit Required
                        </Badge>
                      )}
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Package className="w-4 h-4" />
                          <span className="text-sm">Square Feet</span>
                        </div>
                        <p className="text-lg font-bold">{jobScope.estimatedSquareFootage}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">Labor Hours</span>
                        </div>
                        <p className="text-lg font-bold">{jobScope.laborHours}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <CurrencyDollar className="w-4 h-4" />
                          <span className="text-sm">Est. Cost</span>
                        </div>
                        <p className="text-lg font-bold">
                          ${jobScope.estimatedCost.min.toLocaleString()} - ${jobScope.estimatedCost.max.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Materials Required
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {jobScope.materials.map((material, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{material.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {material.quantity} {material.unit}
                            </p>
                          </div>
                          <p className="font-bold text-primary">
                            ${material.estimatedCost.toLocaleString()}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {jobScope.recommendations && jobScope.recommendations.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Recommendations
                      </h4>
                      <ul className="space-y-2">
                        {(jobScope.recommendations || []).map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {jobScope.warningsAndRisks && jobScope.warningsAndRisks.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Warning className="w-5 h-5 text-warning" />
                        Warnings & Risks
                      </h4>
                      <ul className="space-y-2">
                        {(jobScope.warningsAndRisks || []).map((warning, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Warning className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" weight="fill" />
                            <span className="text-sm">{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateJob}>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Create Job
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
