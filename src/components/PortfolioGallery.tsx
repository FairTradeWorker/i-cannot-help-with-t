// Contractor Portfolio Gallery - Showcase work with photos
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Images,
  Plus,
  X,
  Heart,
  Eye,
  Share,
  Upload,
  Trash,
  PencilSimple,
  Tag,
  MapPin,
  Star,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completedDate: Date;
  photos: {
    id: string;
    url: string;
    caption?: string;
    isBefore?: boolean;
    isAfter?: boolean;
  }[];
  tags: string[];
  views: number;
  likes: number;
  featured: boolean;
  budget?: number;
  duration?: string;
}

// Sample portfolio data with placeholder images
const sampleProjects: PortfolioProject[] = [
  {
    id: 'p1',
    title: 'Modern Kitchen Renovation',
    description: 'Complete kitchen transformation including new cabinets, quartz countertops, and stainless steel appliances. The open-concept design maximizes space and natural light.',
    category: 'Kitchen Remodel',
    location: 'Austin, TX',
    completedDate: new Date('2024-10-15'),
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', caption: 'After - New kitchen with island', isAfter: true },
      { id: 'ph2', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', caption: 'Before - Original kitchen', isBefore: true },
      { id: 'ph3', url: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?w=800', caption: 'Custom cabinetry details' },
    ],
    tags: ['Kitchen', 'Modern', 'Custom Cabinets', 'Quartz'],
    views: 1284,
    likes: 87,
    featured: true,
    budget: 45000,
    duration: '4 weeks',
  },
  {
    id: 'p2',
    title: 'Roof Replacement - Storm Damage',
    description: 'Emergency roof replacement after hail damage. Installed architectural shingles with enhanced warranty. Includes new gutters and proper ventilation.',
    category: 'Roofing',
    location: 'Phoenix, AZ',
    completedDate: new Date('2024-11-01'),
    photos: [
      { id: 'ph4', url: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800', caption: 'Completed roof installation', isAfter: true },
      { id: 'ph5', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Aerial view of finished work' },
    ],
    tags: ['Roofing', 'Storm Damage', 'Insurance Work'],
    views: 856,
    likes: 52,
    featured: false,
    budget: 15000,
    duration: '3 days',
  },
  {
    id: 'p3',
    title: 'Spa Bathroom Transformation',
    description: 'Luxury bathroom renovation featuring walk-in shower with rainfall head, freestanding tub, and heated floors. Custom vanity with double sinks.',
    category: 'Bathroom Remodel',
    location: 'Denver, CO',
    completedDate: new Date('2024-09-20'),
    photos: [
      { id: 'ph6', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', caption: 'Modern bathroom design', isAfter: true },
      { id: 'ph7', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', caption: 'Walk-in shower detail' },
    ],
    tags: ['Bathroom', 'Luxury', 'Modern', 'Heated Floors'],
    views: 1563,
    likes: 124,
    featured: true,
    budget: 32000,
    duration: '3 weeks',
  },
  {
    id: 'p4',
    title: 'Deck and Outdoor Living Space',
    description: 'Custom composite deck with built-in seating, pergola, and outdoor kitchen area. Perfect for entertaining.',
    category: 'Outdoor',
    location: 'Nashville, TN',
    completedDate: new Date('2024-08-10'),
    photos: [
      { id: 'ph8', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Completed outdoor space', isAfter: true },
    ],
    tags: ['Deck', 'Outdoor', 'Composite', 'Pergola'],
    views: 678,
    likes: 45,
    featured: false,
    budget: 28000,
    duration: '2 weeks',
  },
];

const categories = [
  'All Projects',
  'Kitchen Remodel',
  'Bathroom Remodel',
  'Roofing',
  'HVAC',
  'Electrical',
  'Plumbing',
  'Outdoor',
  'Flooring',
  'General',
];

interface PortfolioGalleryProps {
  contractorId?: string;
  editable?: boolean;
}

export function PortfolioGallery({ contractorId, editable = false }: PortfolioGalleryProps) {
  const [projects, setProjects] = useState<PortfolioProject[]>(sampleProjects);
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<{ project: PortfolioProject; photoIndex: number } | null>(null);
  const [showAddProject, setShowAddProject] = useState(false);
  
  // New project form
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    tags: '',
    budget: '',
    duration: '',
  });

  const filteredProjects = selectedCategory === 'All Projects'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const featuredProjects = projects.filter(p => p.featured);

  const handleLike = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, likes: p.likes + 1 } : p
    ));
    toast.success('Added to favorites!');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatBudget = (budget?: number) => {
    if (!budget) return 'Contact for pricing';
    if (budget >= 1000000) return `$${(budget / 1000000).toFixed(1)}M`;
    if (budget >= 1000) return `$${(budget / 1000).toFixed(0)}K`;
    return `$${budget}`;
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!lightboxPhoto) return;
    const { project, photoIndex } = lightboxPhoto;
    let newIndex = direction === 'next' ? photoIndex + 1 : photoIndex - 1;
    if (newIndex < 0) newIndex = project.photos.length - 1;
    if (newIndex >= project.photos.length) newIndex = 0;
    setLightboxPhoto({ project, photoIndex: newIndex });
  };

  const handleAddProject = () => {
    if (!newProject.title || !newProject.category) {
      toast.error('Please fill in required fields');
      return;
    }

    const project: PortfolioProject = {
      id: `p-${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      category: newProject.category,
      location: newProject.location || 'Location not specified',
      completedDate: new Date(),
      photos: [],
      tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
      views: 0,
      likes: 0,
      featured: false,
      budget: newProject.budget ? parseInt(newProject.budget) : undefined,
      duration: newProject.duration || undefined,
    };

    setProjects([project, ...projects]);
    setShowAddProject(false);
    setNewProject({
      title: '',
      description: '',
      category: '',
      location: '',
      tags: '',
      budget: '',
      duration: '',
    });
    toast.success('Project added! You can now add photos.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary">
              <Images className="w-8 h-8 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Portfolio Gallery</h1>
              <p className="text-muted-foreground">{projects.length} completed projects</p>
            </div>
          </div>
          {editable && (
            <Button onClick={() => setShowAddProject(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" weight="fill" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.slice(0, 2).map(project => (
              <Card 
                key={project.id}
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-video relative bg-muted">
                  {project.photos[0] && (
                    <img
                      src={project.photos[0].url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <Badge className="absolute top-3 left-3 bg-amber-500">
                    <Star className="w-3 h-3 mr-1" weight="fill" />
                    Featured
                  </Badge>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <h3 className="text-lg font-bold text-white">{project.title}</h3>
                    <div className="flex items-center gap-3 text-white/80 text-sm mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                      </span>
                      <span>{formatDate(project.completedDate)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {categories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </motion.div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all group"
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                {project.photos[0] ? (
                  <img
                    src={project.photos[0].url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                    <Camera className="w-3 h-3 mr-1" />
                    {project.photos.length}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {project.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {project.likes}
                    </span>
                  </div>
                  <Badge variant="outline">{project.category}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <div className="min-h-screen py-8 px-4">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="max-w-4xl mx-auto bg-background rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                    <div className="flex items-center gap-3 text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedProject.location}
                      </span>
                      <span>{formatDate(selectedProject.completedDate)}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                {/* Photo Gallery */}
                <div className="grid grid-cols-3 gap-2 p-2">
                  {selectedProject.photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className={`relative cursor-pointer ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                      onClick={() => setLightboxPhoto({ project: selectedProject, photoIndex: index })}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption || selectedProject.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {(photo.isBefore || photo.isAfter) && (
                        <Badge 
                          className={`absolute top-2 left-2 ${photo.isBefore ? 'bg-orange-500' : 'bg-green-500'}`}
                        >
                          {photo.isBefore ? 'Before' : 'After'}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  <p className="text-muted-foreground">{selectedProject.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{formatBudget(selectedProject.budget)}</p>
                      <p className="text-sm text-muted-foreground">Project Budget</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{selectedProject.duration || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{selectedProject.views}</p>
                      <p className="text-sm text-muted-foreground">Views</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{selectedProject.likes}</p>
                      <p className="text-sm text-muted-foreground">Likes</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => handleLike(selectedProject.id)}>
                      <Heart className="w-4 h-4 mr-2" />
                      Like Project
                    </Button>
                    <Button variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60] flex items-center justify-center"
            onClick={() => setLightboxPhoto(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setLightboxPhoto(null)}
            >
              <X className="w-8 h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
            >
              <CaretLeft className="w-8 h-8" />
            </Button>

            <img
              src={lightboxPhoto.project.photos[lightboxPhoto.photoIndex].url}
              alt=""
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
            >
              <CaretRight className="w-8 h-8" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-center">
              {lightboxPhoto.project.photos[lightboxPhoto.photoIndex].caption && (
                <p className="mb-2">{lightboxPhoto.project.photos[lightboxPhoto.photoIndex].caption}</p>
              )}
              <p className="text-sm opacity-70">
                {lightboxPhoto.photoIndex + 1} / {lightboxPhoto.project.photos.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Project Modal */}
      <AnimatePresence>
        {showAddProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddProject(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold">Add New Project</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAddProject(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <Label>Project Title *</Label>
                  <Input
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g., Modern Kitchen Renovation"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Category *</Label>
                  <Select value={newProject.category} onValueChange={(v) => setNewProject({ ...newProject, category: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    placeholder="e.g., Austin, TX"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe the project..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Budget ($)</Label>
                    <Input
                      type="number"
                      value={newProject.budget}
                      onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                      placeholder="e.g., 25000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      value={newProject.duration}
                      onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
                      placeholder="e.g., 2 weeks"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    placeholder="e.g., Modern, Custom, High-End"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="p-6 border-t">
                <Button className="w-full" onClick={handleAddProject}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
