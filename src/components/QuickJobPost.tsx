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
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Post a Job</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {postOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onHoverStart={() => setHoveredCard(option.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card 
                className={`relative overflow-hidden cursor-pointer transition-all duration-200 ${
                  hoveredCard === option.id ? 'shadow-lg shadow-primary/20 border-primary/40' : 'shadow-sm'
                }`}
                onClick={() => onCreateJob(option.id as 'video' | 'photo' | 'text')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-5`} />
                
                <CardContent className="relative p-4 text-center space-y-2">
                  <motion.div 
                    className={`mx-auto w-12 h-12 rounded-lg bg-gradient-to-br ${option.gradient} flex items-center justify-center`}
                    animate={{ 
                      rotate: hoveredCard === option.id ? [0, -5, 5, 0] : 0 
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="w-6 h-6 text-white" weight="bold" />
                  </motion.div>
                  
                  <div>
                    <p className="text-sm font-semibold">{option.title.replace(' Job Post', '')}</p>
                  </div>
                </CardContent>

                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${option.gradient}`}
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
