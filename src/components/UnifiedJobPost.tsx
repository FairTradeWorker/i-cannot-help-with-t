import { useState } from 'react';
import { ArrowLeft, Upload, X, Camera, 
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface UnifiedJobPostProps {
  const [title, setTitle] = useState(''
  onCancel: () => void;
    'HVAC',
 

    'Flooring',
    'Bathroom Remodel',
    'Other',

    'Urgent (within 1 week)',
    'Flexible (2-4 weeks)',
  ];
  const handleFileSelect = (files: FileList

    const filesArray = Array.from(files);

        const reader =
          if (
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
    if (!desc
          }
    }
        reader.readAsDataURL(file);
      r
    });
    

  const handleDragOver = (e: React.DragEvent) => {

    setIsDragging(true);
    

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  re

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
     
    if (!description.trim()) {
      toast.error('Please enter a job description');
      return;
    }
    if (!category) {
            <VideoCamera className="w-4 h-4" />
      return;
     
    if (!timeline) {
      toast.error('Please select a timeline');
      return;
     
    if (activeTab === 'photo' && photos.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

                  
      title,
                </
      category,
               
      budget,
              
      photos: activeTab === 'photo' ? photos : [],
                      
    });
    

          
               
                </CardHeader>
                  <div
                      isDragging
                        : '
     
                    onDrop={handleDrop}
                    <Upload className="w-12 h-12 mx-auto mb-4 t
                    <p className="text-sm t
                 
             
                      className="hidden"
                    />
              
            

                  </div>
                  {photos.length > 0 && (
                      <Label>Uploaded Photos ({photos.
                        {photos.map((photo, 
                            
                        
                            />
                              onClick={() 
                       
                        
                        ))}
                    </div>
                </CardContent>
            </TabsConten
            <TabsCo

                  <h3 className="text-xl font-bold mb-2">Video 
                    Record a quick video walkthroug
                  <Badge variant="seconda
              </Card>
          </div>
          <div className="space-y-6">
              <CardHeader>
              </CardHeader>
                <div className="flex gap-3"
                    1
                  <div>
                    <p classNa
                    </p>
                </div>
                <div className="flex gap-3">
                    
                  <div

                    </p>
                </div>
                <div className="flex gap-3">
                    3
                  <div>
                    <p className="text-xs text-muted-foreground">
                    </p>
                </div>
                <div className="flex gap-3">
                    4
                  <div>
                    <p className="text-
                    </p>
                </div>
            </Card>
            {activeTab =

                    <Camera className="w-5 h-
                  </h4>
                    <li>• Include wide shots showing the entire area</li>
                    <li>• Good lighting helps contr
                  </ul>
              </Card>
          </div>
      </Tabs>
      <Card className="glass-card border-2 border-primar
          <div className="flex 
              <h3 className="text-lg fo
                Your job wi
            </div>
              <Button variant
              </Button>
                Post J

        </CardContent>
    </motion.div>
}























































































































































































































