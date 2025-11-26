import { useState } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, X, ArrowLeft, Camera, Plus } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

  onJobCreated: (jobData: { title: string; des
}
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PhotoJobPostProps {
  onJobCreated: (jobData: { title: string; description: string; photos: string[] }) => void;
  onCancel: () => void;
}

        reader.onload = (e) => {
            newPhotos.push(e.target.resul
              setPhotos((prev) => [...prev, ...newPho
            }
        };
      }

  const handleDragOver = (e: React.DragEvent) => {
    setIsDragging(true)

    setIsDragging(false);


    handleFileSelect(e.dataTransf

    setPhotos((prev) => prev.filter((_, 
        reader.onload = (e) => {
  const handleSubmit = () => {
      toast.error('Please enter a job title');
    }
      toast.error('Please enter a job description');
    }
            }
    }
        };

      }
      a
    

  const handleDragOver = (e: React.DragEvent) => {
          <h2 className
        </div>


            <CardTitle className=
    setIsDragging(false);
  };

              <Label htmlFor="title">Job Title
                id="tit
                value={ti
              />


                id="address"
                value={address}
              />


  const handleSubmit = () => {
                rows={6}
      toast.error('Please enter a job title');
            <
    }
        <Card className="glass
      toast.error('Please enter a job description');
             
    }
          <CardContent classNa
              className={`border-2 border-dashed round
             
    }

            >
    

          
               
                id="photo-upload"
              <Button
                onClick={()
     
              </Button>

              <div className="space-y-2">
        </Button>
             
                        src={photo}
                        className="w-full h-32 object-cover rounded-lg border-2 border-border"
        </div>
            

                    </div>
                </div>
            )}
        </Card>

        <CardContent classNam
            <div>
              <p className="text-sm text-muted-foreground">
              </p>
            <div className="flex gap-3">
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

              </Button>
              <Button size="lg" onClick={handleSubmit}>
                Post Job
              </Button>
            </div>

        </CardContent>


      <Card className="glass-card bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <Badge variant="secondary" className="mb-2">Tip 1</Badge>
              <p className="text-sm text-muted-foreground">Include wide shots showing the entire area</p>

            <div>
              <Badge variant="secondary" className="mb-2">Tip 2</Badge>
              <p className="text-sm text-muted-foreground">Take close-ups of problem areas or damage</p>











