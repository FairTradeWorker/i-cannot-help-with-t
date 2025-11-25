import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  CurrencyDollar, 
  ArrowRight, 
  Warning, 
  MagnifyingGlass,
  Play,
  VideoCamera,
  ListBullets,
  SquaresFour,
  SortAscending,
  Briefcase
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { dataStore } from '@/lib/store';
import type { Job, User } from '@/lib/types';

interface JobBrowserProps {
  user?: User;
  onJobSelect?: (job: Job) => void;
  onJobUpdated?: () => void;
}

export function JobBrowser({ user, onJobSelect, onJobUpdated }: JobBrowserProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'urgent' | 'budget'>('newest');

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

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'urgent':
        const urgencyOrder = { emergency: 0, urgent: 1, normal: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      case 'budget':
        return b.estimatedCost.max - a.estimatedCost.max;
      case 'newest':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
      case 'urgent':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading available jobs...</p>
      </Card>
    );
  }

  const JobCard = ({ job, hasMyBid }: { job: Job; hasMyBid: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className="glass-card hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
        onClick={() => onJobSelect?.(job)}
      >
        {job.videoUrl && (
          <div className="relative aspect-video bg-muted overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
            <img 
              src={job.videoUrl} 
              alt={job.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 z-20">
              <Badge className={getUrgencyColor(job.urgency)}>
                {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" weight="fill" />}
                {job.urgency}
              </Badge>
            </div>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center"
              >
                <Play className="w-8 h-8 text-white ml-1" weight="fill" />
              </motion.div>
            </div>
            {hasMyBid && (
              <div className="absolute top-3 right-3 z-20">
                <Badge variant="default" className="bg-accent">
                  Bid Submitted
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-1">
                {job.title}
              </h3>
              {!job.videoUrl && (
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getUrgencyColor(job.urgency)}>
                    {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" weight="fill" />}
                    {job.urgency}
                  </Badge>
                  {hasMyBid && (
                    <Badge variant="outline" className="bg-accent/10">
                      Bid Submitted
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-0.5">Budget</p>
              <p className="text-lg font-bold text-accent">
                ${job.estimatedCost.max.toLocaleString()}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{job.address.city}, {job.address.state}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{job.laborHours}h</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{job.bids.length} bids</span>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onJobSelect?.(job);
            }}
          >
            View Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Briefcase className="w-6 h-6 text-white" weight="duotone" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Browse Jobs</h2>
            <p className="text-muted-foreground">
              {sortedJobs.length} available opportunities
            </p>
          </div>
        </div>
      </motion.div>

      <Card className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search jobs by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[160px]">
                <SortAscending className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="urgent">Most Urgent</SelectItem>
                <SelectItem value="budget">Highest Budget</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <SquaresFour className="w-4 h-4" weight={viewMode === 'grid' ? 'fill' : 'regular'} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <ListBullets className="w-4 h-4" weight={viewMode === 'list' ? 'fill' : 'regular'} />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {sortedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="glass-card p-12 text-center">
              <MagnifyingGlass className="w-20 h-20 text-muted-foreground mx-auto mb-4" weight="duotone" />
              <h4 className="text-xl font-semibold mb-2">No Jobs Found</h4>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No jobs available at the moment'}
              </p>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {sortedJobs.map(job => {
              const hasMyBid = user ? job.bids.some(b => b.contractorId === user.id) : false;
              
              if (viewMode === 'list') {
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="glass-card p-5 hover:shadow-xl transition-all cursor-pointer group"
                      onClick={() => onJobSelect?.(job)}
                    >
                      <div className="flex items-start gap-4">
                        {job.videoUrl && (
                          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                            <img 
                              src={job.videoUrl} 
                              alt={job.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-8 h-8 text-white" weight="fill" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                {job.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getUrgencyColor(job.urgency)}>
                                  {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" weight="fill" />}
                                  {job.urgency}
                                </Badge>
                                {hasMyBid && (
                                  <Badge variant="outline" className="bg-accent/10">
                                    Bid Submitted
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Budget</p>
                              <p className="text-xl font-bold text-accent">
                                ${job.estimatedCost.max.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{job.address.city}, {job.address.state}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{job.laborHours}h estimated</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>{job.bids.length} bids</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobSelect?.(job);
                          }}
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              }
              
              return <JobCard key={job.id} job={job} hasMyBid={hasMyBid} />;
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
