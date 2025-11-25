import { useState, useEffect } from 'react';
import { MapPin, Clock, CurrencyDollar, ArrowRight, Warning, MagnifyingGlass } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <MagnifyingGlass className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
          <h4 className="text-lg font-semibold mb-2">No Jobs Found</h4>
          <p className="text-muted-foreground">
            {searchTerm ? 'Try adjusting your search terms' : 'No jobs available at the moment'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const hasMyBid = user ? job.bids.some(b => b.contractorId === user.id) : false;
            
            return (
              <Card 
                key={job.id} 
                className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => onJobSelect?.(job)}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
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
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{job.address.city}, {job.address.state}</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{job.laborHours}h estimated</span>
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <div className="mb-3">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Range</p>
                      <p className="text-2xl font-bold text-accent font-mono">
                        ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
                      </p>
                    </div>
                    
                    <Button className="w-full" onClick={(e) => {
                      e.stopPropagation();
                      onJobSelect?.(job);
                    }}>
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
