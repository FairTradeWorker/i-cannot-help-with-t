import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, MapPin, CalendarBlank, CurrencyDollar, House } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TextJobPostProps {
  onJobCreated: (jobData: { title: string; description: string; category: string; timeline: string }) => void;
  onCancel: () => void;
}

export function TextJobPost({ onJobCreated, onCancel }: TextJobPostProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');

  const categories = [
    'Roofing',
    'HVAC',
    'Plumbing',
    'Electrical',
    'Landscaping',
    'Painting',
    'Carpentry',
    'Flooring',
    'Kitchen Remodel',
    'Bathroom Remodel',
    'General Repairs',
    'Other',
  ];

  const timelines = [
    'Urgent (within 1 week)',
    'Soon (1-2 weeks)',
    'Flexible (2-4 weeks)',
    'Planning (1+ months)',
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error('Please enter a job title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    if (!category) {
      toast.error('Please select a job category');
      return;
    }
    if (!timeline) {
      toast.error('Please select a timeline');
      return;
    }

    onJobCreated({ title, description, category, timeline });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold">Text Job Post</h2>
          <p className="text-muted-foreground">Describe your project in detail to get accurate bids</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" weight="fill" />
                Job Information
              </CardTitle>
              <CardDescription>Provide details about the work you need done</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Replace Kitchen Faucet, Install New AC Unit"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline *</Label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work needed, any specific requirements, materials, access considerations, etc."
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The more detail you provide, the more accurate the estimates will be
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range (Optional)</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $500 - $1,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Providing a budget range helps contractors submit relevant bids
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Post Your Job</h4>
                  <p className="text-xs text-muted-foreground">
                    Your job will be visible to contractors in your area
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Receive Estimates</h4>
                  <p className="text-xs text-muted-foreground">
                    Get multiple bids within 24-48 hours
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Compare & Choose</h4>
                  <p className="text-xs text-muted-foreground">
                    Review profiles, ratings, and prices
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Get Work Done</h4>
                  <p className="text-xs text-muted-foreground">
                    Work begins once you accept a bid
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <House className="w-5 h-5 text-primary" weight="fill" />
                Writing Tips
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be specific about materials or brands</li>
                <li>• Mention any permits needed</li>
                <li>• Note access restrictions or parking</li>
                <li>• Include measurements when relevant</li>
                <li>• Describe current condition clearly</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="glass-card border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Ready to post?</h3>
              <p className="text-sm text-muted-foreground">
                Your job will be sent to qualified contractors in your area
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button size="lg" onClick={handleSubmit}>
                Post Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
