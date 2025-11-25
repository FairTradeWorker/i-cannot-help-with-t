import { useState, useRef } from 'react';
import { VideoCamera, Eye, Package, Clock, CurrencyDollar, CheckCircle, Warning, Certificate } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyzeVideoFrames, analyzeJobFromVideo, type JobScope } from '@/lib/ai-service';
import { PricingSuggester } from './PricingSuggester';
import { InstantFinancingModal, FinanceAndBookButton } from './InstantFinancingModal';
import { toast } from 'sonner';
import type { FinancingApplication } from '@/lib/types';

type AnalysisStage = 'idle' | 'extracting' | 'analyzing-vision' | 'generating-scope' | 'complete' | 'error';

interface VideoUploaderProps {
  homeownerId?: string;
  onJobCreated?: () => void;
}

export function VideoUploader({ homeownerId, onJobCreated }: VideoUploaderProps = {}) {
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<AnalysisStage>('idle');
  const [scope, setScope] = useState<JobScope | null>(null);
  const [error, setError] = useState<string>('');
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [financingApproved, setFinancingApproved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFinancingApproved = (application: FinancingApplication) => {
    setFinancingApproved(true);
    toast.success('Financing approved! Your contractor has been booked.', {
      description: `Monthly payment: $${application.monthlyPayment}/mo`,
    });
    onJobCreated?.();
  };

  const handleFinancingDeclined = () => {
    toast.error('Financing not approved', {
      description: 'You can still get contractor bids with other payment options.',
    });
  };

  const extractFrameFromVideo = async (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.preload = 'metadata';
      video.muted = true;
      
      video.onloadeddata = () => {
        video.currentTime = video.duration / 2;
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx?.drawImage(video, 0, 0);
        
        const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        resolve(base64);
      };

      video.onerror = () => reject(new Error('Failed to load video'));
      video.src = URL.createObjectURL(videoFile);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video must be under 100MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    setError('');
    setScope(null);

    await analyzeVideo(file);
  };

  const analyzeVideo = async (videoFile: File) => {
    setLoading(true);
    setStage('extracting');
    setError('');
    setProgress(10);

    try {
      setProgress(20);
      const frameBase64 = await extractFrameFromVideo(videoFile);
      setProgress(30);

      setStage('analyzing-vision');
      const visionAnalysis = await analyzeVideoFrames(frameBase64);
      setProgress(60);

      setStage('generating-scope');
      const jobScope = await analyzeJobFromVideo(visionAnalysis);
      setProgress(100);

      setScope(jobScope);
      setStage('complete');
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
      setStage('error');
    } finally {
      setLoading(false);
    }
  };

  const getStageMessage = () => {
    switch (stage) {
      case 'extracting':
        return 'Extracting video frames...';
      case 'analyzing-vision':
        return 'Analyzing damage with AI vision...';
      case 'generating-scope':
        return 'Generating detailed scope and cost estimate...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">AI Video Job Analyzer</h1>
        <p className="text-muted-foreground text-lg">Upload a video of home damage for instant AI-powered job scope and cost estimation</p>
      </div>
      
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <VideoCamera className="w-5 h-5" weight="fill" />
          Upload Video
        </h3>
        
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          
          <label 
            htmlFor="video-upload" 
            className="cursor-pointer flex flex-col items-center"
          >
            <VideoCamera className="w-16 h-16 text-muted-foreground mb-4" weight="duotone" />
            <p className="text-lg font-medium text-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              MP4, MOV, or AVI (max 100MB)
            </p>
          </label>
        </div>

        {videoPreview && (
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ maxHeight: '300px' }}>
              <video
                ref={videoRef}
                src={videoPreview}
                controls
                className="w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div>
          </div>
        )}

        {loading && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary animate-pulse" weight="fill" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">{getStageMessage()}</p>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        )}
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <Warning className="w-5 h-5" weight="fill" />
          <AlertDescription className="ml-2">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </AlertDescription>
        </Alert>
      )}

      {scope && (
        <Tabs defaultValue="scope" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="scope">Job Scope</TabsTrigger>
            <TabsTrigger value="pricing">Pricing AI</TabsTrigger>
          </TabsList>

          <TabsContent value="scope">
            <Card className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{scope.jobTitle}</h3>
                  <p className="text-muted-foreground">{scope.summary}</p>
                </div>
                <div className="text-right ml-6">
                  <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                  <div className="relative inline-flex items-center justify-center">
                    <div className="text-3xl font-bold text-primary">{Math.round(scope.confidenceScore)}%</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-6 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CurrencyDollar className="w-4 h-4" weight="bold" />
                    <span>Estimated Cost</span>
                  </div>
                  <p className="text-2xl font-bold text-accent font-mono">
                    ${scope.estimatedCost.min.toLocaleString()} - ${scope.estimatedCost.max.toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="w-4 h-4" weight="bold" />
                    <span>Labor Hours</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground font-mono">{scope.laborHours}h</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Package className="w-4 h-4" weight="bold" />
                    <span>Square Footage</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground font-mono">{scope.estimatedSquareFootage} sq ft</p>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" weight="fill" />
                  Materials Needed
                </h4>
                <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border">
                        <th className="pb-2 font-medium">Item</th>
                        <th className="pb-2 font-medium">Quantity</th>
                        <th className="pb-2 text-right font-medium">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scope.materials.map((m, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0">
                          <td className="py-3">{m.name}</td>
                          <td className="py-3 text-muted-foreground">{m.quantity} {m.unit}</td>
                          <td className="py-3 text-right font-semibold font-mono">${m.estimatedCost.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="mb-6">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {scope.recommendations.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" weight="fill" />
                      <span className="text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {scope.warningsAndRisks.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-warning">
                      <Warning className="w-5 h-5" weight="fill" />
                      Warnings & Risks
                    </h4>
                    <ul className="space-y-2">
                      {scope.warningsAndRisks.map((w, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <Warning className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" weight="fill" />
                          <span className="text-foreground">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Separator className="my-6" />

              <div className="flex items-center justify-between pt-2">
                <div>
                  {scope.permitRequired && (
                    <Badge variant="outline" className="bg-warning/10 border-warning/30 text-warning-foreground px-4 py-2">
                      <Certificate className="w-4 h-4 mr-2" weight="fill" />
                      Permit Required
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button size="lg" variant="outline" className="font-semibold">
                    Get Contractor Bids
                  </Button>
                  <FinanceAndBookButton
                    jobTotal={scope.estimatedCost.max}
                    onClick={() => setShowFinancingModal(true)}
                  />
                </div>
              </div>

              {financingApproved && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" weight="fill" />
                    <span className="font-semibold">Financing approved! Your contractor has been booked.</span>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <PricingSuggester jobScope={scope} />
          </TabsContent>
        </Tabs>
      )}

      {scope && (
        <InstantFinancingModal
          open={showFinancingModal}
          onOpenChange={setShowFinancingModal}
          jobId={`job-${Date.now()}`}
          jobTitle={scope.jobTitle}
          jobTotal={scope.estimatedCost.max}
          homeownerId={homeownerId || 'demo-user'}
          onFinancingApproved={handleFinancingApproved}
          onFinancingDeclined={handleFinancingDeclined}
        />
      )}
    </div>
  );
}
