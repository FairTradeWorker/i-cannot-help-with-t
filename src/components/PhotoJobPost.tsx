import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, X, ArrowLeft, Camera, Plus } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PhotoJobPostProps {
  onJobCreated: (jobData: { title: string; description: string; photos: string[] }) => void;
  onCancel: () => void;
}

export function PhotoJobPost({ onJobCreated, onCancel }: PhotoJobPostProps) {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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
    if (photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    onJobCreated({
      title,
      description,
      photos,
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
          <h2 className="text-2xl font-bold">Post a Job with Photos</h2>
          <p className="text-muted-foreground">Upload images to help contractors understand your project</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Tell contractors about the work you need done</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g., Kitchen Renovation, Roof Repair"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what work needs to be done..."
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

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
                <div className="grid grid-cols-2 gap-2">
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
      </div>

      <Card className="glass-card border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">Ready to post?</h3>
              <p className="text-sm text-muted-foreground">
                Contractors in your area will receive your job and send estimates within 24 hours
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

      <Card className="glass-card bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Badge variant="secondary" className="mb-2">Tip 1</Badge>
              <p className="text-sm text-muted-foreground">Include wide shots showing the entire area</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Tip 2</Badge>
              <p className="text-sm text-muted-foreground">Take close-ups of problem areas or damage</p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Tip 3</Badge>
              <p className="text-sm text-muted-foreground">Good lighting helps contractors assess accurately</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
