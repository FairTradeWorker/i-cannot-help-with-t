import { useState } from 'react';
import { ArrowLeft, Upload, X, Camera, VideoCamera } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader } from '@
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/text
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
}
export function UnifiedJobPost({ onJobCreated, onCancel }: UnifiedJobPostProps) 
  const [title, setTitle] = use
  const [category, setCategory] = useSt

  const [isDragging, setIsDragg
  const categories = [
    'HVAC',
}

export function UnifiedJobPost({ onJobCreated, onCancel }: UnifiedJobPostProps) {
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'text'>('photo');
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
    const files
    'Kitchen Remodel',
      if (file.type.sta
    'General Repairs',
          if
  ];

  const timelines = [
        };
    'Soon (1-2 weeks)',
    });
    'Planning (1+ months)',
  co

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

    <motion.div
      animate
      class
      <div
          <ArrowLeft className="w-5
       
       
    

          <TabsTrigger value="photo">
            Photos
          <TabsTrigger v
    

          </TabsTrigger>

          <div className=
    

                    Add photos of the area or 
                </CardH
                  <div
                      isDragging
    

                    onDrop={handleDrop}
                    <Upload className="w-12 h-12 mx-auto mb-
    

                      accept="
                      on
                      id="photo-upload"
             
     
                    </Button>
                  {photos.length > 0 && (
             
     
                    
                              alt={`Upload ${i
             
     
                    
                            >
             
     
                    </div>
                </CardContent>
            <
     

                  
            
                  
              <

             
                  <p className="text-sm text-muted
                  </p>
       


          
               
                  <Input
                    placeholder="e.g
                    onChange={(e) =
                </div>
     
                  <Textarea
                    placeholder="Describe what work you need do
                    onChange={(e) => setDes
                 

                  <div>
                    <Select value={category} onValueChange={setCategory}>
              
            

                          </SelectItem>
                      </SelectContent>
                  </div>
                  <div>
                  
                        
                      <SelectContent>
                          <SelectItem key={time} val
                 
                      </
                  </div>

                  <Label
                   

                    onChange={(e) => setBudget(e.target.
                </div>
            </Card>

            <Card className=
                <h3 className="text-lg font-bold">How it Works</h3>
              <CardContent className="space-y-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-ful
                  </di
                </CardHeader>
                      Describ
                  <div
                <div className="flex gap-3">
                      isDragging
                  <div>
                    <p className="text-xs text-muted-foreground">
                    </p
                </div>
                  <div className="flex-shrink-0 w
                    onDrop={handleDrop}
                   
                      Review profiles and select the best contractor
                  </div>
                <div className="flex gap-3">
                    4
                  <div>
                    <p className=
                    </p>
                </div>
            </Card>
                      className="hidden"
                <CardHeader>
                    />
                  </h4>
                <CardContent>
                    <li>• Include wi
                    <li>• Capt
                  </ul>
                  </div>
                  {photos.length > 0 && (

          <CardContent className="p-6">
              <div>
                <p className="text-sm text-muted-foregr
                </p>
              <div className="fl
                  Cancel
                <Button onClick={handleSubmit} size="lg">
                </Button>
                            />
        </Card>
    </motion.div>
}






                        ))}

                    </div>

                </CardContent>
              </Card>

































































































          </div>

          <div className="space-y-6">

              <CardHeader>

              </CardHeader>



                    1

                  <div>



                    </p>

                </div>
                <div className="flex gap-3">







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



                    </p>

                </div>

            </Card>







                  </h4>



                    <li>• Include wide shots showing the entire area</li>



                  </ul>

              </Card>

          </div>



















            </div>



    </motion.div>

}
