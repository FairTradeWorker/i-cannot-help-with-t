import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Camera, VideoCamera, FileText, MapPin, CalendarBlank, Plus } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface UnifiedJobPostProps {
  onJobCreated: (jobData: any) => void;
  onCancel: () => void;
  defaultTab?: 'text' | 'photo' | 'video';
}

export function UnifiedJobPost({ onJobCreated, onCancel, defaultTab = 'text' }: UnifiedJobPostProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newPhotos: string[] = [];
    const filesArray = Array.from(files);

    filesArray.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPhotos.push(e.target.result as string);
            if (newPhotos.length === filesArray.length) {
              setPhotos((prev) => [...prev, ...newPhotos]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (activeTab === 'photo' && photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    onJobCreated({
      title,
      description,
      category,
      timeline,
      budget,
      address,
      photos: activeTab === 'photo' ? photos : [],
      type: activeTab,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Post a Job</h2>
          <p className="text-muted-foreground">Choose your preferred method and provide job details</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="text" className="gap-2">
            <FileText className="w-4 h-4" />
            Text Description
          </TabsTrigger>
          <TabsTrigger value="photo" className="gap-2">
            <Camera className="w-4 h-4" />
            With Photos
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <VideoCamera className="w-4 h-4" />
            Video (Coming Soon)
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>Provide details about the work you need done</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Kitchen Renovation, Roof Repair, Install New AC Unit"
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
                  <Label htmlFor="address">Property Address *</Label>
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

            <TabsContent value="photo" className="mt-0">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-6 h-6 text-primary" weight="fill" />
                    Upload Photos
                  </CardTitle>
                  <CardDescription>Add images showing the work area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      isDragging
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary hover:bg-muted/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" weight="duotone" />
                    <h4 className="font-semibold mb-2">Drop photos here</h4>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Select Photos
                    </Button>
                  </div>

                  {photos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Photos ({photos.length})</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border-2 border-border"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              <Card className="glass-card border-2 border-primary/20">
                <CardContent className="pt-6 text-center py-12">
                  <VideoCamera className="w-16 h-16 mx-auto mb-4 text-primary" weight="duotone" />
                  <h3 className="text-xl font-bold mb-2">Video Job Posts Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    Record a quick video walkthrough of your project for the most accurate estimates
                  </p>
                  <Badge variant="secondary">Under Development</Badge>
                </CardContent>
              </Card>
            </TabsContent>
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

            {activeTab === 'photo' && (
              <Card className="glass-card bg-muted/30">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" weight="fill" />
                    Photo Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Include wide shots showing the entire area</li>
                    <li>• Take close-ups of problem areas or damage</li>
                    <li>• Good lighting helps contractors assess accurately</li>
                    <li>• Multiple angles provide better context</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Tabs>

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
