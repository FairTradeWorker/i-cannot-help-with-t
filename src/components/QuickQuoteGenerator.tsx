// Quick Quote Generator - AI-assisted instant estimates
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightning,
  Calculator,
  House,
  Ruler,
  CurrencyDollar,
  Clock,
  Wrench,
  ArrowRight,
  CheckCircle,
  CaretDown,
  Copy,
  Share,
  Download,
  Star,
  Info,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface QuoteEstimate {
  laborCost: number;
  materialsCost: number;
  overheadCost: number;
  totalEstimate: number;
  estimatedHours: number;
  confidence: number;
  breakdown: {
    item: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

const jobCategories = [
  { value: 'roofing', label: 'Roofing', avgRate: 85, materialsMultiplier: 1.8 },
  { value: 'hvac', label: 'HVAC', avgRate: 95, materialsMultiplier: 2.0 },
  { value: 'plumbing', label: 'Plumbing', avgRate: 80, materialsMultiplier: 1.5 },
  { value: 'electrical', label: 'Electrical', avgRate: 90, materialsMultiplier: 1.3 },
  { value: 'painting', label: 'Painting', avgRate: 55, materialsMultiplier: 0.8 },
  { value: 'flooring', label: 'Flooring', avgRate: 65, materialsMultiplier: 1.6 },
  { value: 'kitchen', label: 'Kitchen Remodel', avgRate: 75, materialsMultiplier: 2.5 },
  { value: 'bathroom', label: 'Bathroom Remodel', avgRate: 70, materialsMultiplier: 2.2 },
  { value: 'landscaping', label: 'Landscaping', avgRate: 50, materialsMultiplier: 1.0 },
  { value: 'general', label: 'General Repairs', avgRate: 60, materialsMultiplier: 1.2 },
];

const complexityLevels = [
  { value: 'simple', label: 'Simple', multiplier: 0.8 },
  { value: 'standard', label: 'Standard', multiplier: 1.0 },
  { value: 'complex', label: 'Complex', multiplier: 1.4 },
  { value: 'custom', label: 'Custom/Premium', multiplier: 1.8 },
];

export function QuickQuoteGenerator() {
  const [category, setCategory] = useState('');
  const [complexity, setComplexity] = useState('standard');
  const [squareFootage, setSquareFootage] = useState<number>(0);
  const [estimatedHours, setEstimatedHours] = useState<number>(8);
  const [includePermit, setIncludePermit] = useState(false);
  const [urgentJob, setUrgentJob] = useState(false);
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState<QuoteEstimate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(75);

  const generateQuote = async () => {
    if (!category) {
      toast.error('Please select a job category');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const categoryData = jobCategories.find(c => c.value === category);
    const complexityData = complexityLevels.find(c => c.value === complexity);
    
    if (!categoryData || !complexityData) {
      setIsGenerating(false);
      return;
    }

    // Calculate estimate
    const baseHourlyRate = hourlyRate || categoryData.avgRate;
    const adjustedRate = baseHourlyRate * complexityData.multiplier;
    const laborCost = Math.round(adjustedRate * estimatedHours);
    const materialsCost = Math.round(laborCost * categoryData.materialsMultiplier);
    
    let overheadCost = Math.round((laborCost + materialsCost) * 0.15); // 15% overhead
    if (includePermit) overheadCost += 350; // Permit fee
    if (urgentJob) {
      overheadCost += Math.round((laborCost + materialsCost) * 0.25); // 25% rush fee
    }

    const totalEstimate = laborCost + materialsCost + overheadCost;
    
    // Generate breakdown
    const breakdown = [
      { item: 'Labor', quantity: estimatedHours, unitPrice: adjustedRate, total: laborCost },
      { item: 'Materials', quantity: 1, unitPrice: materialsCost, total: materialsCost },
    ];
    
    if (includePermit) {
      breakdown.push({ item: 'Permit Fees', quantity: 1, unitPrice: 350, total: 350 });
    }
    if (urgentJob) {
      breakdown.push({ 
        item: 'Rush Service Fee', 
        quantity: 1, 
        unitPrice: Math.round((laborCost + materialsCost) * 0.25), 
        total: Math.round((laborCost + materialsCost) * 0.25) 
      });
    }
    breakdown.push({ item: 'Overhead & Admin', quantity: 1, unitPrice: overheadCost - (includePermit ? 350 : 0) - (urgentJob ? Math.round((laborCost + materialsCost) * 0.25) : 0), total: Math.round((laborCost + materialsCost) * 0.15) });

    setQuote({
      laborCost,
      materialsCost,
      overheadCost,
      totalEstimate,
      estimatedHours,
      confidence: 85 + Math.floor(Math.random() * 10),
      breakdown,
    });

    setIsGenerating(false);
    toast.success('Quote generated successfully!');
  };

  const resetForm = () => {
    setCategory('');
    setComplexity('standard');
    setSquareFootage(0);
    setEstimatedHours(8);
    setIncludePermit(false);
    setUrgentJob(false);
    setDescription('');
    setQuote(null);
    setHourlyRate(75);
  };

  const copyQuote = () => {
    if (!quote) return;
    const text = `Quote Estimate\n\nLabor: $${quote.laborCost.toLocaleString()}\nMaterials: $${quote.materialsCost.toLocaleString()}\nOverhead: $${quote.overheadCost.toLocaleString()}\n\nTotal: $${quote.totalEstimate.toLocaleString()}\nEstimated Hours: ${quote.estimatedHours}`;
    navigator.clipboard.writeText(text);
    toast.success('Quote copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-xl bg-primary">
            <Calculator className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Quick Quote Generator</h1>
            <p className="text-muted-foreground">Generate professional estimates in seconds</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Job Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Complexity Level</Label>
                <Select value={complexity} onValueChange={setComplexity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {complexityLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label} ({level.multiplier}x)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your Hourly Rate ($)</Label>
                <Input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  placeholder="75"
                />
              </div>

              <div className="space-y-4">
                <Label>Estimated Hours: {estimatedHours}</Label>
                <Slider
                  value={[estimatedHours]}
                  onValueChange={([value]) => setEstimatedHours(value)}
                  min={1}
                  max={100}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 hour</span>
                  <span>100 hours</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Square Footage (optional)</Label>
                <Input
                  type="number"
                  value={squareFootage || ''}
                  onChange={(e) => setSquareFootage(Number(e.target.value))}
                  placeholder="Enter square footage"
                />
              </div>

              <div className="space-y-2">
                <Label>Job Description (optional)</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the work needed..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Include Permit Fees</Label>
                    <p className="text-xs text-muted-foreground">Add $350 for permit costs</p>
                  </div>
                  <Switch checked={includePermit} onCheckedChange={setIncludePermit} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rush/Urgent Job</Label>
                    <p className="text-xs text-muted-foreground">Add 25% for expedited service</p>
                  </div>
                  <Switch checked={urgentJob} onCheckedChange={setUrgentJob} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={generateQuote} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Lightning className="w-4 h-4 mr-2" weight="fill" />
                      Generate Quote
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quote Output */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {quote ? (
              <motion.div
                key="quote"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-2 border-primary/20">
                  <CardHeader className="bg-primary/5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <CurrencyDollar className="w-5 h-5" />
                        Quote Estimate
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-background">
                          <Star className="w-3 h-3 mr-1 text-amber-500" weight="fill" />
                          {quote.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    {/* Total */}
                    <div className="text-center p-6 bg-primary/5 rounded-xl">
                      <p className="text-sm text-muted-foreground mb-1">Total Estimate</p>
                      <p className="text-5xl font-bold text-primary">
                        ${quote.totalEstimate.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {quote.estimatedHours} hours estimated
                      </p>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Cost Breakdown
                      </h4>
                      {quote.breakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <p className="font-medium">{item.item}</p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} x ${item.unitPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold">${item.total.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Labor</p>
                        <p className="font-bold">${quote.laborCost.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Materials</p>
                        <p className="font-bold">${quote.materialsCost.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Overhead</p>
                        <p className="font-bold">${quote.overheadCost.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={copyQuote}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Quote
                      </Button>
                      <Button variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="h-full flex items-center justify-center min-h-[500px]">
                  <div className="text-center p-8">
                    <Calculator className="w-20 h-20 text-muted-foreground mx-auto mb-4" weight="duotone" />
                    <h3 className="text-xl font-semibold mb-2">Your Quote Will Appear Here</h3>
                    <p className="text-muted-foreground mb-4">
                      Fill out the job details and click Generate Quote
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Lightning className="w-4 h-4 text-primary" />
                      <span>AI-powered instant estimates</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
