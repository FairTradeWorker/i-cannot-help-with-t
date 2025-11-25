import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, VideoCamera, Image as ImageIcon, FileText, MapPin } from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuickJobPostProps {
  onCreateJob: (type: 'video' | 'photo' | 'text') => void;
}

export function QuickJobPost({ onCreateJob }: QuickJobPostProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const postOptions = [
    {
      id: 'video',
      title: 'Video Job Post',
      description: '60-second video analysis',
      icon: VideoCamera,
      gradient: 'from-primary to-secondary',
      badge: 'Recommended',
    },
    {
      id: 'photo',
      title: 'Photo Job Post',
      description: 'Upload photos of the work',
      icon: ImageIcon,
      gradient: 'from-secondary to-accent',
      badge: 'Quick',
    },
    {
      id: 'text',
      title: 'Text Job Post',
      description: 'Describe the job yourself',
      icon: FileText,
      gradient: 'from-accent to-primary',
      badge: 'Traditional',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Job Post</h2>
          <p className="text-lg text-muted-foreground">Choose how you want to describe your home service need</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          <MapPin className="w-4 h-4 mr-2" weight="fill" />
          Based on your location
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {postOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(option.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card 
                className={`relative overflow-hidden cursor-pointer transition-all duration-200 h-full ${
                  hoveredCard === option.id ? 'shadow-xl shadow-primary/20 scale-105' : 'shadow-md'
                }`}
                onClick={() => onCreateJob(option.id as 'video' | 'photo' | 'text')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5`} />
                
                <CardContent className="relative p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${option.gradient}`}>
                      <Icon className="w-8 h-8 text-white" weight="bold" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {option.badge}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{option.title}</h3>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </CardContent>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${option.gradient}"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredCard === option.id ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
