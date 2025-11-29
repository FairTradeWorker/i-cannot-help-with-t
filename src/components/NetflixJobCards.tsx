import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  MapPin, 
  Clock, 
  CurrencyDollar, 
  Warning,
  CaretLeft,
  CaretRight,
  Funnel,
  X
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ServiceCategoryMegaMenu } from './ServiceCategoryMegaMenu';
import { dataStore } from '@/lib/store';
import type { Job } from '@/lib/types';
import type { ServiceSelection } from '@/types/service-categories';
import { Skeleton } from '@/components/ui/skeleton';

interface NetflixJobCardsProps {
  onJobSelect?: (job: Job) => void;
  user?: any;
}

export function NetflixJobCards({ onJobSelect, user }: NetflixJobCardsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceSelection | null>(null);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const allJobs = await dataStore.getJobs();
      const availableJobs = allJobs.filter(j => 
        j.status === 'posted' || j.status === 'bidding'
      );
      setJobs(availableJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    // State filter
    if (selectedState !== 'all' && job.address.state !== selectedState) {
      return false;
    }

    // Urgency filter
    if (selectedUrgency !== 'all' && job.urgency !== selectedUrgency) {
      return false;
    }

    // Service filter
    if (selectedService) {
      const jobService = (job as any).serviceSelection;
      if (!jobService || jobService.service !== selectedService.service) {
        return false;
      }
    }

    return true;
  });

  // Group by urgency
  const urgentJobs = filteredJobs.filter(j => j.urgency === 'emergency' || j.urgency === 'urgent');
  const normalJobs = filteredJobs.filter(j => j.urgency === 'normal');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-600';
      case 'urgent':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-64 w-80 flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {Array.from(new Set(jobs.map(j => j.address.state))).map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Urgency</Label>
            <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Service</Label>
            {selectedService ? (
              <div className="p-2 border rounded-lg bg-card/50 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{selectedService.service}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowServiceMenu(true)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowServiceMenu(true)}
              >
                <Funnel className="w-4 h-4 mr-2" />
                Filter by Service
              </Button>
            )}
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedState('all');
                setSelectedUrgency('all');
                setSelectedService(null);
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Urgent Jobs Row */}
      {urgentJobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Warning className="w-6 h-6 text-red-600" weight="fill" />
            <h2 className="text-2xl font-bold">Urgent Jobs</h2>
            <Badge variant="destructive">{urgentJobs.length}</Badge>
          </div>
          <JobRow jobs={urgentJobs} onJobSelect={onJobSelect} getUrgencyColor={getUrgencyColor} />
        </div>
      )}

      {/* Normal Jobs Row */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Available Jobs</h2>
          <Badge variant="secondary">{normalJobs.length}</Badge>
        </div>
        <JobRow jobs={normalJobs} onJobSelect={onJobSelect} getUrgencyColor={getUrgencyColor} />
      </div>

      <ServiceCategoryMegaMenu
        open={showServiceMenu}
        onClose={() => setShowServiceMenu(false)}
        onSelect={(selection) => {
          setSelectedService(selection);
          setShowServiceMenu(false);
        }}
        title="Filter Jobs by Service"
      />
    </div>
  );
}

function JobRow({ 
  jobs, 
  onJobSelect, 
  getUrgencyColor 
}: { 
  jobs: Job[]; 
  onJobSelect?: (job: Job) => void;
  getUrgencyColor: (urgency: string) => string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener('scroll', checkScroll);
      return () => ref.removeEventListener('scroll', checkScroll);
    }
  }, [jobs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (jobs.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground">No jobs found</p>
      </Card>
    );
  }

  return (
    <div className="relative group">
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
          onClick={() => scroll('left')}
        >
          <CaretLeft className="w-6 h-6" />
        </Button>
      )}
      
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onJobSelect?.(job)}
            getUrgencyColor={getUrgencyColor}
          />
        ))}
      </div>

      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm shadow-lg"
          onClick={() => scroll('right')}
        >
          <CaretRight className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}

function JobCard({ 
  job, 
  onClick, 
  getUrgencyColor 
}: { 
  job: Job; 
  onClick: () => void;
  getUrgencyColor: (urgency: string) => string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-80 cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Card className="overflow-hidden border-2 hover:border-primary transition-all">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {job.videoUrl ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full ${getUrgencyColor(job.urgency)} flex items-center justify-center transition-transform ${isHovered ? 'scale-110' : ''}`}>
                  <Play className="w-8 h-8 text-white" weight="fill" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 right-2">
                <Badge className={getUrgencyColor(job.urgency)}>
                  {job.urgency.toUpperCase()}
                </Badge>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full ${getUrgencyColor(job.urgency)} flex items-center justify-center mx-auto mb-2`}>
                  <Play className="w-8 h-8 text-white" weight="fill" />
                </div>
                <Badge className={getUrgencyColor(job.urgency)}>
                  {job.urgency.toUpperCase()}
                </Badge>
              </div>
            </div>
          )}
          
          {/* Hover Overlay */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Bid on Job
              </Button>
            </motion.div>
          )}
        </div>

        {/* Job Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg line-clamp-1">{job.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.address.city}, {job.address.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.laborHours}h</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Budget</p>
              <p className="text-xl font-bold text-primary">
                ${((job.estimatedCost?.max || 0) / 1000).toFixed(1)}k
              </p>
            </div>
            <Badge variant="secondary">{job.bids.length} bids</Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

