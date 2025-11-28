import { useState } from 'react';
import { ArrowLeft, Upload, X, Camera, VideoCamera, Wrench } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ServiceCategoryMegaMenu } from '@/components/ServiceCategoryMegaMenu';
import { GlassSurface } from '@/components/GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import type { ServiceSelection } from '@/types/service-categories';
import { getServiceInfo } from '@/types/service-categories';

interface UnifiedJobPostProps {
  onJobCreated: (jobData: any) => void;
  onCancel: () => void;
  serviceSelection?: ServiceSelection;
}

interface ServiceSpecificFields {
  [key: string]: string | number | boolean;
}

export function UnifiedJobPost({ onJobCreated, onCancel, serviceSelection: initialSelection }: UnifiedJobPostProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'text'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection | null>(initialSelection || null);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [timeline, setTimeline] = useState('');
  const [budget, setBudget] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [serviceFields, setServiceFields] = useState<ServiceSpecificFields>({});

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

  // Auto-fill title when service is selected
  const handleServiceSelect = (selection: ServiceSelection) => {
    setServiceSelection(selection);
    if (!title.trim()) {
      setTitle(`${selection.service} - ${selection.subcategory}`);
    }
    setShowServiceMenu(false);
  };

  // Get dynamic form fields based on service
  const getServiceSpecificFields = () => {
    if (!serviceSelection) return null;

    const serviceInfo = getServiceInfo(serviceSelection.service);
    if (!serviceInfo) return null;

    const service = serviceSelection.service.toLowerCase();
    const categoryId = serviceSelection.categoryId;

    // Roofing fields
    if (service.includes('roofing') || categoryId === 'construction-heavy') {
      if (service.includes('roof')) {
        return (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roof-type">Roof Type</Label>
              <Select
                value={serviceFields.roofType as string || ''}
                onValueChange={(v) => setServiceFields({ ...serviceFields, roofType: v })}
              >
                <SelectTrigger id="roof-type">
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asphalt">Asphalt Shingles</SelectItem>
                  <SelectItem value="metal">Metal</SelectItem>
                  <SelectItem value="tile">Tile</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                  <SelectItem value="flat">Flat Roof</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="square-footage">Square Footage</Label>
              <Input
                id="square-footage"
                type="number"
                placeholder="e.g., 2000"
                value={String(serviceFields.squareFootage || '')}
                onChange={(e) => setServiceFields({ ...serviceFields, squareFootage: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="stories">Number of Stories</Label>
              <Select
                value={serviceFields.stories as string || ''}
                onValueChange={(v) => setServiceFields({ ...serviceFields, stories: v })}
              >
                <SelectTrigger id="stories">
                  <SelectValue placeholder="Select stories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Story</SelectItem>
                  <SelectItem value="2">2 Stories</SelectItem>
                  <SelectItem value="3+">3+ Stories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="current-material">Current Material</Label>
              <Input
                id="current-material"
                placeholder="e.g., Asphalt shingles"
                value={serviceFields.currentMaterial as string || ''}
                onChange={(e) => setServiceFields({ ...serviceFields, currentMaterial: e.target.value })}
              />
            </div>
          </div>
        );
      }
    }

    // Plumbing fields
    if (categoryId === 'kitchen-bath-plumbing' || service.includes('plumb')) {
      return (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="issue-type">Issue Type</Label>
            <Select
              value={serviceFields.issueType as string || ''}
              onValueChange={(v) => setServiceFields({ ...serviceFields, issueType: v })}
            >
              <SelectTrigger id="issue-type">
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leak">Leak</SelectItem>
                <SelectItem value="clog">Clog/Drain</SelectItem>
                <SelectItem value="installation">Installation</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="replacement">Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="water-shutoff">Water Shutoff Status</Label>
            <Select
              value={serviceFields.waterShutoff as string || ''}
              onValueChange={(v) => setServiceFields({ ...serviceFields, waterShutoff: v })}
            >
              <SelectTrigger id="water-shutoff">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accessible">Easily Accessible</SelectItem>
                <SelectItem value="difficult">Difficult to Access</SelectItem>
                <SelectItem value="unknown">Unknown Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="urgency-level">Urgency Level</Label>
            <Select
              value={serviceFields.urgencyLevel as string || ''}
              onValueChange={(v) => setServiceFields({ ...serviceFields, urgencyLevel: v })}
            >
              <SelectTrigger id="urgency-level">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emergency">Emergency (Active Leak)</SelectItem>
                <SelectItem value="urgent">Urgent (Within 24hrs)</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // Electrical fields
    if (categoryId === 'electrical-hvac-tech' || service.includes('electr')) {
      return (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="panel-type">Panel Type</Label>
            <Select
              value={serviceFields.panelType as string || ''}
              onValueChange={(v) => setServiceFields({ ...serviceFields, panelType: v })}
            >
              <SelectTrigger id="panel-type">
                <SelectValue placeholder="Select panel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breaker">Circuit Breaker</SelectItem>
                <SelectItem value="fuse">Fuse Box</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="circuit-count">Circuit Count</Label>
            <Input
              id="circuit-count"
              type="number"
              placeholder="e.g., 20"
                value={String(serviceFields.circuitCount || '')}
              onChange={(e) => setServiceFields({ ...serviceFields, circuitCount: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div>
            <Label htmlFor="last-inspection">Last Inspection Date</Label>
            <Input
              id="last-inspection"
              type="date"
              value={serviceFields.lastInspection as string || ''}
              onChange={(e) => setServiceFields({ ...serviceFields, lastInspection: e.target.value })}
            />
          </div>
        </div>
      );
    }

    return null;
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
    if (!serviceSelection) {
      toast.error('Please select a service');
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
      serviceSelection,
      serviceFields,
      timeline,
      budget,
      photos: activeTab === 'photo' ? photos : [],
      createdAt: new Date(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">Get estimates from qualified contractors</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photo">
            <Camera className="w-4 h-4 mr-2" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="video">
            <VideoCamera className="w-4 h-4 mr-2" />
            Video
          </TabsTrigger>
          <TabsTrigger value="text">
            Text Only
          </TabsTrigger>
        </TabsList>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <TabsContent value="photo" className="mt-0">
              <GlassSurface
                id="upload-photos-card"
                context={{
                  ...getDefaultGlassContext(),
                  serviceCategory: serviceSelection?.categoryId || 'general'
                }}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <h3 className="text-xl font-bold">Upload Photos</h3>
                    <p className="text-sm text-muted-foreground">
                      Add photos of the area or issue that needs work
                    </p>
                  </CardHeader>
                <CardContent>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
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
                      accept="image/*"
                      multiple
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
                    <div className="mt-4">
                      <Label>Uploaded Photos ({photos.length})</Label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={photo}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              </GlassSurface>
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              <GlassSurface
                id="video-card"
                context={{
                  ...getDefaultGlassContext(),
                  serviceCategory: serviceSelection?.categoryId || 'general'
                }}
              >
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-8 text-center">
                    <VideoCamera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-bold mb-2">Video Walkthrough</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Record a quick video walkthrough of your project
                    </p>
                    <Badge variant="secondary">Coming Soon</Badge>
                  </CardContent>
                </Card>
              </GlassSurface>
            </TabsContent>

            <TabsContent value="text" className="mt-0">
              <GlassSurface
                id="text-card"
                context={{
                  ...getDefaultGlassContext(),
                  serviceCategory: serviceSelection?.categoryId || 'general'
                }}
              >
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-8">
                    <p className="text-sm text-muted-foreground">
                      Describe your project in detail below
                    </p>
                  </CardContent>
                </Card>
              </GlassSurface>
            </TabsContent>

            <GlassSurface
              id="job-details-card"
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: serviceSelection?.categoryId || 'general',
                urgency: serviceSelection ? 'medium' : 'low'
              }}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <h3 className="text-xl font-bold">Job Details</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Roof Repair Needed"
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
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="service">Service Type *</Label>
                  <div className="space-y-2">
                    {serviceSelection ? (
                      <div className="flex items-center gap-2 p-3 border rounded-lg bg-card/50">
                        <Wrench className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-semibold">{serviceSelection.service}</div>
                          <div className="text-sm text-muted-foreground">
                            {serviceSelection.subcategory} • {serviceSelection.category}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowServiceMenu(true)}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowServiceMenu(true)}
                      >
                        <Wrench className="w-4 h-4 mr-2" />
                        Select Service
                      </Button>
                    )}
                  </div>
                </div>

                {serviceSelection && getServiceSpecificFields() && (
                  <div className="pt-2 border-t">
                    <Label className="text-sm font-semibold mb-3 block">Service-Specific Details</Label>
                    {getServiceSpecificFields()}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Timeline *</Label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger id="timeline">
                        <SelectValue placeholder="Select timeline" />
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
                    <Label htmlFor="budget">Budget (Optional)</Label>
                    <Input
                      id="budget"
                      type="text"
                      placeholder="e.g., $5,000 - $8,000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            </GlassSurface>
          </div>

          <div className="space-y-6">
            <GlassSurface
              id="how-it-works-card"
              context={getDefaultGlassContext()}
            >
              <Card className="border-0 bg-transparent">
                <CardHeader>
                  <h3 className="text-lg font-bold">How it Works</h3>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Post Your Job</p>
                    <p className="text-xs text-muted-foreground">
                      Describe your project with photos or video
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Get Estimates</p>
                    <p className="text-xs text-muted-foreground">
                      Receive competitive bids from contractors
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Compare & Choose</p>
                    <p className="text-xs text-muted-foreground">
                      Review profiles and select the best contractor
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Complete Project</p>
                    <p className="text-xs text-muted-foreground">
                      Work begins and payment is released upon completion
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            </GlassSurface>

            {activeTab === 'photo' && (
              <GlassSurface
                id="photo-tips-card"
                context={getDefaultGlassContext()}
              >
                <Card className="border-0 bg-transparent">
                  <CardHeader>
                    <h4 className="font-bold flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Photo Tips
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li>• Include wide shots showing the entire area</li>
                      <li>• Good lighting helps contractors assess the work</li>
                      <li>• Capture multiple angles of the problem</li>
                      <li>• Include close-ups of specific issues</li>
                    </ul>
                  </CardContent>
                </Card>
              </GlassSurface>
            )}
          </div>
        </div>

        <GlassSurface
          id="ready-to-post-card"
          context={{
            ...getDefaultGlassContext(),
            urgency: serviceSelection ? 'medium' : 'low',
            confidence: serviceSelection ? 0.9 : 0.7
          }}
          className="mt-6"
        >
          <Card className="border-2 border-primary/20 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-1">Ready to Post?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your job will be visible to contractors in your area
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
        </GlassSurface>
      </Tabs>

      <ServiceCategoryMegaMenu
        open={showServiceMenu}
        onClose={() => setShowServiceMenu(false)}
        onSelect={handleServiceSelect}
        title="Select a Service"
      />
    </motion.div>
  );
}
