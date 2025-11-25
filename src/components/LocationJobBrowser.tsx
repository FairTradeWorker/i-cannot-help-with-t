import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, MagnifyingGlass, Funnel, SlidersHorizontal, Briefcase, CurrencyDollar, Clock, Star } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const JOB_CATEGORIES = [
  'Roofing',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Landscaping',
  'Painting',
  'Flooring',
  'Carpentry',
  'Drywall',
  'Concrete',
  'Masonry',
  'Framing',
  'Insulation',
  'Siding',
  'Windows & Doors',
  'Decking',
  'Fencing',
  'Gutters',
  'Tile Work',
  'Kitchen Remodel',
  'Bathroom Remodel',
  'General Handyman',
];

interface LocationJobBrowserProps {
  userId?: string;
}

export function LocationJobBrowser({ userId }: LocationJobBrowserProps) {
  const [searchRadius, setSearchRadius] = useState([25]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const mockJobs = [
    {
      id: 'job-1',
      title: 'Roof Replacement - Residential',
      category: 'Roofing',
      location: 'Austin, TX',
      distance: 3.2,
      budget: 8500,
      timeframe: '1-2 weeks',
      urgency: 'high',
      rating: 4.8,
      verified: true,
    },
    {
      id: 'job-2',
      title: 'HVAC Installation',
      category: 'HVAC',
      location: 'Round Rock, TX',
      distance: 12.5,
      budget: 6200,
      timeframe: '3-5 days',
      urgency: 'medium',
      rating: 4.5,
      verified: true,
    },
    {
      id: 'job-3',
      title: 'Kitchen Remodel',
      category: 'Kitchen Remodel',
      location: 'Cedar Park, TX',
      distance: 18.3,
      budget: 15000,
      timeframe: '2-3 weeks',
      urgency: 'low',
      rating: 4.9,
      verified: false,
    },
    {
      id: 'job-4',
      title: 'Bathroom Tile Installation',
      category: 'Tile Work',
      location: 'Georgetown, TX',
      distance: 22.1,
      budget: 3500,
      timeframe: '1 week',
      urgency: 'medium',
      rating: 4.7,
      verified: true,
    },
  ];

  const filteredJobs = mockJobs.filter(job => 
    job.distance <= searchRadius[0] &&
    (selectedCategory === 'all' || job.category === selectedCategory)
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'medium': return 'bg-warning/10 text-warning border-warning/30';
      case 'low': return 'bg-accent/10 text-accent border-accent/30';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Location-Based Jobs</h2>
          <p className="text-muted-foreground mt-1">Find work near you</p>
        </div>
        <Badge variant="secondary" className="text-sm px-4 py-2">
          <MapPin className="w-4 h-4 mr-2" weight="fill" />
          {filteredJobs.length} jobs within {searchRadius[0]} miles
        </Badge>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <Label className="text-sm font-medium mb-2 block">Location / ZIP Code</Label>
              <div className="relative">
                <Input 
                  placeholder="Enter ZIP or city..."
                  className="pl-10"
                />
                <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="md:col-span-4">
              <Label className="text-sm font-medium mb-2 block">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Categories</SelectItem>
                  {JOB_CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 flex items-end gap-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-primary text-primary-foreground' : ''}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Button>
              <Button className="flex-1">
                <MagnifyingGlass className="w-4 h-4 mr-2" weight="bold" />
                Search
              </Button>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t border-border/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Search Radius: {searchRadius[0]} miles</Label>
                </div>
                <Slider 
                  value={searchRadius}
                  onValueChange={setSearchRadius}
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Closest First</SelectItem>
                      <SelectItem value="budget">Highest Budget</SelectItem>
                      <SelectItem value="urgency">Most Urgent</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Availability</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="immediate">Immediate Start</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredJobs.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.3 }}
          >
            <Card className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        {job.verified && (
                          <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent">
                            Verified
                          </Badge>
                        )}
                        <Badge className={getUrgencyColor(job.urgency)}>
                          {job.urgency} priority
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" weight="fill" />
                          <span>{job.location}</span>
                          <span className="text-xs">({job.distance} mi)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.timeframe}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-2xl font-bold font-mono text-accent">
                        ${job.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 text-accent" weight="fill" />
                        <span className="font-semibold">{job.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                    <Button className="flex-1" size="lg">
                      View Details
                    </Button>
                    <Button variant="outline" size="lg">
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              Try expanding your search radius or changing your filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
