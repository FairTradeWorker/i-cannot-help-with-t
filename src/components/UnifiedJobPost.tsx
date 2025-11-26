import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, X, Camera } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface UnifiedJobPostProps {
  onJobCreated: (jobData: any) => void;
  onCancel: () => void;
}

export function UnifiedJobPost({ onJobCreated, onCancel }: UnifiedJobPostProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
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
    'Bathroom Remodel',
    'Kitchen Remodel',
    'General Repairs',
  ];

  const timelines = [
    'Urgent (within days)',
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
              setPhotos([...photos, ...newPhotos]);
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

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !category || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const jobData = {
      id: 'job-' + Date.now(),
      title,
      description,
      category,
      timeline,
      budget,
      photos,
      createdAt: new Date(),
    };

    onJobCreated(jobData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto"
    >
      <div className="mb-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Post a New Job</h2>
          <p className="text-sm text-muted-foreground">Get estimates from qualified contractors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Job Details</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Replace roof shingles"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what work you need done..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
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

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger id="timeline">
                    <SelectValue placeholder="When do you need this done?" />
                  </SelectTrigger>
                  <SelectContent>
                    {timelines.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Estimated Budget (Optional)</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $5,000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Add Photos
              </h3>
              <p className="text-sm text-muted-foreground">
                Add photos of the area or issue that needs work
              </p>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag and drop photos here, or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="photo-upload"
                />
                <Button variant="outline" asChild>
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={photo}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">How it Works</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-sm">Describe your job</p>
                  <p className="text-xs text-muted-foreground">
                    Tell us what needs to be done
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-sm">Get estimates</p>
                  <p className="text-xs text-muted-foreground">
                    Contractors submit their bids
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-sm">Choose & hire</p>
                  <p className="text-xs text-muted-foreground">
                    Review profiles and select the best contractor
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-sm">Get it done</p>
                  <p className="text-xs text-muted-foreground">
                    Work gets completed, you pay when satisfied
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h4 className="font-semibold">Photo Tips</h4>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Include wide shots showing the entire area</li>
                <li>• Capture close-ups of specific issues</li>
                <li>• Take photos in good lighting</li>
                <li>• Add multiple angles if possible</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Ready to post your job?</p>
              <p className="text-sm text-muted-foreground">
                One-time platform fee of $20 upon posting
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} size="lg">
                Post Job
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
