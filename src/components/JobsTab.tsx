// Jobs Tab - Full functionality with state-based organization and Post a Job integration
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { 
  MapPin, 
  Clock, 
  CurrencyDollar, 
  ArrowRight, 
  Warning, 
  MagnifyingGlass,
  Briefcase,
  Hammer,
  Lightning,
  X,
  Plus,
  FunnelSimple,
  CaretDown,
  Buildings,
  MapTrifold,
  CheckCircle,
  Users,
  Star,
  Play,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/EmptyState';
import { dataStore } from '@/lib/store';
import { getStateStats } from '@/lib/territory-data';
import type { Job, User } from '@/lib/types';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface JobsTabProps {
  user?: User;
  onPostJob?: () => void;
  onJobSelect?: (job: Job) => void;
  initialSearchTerm?: string;
}

// Sample jobs for demonstration (will be combined with dataStore jobs)
const sampleJobs: Job[] = [
  {
    id: 'job-sample-1',
    title: 'Roof Replacement - Storm Damage',
    description: 'Complete roof replacement needed after recent storm damage. Approximately 2,500 sq ft. Need experienced roofers.',
    status: 'posted',
    homeownerId: 'homeowner-1',
    address: { street: '1234 Oak Lane', city: 'Austin', state: 'TX', zip: '78701' },
    urgency: 'urgent',
    estimatedCost: { min: 8500, max: 15000 },
    laborHours: 24,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-2',
    title: 'HVAC System Installation',
    description: 'New central air conditioning system installation for 3,000 sq ft home. Ductwork may need modifications.',
    status: 'bidding',
    homeownerId: 'homeowner-2',
    address: { street: '567 Maple Ave', city: 'Phoenix', state: 'AZ', zip: '85001' },
    urgency: 'normal',
    estimatedCost: { min: 5000, max: 9000 },
    laborHours: 16,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [{ id: 'bid-1', jobId: 'job-sample-2', contractorId: 'c1', contractor: { name: 'HVAC Pro', rating: 92, completedJobs: 45, hourlyRate: 85 }, amount: 7500, timeline: { start: new Date(), end: new Date() }, message: '', status: 'pending', createdAt: new Date() }],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-3',
    title: 'Emergency Plumbing - Burst Pipe',
    description: 'Burst pipe in basement causing flooding. Need immediate repair and water damage assessment.',
    status: 'posted',
    homeownerId: 'homeowner-3',
    address: { street: '890 Pine St', city: 'Denver', state: 'CO', zip: '80202' },
    urgency: 'emergency',
    estimatedCost: { min: 500, max: 2500 },
    laborHours: 4,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-4',
    title: 'Kitchen Remodel',
    description: 'Full kitchen renovation including new cabinets, countertops, flooring, and appliance installation.',
    status: 'posted',
    homeownerId: 'homeowner-4',
    address: { street: '321 Elm Dr', city: 'Atlanta', state: 'GA', zip: '30301' },
    urgency: 'normal',
    estimatedCost: { min: 25000, max: 45000 },
    laborHours: 80,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [
      { id: 'bid-2', jobId: 'job-sample-4', contractorId: 'c2', contractor: { name: 'Premier Renovations', rating: 95, completedJobs: 78, hourlyRate: 95 }, amount: 38000, timeline: { start: new Date(), end: new Date() }, message: '', status: 'pending', createdAt: new Date() },
      { id: 'bid-3', jobId: 'job-sample-4', contractorId: 'c3', contractor: { name: 'Home Experts LLC', rating: 88, completedJobs: 34, hourlyRate: 75 }, amount: 35000, timeline: { start: new Date(), end: new Date() }, message: '', status: 'pending', createdAt: new Date() },
    ],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-5',
    title: 'Exterior Painting - Full House',
    description: 'Need exterior painting for 2-story home. Includes power washing, scraping, priming, and 2 coats.',
    status: 'posted',
    homeownerId: 'homeowner-5',
    address: { street: '654 Cedar Ln', city: 'Nashville', state: 'TN', zip: '37201' },
    urgency: 'normal',
    estimatedCost: { min: 3500, max: 6500 },
    laborHours: 32,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-6',
    title: 'Electrical Panel Upgrade',
    description: 'Upgrade from 100 amp to 200 amp service. Old panel is showing signs of wear.',
    status: 'bidding',
    homeownerId: 'homeowner-6',
    address: { street: '987 Birch Way', city: 'Seattle', state: 'WA', zip: '98101' },
    urgency: 'urgent',
    estimatedCost: { min: 2000, max: 4000 },
    laborHours: 8,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [{ id: 'bid-4', jobId: 'job-sample-6', contractorId: 'c4', contractor: { name: 'Spark Electric', rating: 96, completedJobs: 120, hourlyRate: 90 }, amount: 3200, timeline: { start: new Date(), end: new Date() }, message: '', status: 'pending', createdAt: new Date() }],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-7',
    title: 'Deck Construction',
    description: 'Build new 400 sq ft composite deck with stairs and railing. Need permit assistance.',
    status: 'posted',
    homeownerId: 'homeowner-7',
    address: { street: '147 Spruce Ct', city: 'Portland', state: 'OR', zip: '97201' },
    urgency: 'normal',
    estimatedCost: { min: 12000, max: 20000 },
    laborHours: 48,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-sample-8',
    title: 'Window Replacement - 12 Windows',
    description: 'Replace all windows in home with energy-efficient double-pane windows.',
    status: 'posted',
    homeownerId: 'homeowner-8',
    address: { street: '258 Willow Rd', city: 'Chicago', state: 'IL', zip: '60601' },
    urgency: 'normal',
    estimatedCost: { min: 8000, max: 15000 },
    laborHours: 24,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [
      { id: 'bid-5', jobId: 'job-sample-8', contractorId: 'c5', contractor: { name: 'Window World', rating: 90, completedJobs: 200, hourlyRate: 70 }, amount: 11500, timeline: { start: new Date(), end: new Date() }, message: '', status: 'pending', createdAt: new Date() },
    ],
    messages: [],
    milestones: [],
  },
];

export function JobsTab({ user, onPostJob, onJobSelect, initialSearchTerm }: JobsTabProps) {
  const [storedJobs, setStoredJobs] = useKV<Job[]>('posted-jobs', []);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'by-state' | 'urgent'>('all');

  useEffect(() => {
    loadJobs();
  }, [storedJobs]);

  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const allStoredJobs = await dataStore.getJobs();
      // Combine with sample jobs and stored jobs from KV
      const combinedJobs = [...sampleJobs, ...allStoredJobs, ...(storedJobs || [])];
      // Remove duplicates based on ID
      const uniqueJobs = combinedJobs.filter((job, index, self) => 
        index === self.findIndex(j => j.id === job.id)
      );
      const availableJobs = uniqueJobs.filter(j => 
        j.status === 'posted' || j.status === 'bidding'
      );
      setJobs(availableJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs(sampleJobs);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.address.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesState = selectedState === 'all' || job.address.state === selectedState;
    
    return matchesSearch && matchesState;
  });

  // Group jobs by state
  const jobsByState: Record<string, Job[]> = {};
  filteredJobs.forEach(job => {
    const state = job.address.state;
    if (!jobsByState[state]) {
      jobsByState[state] = [];
    }
    jobsByState[state].push(job);
  });

  // Get unique states from jobs
  const statesWithJobs = Object.keys(jobsByState).sort();
  
  const urgentJobs = filteredJobs.filter(j => j.urgency === 'emergency' || j.urgency === 'urgent');
  const regularJobs = filteredJobs.filter(j => j.urgency === 'normal');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-destructive text-white';
      case 'urgent':
        return 'bg-accent text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const formatBudget = (cost: { min: number; max: number }) => {
    if (cost.max >= 1000000) {
      return `$${(cost.max / 1000000).toFixed(1)}M`;
    }
    if (cost.max >= 1000) {
      return `$${(cost.max / 1000).toFixed(0)}K`;
    }
    return `$${cost.max}`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-9 w-48 bg-muted rounded-md animate-pulse mb-2" />
            <div className="h-5 w-64 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4">
              <div className="h-12 w-12 bg-muted rounded-lg animate-pulse mb-3" />
              <div className="h-8 w-16 bg-muted rounded-md animate-pulse mb-2" />
              <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-2/3 bg-muted rounded-md animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Jobs Marketplace</h1>
            <p className="text-muted-foreground">Find work opportunities in your area</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="lg" onClick={onPostJob} aria-label="Post a new job">
                  <Plus className="w-5 h-5 mr-2" />
                  Post a Job
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a job posting to get bids from qualified contractors</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Stats */}
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-4 cursor-help hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Briefcase className="w-5 h-5 text-primary" weight="fill" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{jobs.length}</p>
                      <p className="text-xs text-muted-foreground">Total Jobs</p>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of available jobs across all states</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-4 cursor-help hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <Lightning className="w-5 h-5 text-destructive" weight="fill" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{urgentJobs.length}</p>
                      <p className="text-xs text-muted-foreground">Urgent Jobs</p>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Jobs marked as urgent or emergency priority</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-4 cursor-help hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <MapTrifold className="w-5 h-5 text-accent" weight="fill" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{statesWithJobs.length}</p>
                      <p className="text-xs text-muted-foreground">States</p>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of states with available jobs</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="p-4 cursor-help hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Users className="w-5 h-5 text-secondary" weight="fill" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{jobs.reduce((acc, j) => acc + j.bids.length, 0)}</p>
                      <p className="text-xs text-muted-foreground">Active Bids</p>
                    </div>
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total number of bids submitted by contractors</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <TooltipProvider>
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search jobs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="w-[180px]" aria-label="Filter by state">
                      <SelectValue placeholder="All States" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {statesWithJobs.map(state => (
                        <SelectItem key={state} value={state}>
                          {state} ({jobsByState[state]?.length || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Filter jobs by state</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
          <TabsTrigger value="all">
            <Briefcase className="w-4 h-4 mr-2" />
            All Jobs
          </TabsTrigger>
          <TabsTrigger value="by-state">
            <MapTrifold className="w-4 h-4 mr-2" />
            By State
          </TabsTrigger>
          <TabsTrigger value="urgent">
            <Lightning className="w-4 h-4 mr-2" />
            Urgent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredJobs.length === 0 ? (
            <EmptyState
              type="search"
              title={searchTerm ? "No jobs match your search" : "No jobs available"}
              description={searchTerm 
                ? "Try adjusting your search terms or filters to find more opportunities"
                : "Check back later for new job opportunities, or be the first to post a job"
              }
              actionLabel={searchTerm ? "Clear Search" : "Post a Job"}
              onAction={searchTerm ? () => setSearchTerm('') : onPostJob}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4">
              {filteredJobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={() => setSelectedJob(job)}
                  index={index}
                  formatBudget={formatBudget}
                  getUrgencyColor={getUrgencyColor}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="by-state" className="mt-0">
          <div className="space-y-8">
            {statesWithJobs.map(state => (
              <div key={state}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">{state}</Badge>
                  <span className="text-muted-foreground">{jobsByState[state].length} job{jobsByState[state].length !== 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4">
                  {jobsByState[state].map((job, index) => (
                    <JobCard 
                      key={job.id} 
                      job={job} 
                      onClick={() => setSelectedJob(job)}
                      index={index}
                      formatBudget={formatBudget}
                      getUrgencyColor={getUrgencyColor}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="urgent" className="mt-0">
          {urgentJobs.length === 0 ? (
            <EmptyState
              type="jobs"
              title="No urgent jobs at the moment"
              description="All current jobs are standard priority. Check back later for urgent opportunities."
              icon={<CheckCircle className="w-16 h-16 text-green-500" weight="fill" />}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 md:gap-4">
              {urgentJobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  onClick={() => setSelectedJob(job)}
                  index={index}
                  formatBudget={formatBudget}
                  getUrgencyColor={getUrgencyColor}
                  urgent
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-background w-full md:max-w-2xl md:rounded-xl overflow-hidden border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedJob.address.city}, {selectedJob.address.state}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedJob(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <ScrollArea className="max-h-[60vh]">
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getUrgencyColor(selectedJob.urgency)}>
                      {selectedJob.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" />}
                      {selectedJob.urgency.charAt(0).toUpperCase() + selectedJob.urgency.slice(1)}
                    </Badge>
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedJob.laborHours}h estimated
                    </Badge>
                    <Badge variant="outline">
                      <Users className="w-3 h-3 mr-1" />
                      {selectedJob.bids.length} bid{selectedJob.bids.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
                      <p className="text-xl font-bold">
                        ${selectedJob.estimatedCost.min.toLocaleString()} - ${selectedJob.estimatedCost.max.toLocaleString()}
                      </p>
                    </Card>
                    <Card className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">Posted</p>
                      <p className="text-xl font-bold">
                        {Math.floor((Date.now() - new Date(selectedJob.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d ago
                      </p>
                    </Card>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Location</h4>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>{selectedJob.address.street}</p>
                        <p className="text-muted-foreground">{selectedJob.address.city}, {selectedJob.address.state} {selectedJob.address.zip}</p>
                      </div>
                    </div>
                  </div>

                  {selectedJob.bids.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Current Bids ({selectedJob.bids.length})</h4>
                      <div className="space-y-2">
                        {selectedJob.bids.map(bid => (
                          <Card key={bid.id} className="p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Hammer className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold">{bid.contractor.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Star className="w-3 h-3 text-amber-500" weight="fill" />
                                    <span>{bid.contractor.rating}/100</span>
                                    <span>•</span>
                                    <span>{bid.contractor.completedJobs} jobs</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">${bid.amount.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">bid amount</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    onJobSelect?.(selectedJob);
                    setSelectedJob(null);
                    toast.success('Job details opened', {
                      description: 'You can now view full details and submit your bid',
                      duration: 3000,
                    });
                  }}
                >
                  View Full Details & Submit Bid
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  💡 Tip: Review the job description and contractor bids before submitting your own
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Job Card Component
interface JobCardProps {
  job: Job;
  onClick: () => void;
  index: number;
  formatBudget: (cost: { min: number; max: number }) => string;
  getUrgencyColor: (urgency: string) => string;
  urgent?: boolean;
  compact?: boolean;
}

function JobCard({ job, onClick, index, formatBudget, getUrgencyColor, urgent, compact }: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  // Mobile-optimized card layout
  if (isMobile && !compact) {
    const urgencyStatus = job.urgency === 'urgent' || job.urgency === 'emergency' ? 'URGENT' : 'NORMAL';
    const statusColor = urgencyStatus === 'URGENT' ? 'bg-red-500' : 'bg-green-500';
    
    // Determine gradient colors based on urgency
    let gradientFrom = '#6366f1'; // default indigo
    let gradientTo = '#4f46e5';
    if (job.urgency === 'emergency') {
      gradientFrom = '#ef4444'; // red
      gradientTo = '#dc2626';
    } else if (job.urgency === 'urgent') {
      gradientFrom = '#f59e0b'; // amber
      gradientTo = '#d97706';
    } else {
      gradientFrom = '#3b82f6'; // blue
      gradientTo = '#1d4ed8';
    }
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.03 }}
        className="mb-4"
        style={{ marginLeft: '16px', marginRight: '16px', width: 'calc(100% - 32px)' }}
      >
        <Card
          className="overflow-hidden cursor-pointer transition-all border-0"
          style={{
            borderRadius: '12px',
            padding: '16px',
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
          }}
          onClick={onClick}
        >
          {/* TOP SECTION */}
          <div className="relative mb-3">
            {/* Small video icon in top-right corner if video exists */}
            {job.videoUrl && (
              <div className="absolute top-0 right-0 z-10">
                <div className="w-5 h-5 rounded bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" weight="fill" />
                </div>
              </div>
            )}
            
            {/* Job title with optional Video badge */}
            <div className="flex items-center gap-2 pr-6">
              <h3 className="font-bold text-white" style={{ fontSize: '16px' }}>
                {job.title}
              </h3>
              {job.videoUrl && (
                <Badge 
                  variant="outline" 
                  className="bg-white/20 border-white/30 text-white text-xs px-1.5 py-0 h-5"
                  style={{ fontSize: '10px' }}
                >
                  Video
                </Badge>
              )}
            </div>
            
            {/* Description */}
            <p 
              className="text-white/90 mt-1 line-clamp-2" 
              style={{ 
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4',
                maxHeight: '2.8em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {job.description}
            </p>
            
            {/* Location + Time + Bids in one row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/80" />
                <span className="text-white/80" style={{ fontSize: '12px' }}>
                  {job.address.city}, {job.address.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-white/80" />
                <span className="text-white/80" style={{ fontSize: '12px' }}>
                  {job.laborHours}h
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3 text-white/80" />
                <span className="text-white/80" style={{ fontSize: '12px' }}>
                  {job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION - Video thumbnail if exists */}
          {job.videoUrl && (
            <div className="relative mb-3 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <img
                src={job.videoUrl}
                alt={job.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* BOTTOM SECTION */}
          <div className="flex items-center justify-between gap-2">
            {/* Left: Status badge */}
            <Badge 
              className={`${statusColor} text-white border-0`}
              style={{ fontSize: '12px', padding: '4px 8px' }}
            >
              {urgencyStatus}
            </Badge>
            
            {/* Right: Budget + Bid Job button */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-white font-bold" style={{ fontSize: '14px' }}>
                {formatBudget(job.estimatedCost)}
              </span>
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 text-xs px-3 py-1 h-7 whitespace-nowrap"
                style={{ fontSize: '12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                Bid Job
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Desktop layout (existing)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`overflow-hidden cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
          urgent ? 'border-destructive/50 bg-destructive/5' : ''
        }`}
        onClick={onClick}
      >
        {/* Video Thumbnail */}
        {!compact && (
          <div className="relative aspect-video bg-muted overflow-hidden">
            {job.videoUrl ? (
              <>
                {/* Video thumbnail */}
                <img
                  src={job.videoUrl}
                  alt={job.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Small video icon in top-right corner */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="w-5 h-5 rounded bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-3 h-3 text-white" weight="fill" />
                  </div>
                </div>
                
                <div className="absolute bottom-2 left-2 right-2">
                  <Badge className={getUrgencyColor(job.urgency)}>
                    {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" />}
                    {job.urgency.toUpperCase()}
                  </Badge>
                </div>
              </>
            ) : (
              /* Placeholder when no video */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="text-center">
                  <Badge className={getUrgencyColor(job.urgency)}>
                    {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" />}
                    {job.urgency.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}

            {/* Text overlay on video - three column layout */}
            <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                {/* Column 1: Title + description */}
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white truncate drop-shadow-md">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/90 line-clamp-2 drop-shadow-md">
                    {job.description}
                  </p>
                </div>

                {/* Column 2: Meta info */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/90">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">
                        {job.address.city}, {job.address.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{job.laborHours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>
                        {job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Budget + Bid button */}
                <div className="text-right space-y-2 pointer-events-auto">
                  <p className="text-[11px] text-white/80">Budget</p>
                  <p className="text-xl font-bold text-white drop-shadow-md">
                    {formatBudget(job.estimatedCost)}
                  </p>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-xs px-3 py-1 h-8"
                  >
                    Bid Job
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Hover Overlay */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* Job Info (compact cards only) */}
        {compact && (
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold truncate text-base">{job.title}</h3>
                  {(job.urgency === 'urgent' || job.urgency === 'emergency') && (
                    <Badge className={getUrgencyColor(job.urgency)} variant="default">
                      {job.urgency === 'emergency' && <Warning className="w-3 h-3 mr-1" />}
                      {job.urgency}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.address.city}, {job.address.state}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.laborHours}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-1">Budget</p>
                <p className="font-bold text-xl">{formatBudget(job.estimatedCost)}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
