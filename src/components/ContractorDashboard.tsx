import { useState, useEffect, useMemo } from 'react';
import { useKV } from '@github/spark/hooks';
import { CurrencyDollar, Clock, CheckCircle, MapPin, Star, Calendar, ChatCircle, Scales, Path, Brain, Funnel, Briefcase, Users } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataStore } from '@/lib/store';
import type { Job, User, Earnings } from '@/lib/types';
import { JobBrowser } from './JobBrowser';
import { JobDetails } from './JobDetails';
import { EarningsDashboard } from './EarningsDashboard';
import { ComplianceDashboard } from './ComplianceDashboard';
import { EstimateAccuracyTrend } from './EstimateAccuracyTrend';
import { RouteOptimizer } from './RouteOptimizer';
import { AILearningDashboard } from './AILearningDashboard';
import { matchContractorsToJob, isBestMatch } from '@/lib/contractor-matching';
import { SERVICE_CATEGORIES, getCategoryById } from '@/types/service-categories';
import { SubcontractorFinder } from './SubcontractorFinder';

interface ContractorDashboardProps {
  user?: User;
  subTab?: string | null;
  isSubcontractor?: boolean;
}

// Demo jobs for contractors
const getDemoJobs = (contractorId: string): Job[] => [
  {
    id: 'contractor-job-1',
    title: 'Kitchen Remodel - Countertop Installation',
    description: 'Install new quartz countertops in kitchen. Approximately 30 linear feet. Need professional installation with sink cutout.',
    status: 'in_progress',
    homeownerId: 'homeowner-1',
    contractorId: contractorId,
    address: {
      street: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      lat: 37.7749,
      lng: -122.4194,
    },
    urgency: 'normal',
    estimatedCost: { min: 3500, max: 5500 },
    actualCost: 4800,
    laborHours: 16,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'contractor-job-2',
    title: 'Bathroom Renovation - Full Remodel',
    description: 'Complete bathroom renovation including new tiles, fixtures, vanity, and shower installation. Master bathroom, 120 sq ft.',
    status: 'assigned',
    homeownerId: 'homeowner-2',
    contractorId: contractorId,
    address: {
      street: '789 Pine Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94103',
      lat: 37.7849,
      lng: -122.4094,
    },
    urgency: 'normal',
    estimatedCost: { min: 8500, max: 12500 },
    laborHours: 40,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    scheduledStart: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'contractor-job-3',
    title: 'Roof Repair - Storm Damage',
    description: 'Repair storm damage to roof shingles. Approximately 200 sq ft area needs replacement. Also check for leaks in attic.',
    status: 'completed',
    homeownerId: 'homeowner-3',
    contractorId: contractorId,
    address: {
      street: '321 Elm Drive',
      city: 'San Francisco',
      state: 'CA',
      zip: '94104',
      lat: 37.7649,
      lng: -122.4294,
    },
    urgency: 'urgent',
    estimatedCost: { min: 1200, max: 2500 },
    actualCost: 2100,
    laborHours: 12,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    rating: {
      jobId: 'contractor-job-3',
      contractorId: contractorId,
      homeownerId: 'homeowner-3',
      overallScore: 95,
      quality: 98,
      communication: 92,
      timeliness: 95,
      professionalism: 96,
      cleanliness: 94,
      comment: 'Excellent work! Very professional and completed on time.',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'contractor-job-4',
    title: 'Deck Construction - Composite Deck',
    description: 'Build new 400 sq ft composite deck with stairs and railing. Need permit assistance and design consultation.',
    status: 'completed',
    homeownerId: 'homeowner-4',
    contractorId: contractorId,
    address: {
      street: '654 Maple Court',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      lat: 37.7549,
      lng: -122.4394,
    },
    urgency: 'normal',
    estimatedCost: { min: 12000, max: 18000 },
    actualCost: 15500,
    laborHours: 48,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    rating: {
      jobId: 'contractor-job-4',
      contractorId: contractorId,
      homeownerId: 'homeowner-4',
      overallScore: 98,
      quality: 99,
      communication: 97,
      timeliness: 98,
      professionalism: 98,
      cleanliness: 99,
      comment: 'Outstanding craftsmanship! The deck looks amazing.',
      createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
    },
    bids: [],
    messages: [],
    milestones: [],
  },
];

// Demo earnings data
const getDemoEarnings = (contractorId: string): Earnings => ({
  contractorId: contractorId,
  totalEarnings: 87250,
  availableBalance: 12450,
  pendingBalance: 4800,
  jobs: [
    {
      jobId: 'contractor-job-3',
      jobTitle: 'Roof Repair - Storm Damage',
      amount: 2100,
      platformFee: 0,
      netAmount: 2100,
      status: 'available',
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      jobId: 'contractor-job-4',
      jobTitle: 'Deck Construction - Composite Deck',
      amount: 15500,
      platformFee: 0,
      netAmount: 15500,
      status: 'available',
      completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
    {
      jobId: 'contractor-job-1',
      jobTitle: 'Kitchen Remodel - Countertop Installation',
      amount: 4800,
      platformFee: 0,
      netAmount: 4800,
      status: 'pending',
      completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
  ],
  payouts: [],
});

export function ContractorDashboard({ user, subTab, isSubcontractor }: ContractorDashboardProps) {
  const [activeTab, setActiveTab] = useState(subTab || 'dashboard');
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandRelated, setExpandRelated] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'distance' | 'value' | 'urgency'>('match');
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (subTab) {
      setActiveTab(subTab);
    }
  }, [subTab]);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id || !user?.contractorProfile) return;
    
    setLoading(true);
    try {
      const jobs = await dataStore.getJobsForContractor(user.id);
      
      // Initialize with demo jobs if no jobs exist
      if ((!jobs || jobs.length === 0) && !hasInitialized) {
        const demoJobs = getDemoJobs(user.id);
        setMyJobs(demoJobs);
        setHasInitialized(true);
      } else {
        setMyJobs(jobs || []);
      }
      
      // Load available jobs for matching
      const allJobs = await dataStore.getJobs();
      const postedJobs = allJobs.filter(j => 
        j.status === 'posted' || j.status === 'bidding'
      );
      setAvailableJobs(postedJobs);
      
      const earningsData = await dataStore.getEarnings(user.id);
      // Initialize with demo earnings if no earnings exist
      if (!earningsData && !hasInitialized) {
        setEarnings(getDemoEarnings(user.id));
      } else {
        setEarnings(earningsData);
      }
    } catch (error) {
      console.error('Failed to load contractor data:', error);
      // Fallback to demo data on error
      if (!hasInitialized && user?.id) {
        setMyJobs(getDemoJobs(user.id));
        setEarnings(getDemoEarnings(user.id));
        setHasInitialized(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Get contractor's service specialties
  const contractorSpecialties = useMemo(() => {
    if (!user?.contractorProfile?.serviceSpecialties) return [];
    return user.contractorProfile.serviceSpecialties;
  }, [user]);

  // Get unique category IDs from specialties
  const specialtyCategories = useMemo(() => {
    const categoryIds = new Set(contractorSpecialties.map(s => s.categoryId));
    return Array.from(categoryIds);
  }, [contractorSpecialties]);

  // Filter and match jobs based on selected category
  const filteredAndMatchedJobs = useMemo(() => {
    if (!user || !user.contractorProfile) return [];

    let jobsToFilter = availableJobs;

    // Filter by category if selected
    if (selectedCategory !== 'all') {
      jobsToFilter = jobsToFilter.filter(job => {
        // Check if job has serviceSelection matching category
        const jobService = (job as any).serviceSelection;
        if (jobService) {
          if (expandRelated) {
            // Include related categories (same main category)
            const selectedCat = getCategoryById(selectedCategory);
            const jobCat = getCategoryById(jobService.categoryId);
            return jobCat?.id === selectedCat?.id || jobService.categoryId === selectedCategory;
          }
          return jobService.categoryId === selectedCategory;
        }
        return false;
      });
    } else if (!expandRelated) {
      // Filter to only jobs matching contractor's specialties
      jobsToFilter = jobsToFilter.filter(job => {
        const jobService = (job as any).serviceSelection;
        if (!jobService) return false;
        return contractorSpecialties.some(spec => 
          spec.categoryId === jobService.categoryId &&
          spec.subcategoryId === jobService.subcategoryId &&
          spec.services.includes(jobService.service)
        );
      });
    }

    // Match and rank jobs
    const matchedJobs = jobsToFilter.map(job => {
      const jobService = (job as any).serviceSelection;
      if (!jobService) return { job, match: null };
      
      const matches = matchContractorsToJob([user], job, jobService);
      return { job, match: matches[0] || null };
    }).filter(({ match }) => match !== null);

    // Sort by selected criteria
    matchedJobs.sort((a, b) => {
      if (!a.match || !b.match) return 0;
      
      switch (sortBy) {
        case 'match':
          return b.match.matchScore - a.match.matchScore;
        case 'distance':
          const distA = a.match.matchBreakdown.distanceScore;
          const distB = b.match.matchBreakdown.distanceScore;
          return distB - distA;
        case 'value':
          const valueA = a.job.estimatedCost.max;
          const valueB = b.job.estimatedCost.max;
          return valueB - valueA;
        case 'urgency':
          const urgencyOrder = { emergency: 3, urgent: 2, normal: 1 };
          return urgencyOrder[b.job.urgency] - urgencyOrder[a.job.urgency];
        default:
          return 0;
      }
    });

    return matchedJobs;
  }, [availableJobs, user, selectedCategory, expandRelated, sortBy, contractorSpecialties]);

  const profile = user?.contractorProfile;

  if (!user || !profile) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Contractor Dashboard</h2>
          <p className="text-muted-foreground mb-6">
            Sign in or create a contractor account to access your dashboard
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                // This will be handled by parent App component
                window.location.reload();
              }}
            >
              Sign In as Contractor
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeJobs = myJobs.filter(j => j.status === 'assigned' || j.status === 'in_progress');
  const completedJobs = myJobs.filter(j => j.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-16 h-16 border-2 border-border shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                    {user.name[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-card flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" weight="fill" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent" weight="fill" />
                    <span className="text-sm font-semibold">{profile.rating}</span>
                    <span className="text-sm text-muted-foreground">/100</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4" />
                    <span>{profile.completedJobs} jobs completed</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={profile.availability === 'available' ? 'default' : 'secondary'}
                className="mb-2"
              >
                {profile.availability === 'available' ? 'Available for Work' : 'Busy'}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CurrencyDollar className="w-4 h-4" />
                <span>${profile.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <EstimateAccuracyTrend contractorId={user.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span>Active Jobs</span>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{activeJobs.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
            <p className="text-3xl font-bold text-accent font-mono">{completedJobs.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CurrencyDollar className="w-4 h-4" />
              <span>Available Balance</span>
            </div>
            <p className="text-3xl font-bold text-foreground font-mono">
              ${earnings?.availableBalance.toLocaleString() || 0}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CurrencyDollar className="w-4 h-4" />
              <span>Pending</span>
            </div>
            <p className="text-3xl font-bold text-muted-foreground font-mono">
              ${earnings?.pendingBalance.toLocaleString() || 0}
            </p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-5xl grid-cols-8 mb-8">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="route">
              <Path className="w-4 h-4 mr-2" />
              Route Planner
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="learning">
              <Brain className="w-4 h-4 mr-2" />
              AI Learning
            </TabsTrigger>
            <TabsTrigger value="compliance">
              <Scales className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="subcontractors">
              <Users className="w-4 h-4 mr-2" />
              Find Help
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="space-y-6">
              {/* Service Category Filter */}
              {contractorSpecialties.length > 0 && (
                <Card className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Funnel className="w-5 h-5 text-muted-foreground" />
                        <Label className="font-semibold">Filter by Service:</Label>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Services</SelectItem>
                          {specialtyCategories.map(catId => {
                            const category = getCategoryById(catId);
                            const jobCount = filteredAndMatchedJobs.filter(({ job }) => {
                              const jobService = (job as any).serviceSelection;
                              return jobService?.categoryId === catId;
                            }).length;
                            return (
                              <SelectItem key={catId} value={catId}>
                                {category?.title || catId} ({jobCount})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="expand-related"
                          checked={expandRelated}
                          onCheckedChange={setExpandRelated}
                        />
                        <Label htmlFor="expand-related" className="text-sm">
                          Expand to Related
                        </Label>
                      </div>
                      <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="match">Match Quality</SelectItem>
                          <SelectItem value="distance">Distance</SelectItem>
                          <SelectItem value="value">Job Value</SelectItem>
                          <SelectItem value="urgency">Urgency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              )}

              {/* Service Category Tabs */}
              {contractorSpecialties.length > 0 && selectedCategory === 'all' && (
                <Tabs defaultValue={specialtyCategories[0] || 'all'} className="w-full">
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${specialtyCategories.length + 1}, minmax(0, 1fr))` }}>
                    <TabsTrigger value="all">All ({filteredAndMatchedJobs.length})</TabsTrigger>
                    {specialtyCategories.map(catId => {
                      const category = getCategoryById(catId);
                      const jobCount = filteredAndMatchedJobs.filter(({ job }) => {
                        const jobService = (job as any).serviceSelection;
                        return jobService?.categoryId === catId;
                      }).length;
                      return (
                        <TabsTrigger key={catId} value={catId}>
                          {category?.title || catId} ({jobCount})
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-6">
                    <JobList jobs={filteredAndMatchedJobs} onJobSelect={setSelectedJob} />
                  </TabsContent>
                  
                  {specialtyCategories.map(catId => (
                    <TabsContent key={catId} value={catId} className="mt-6">
                      <JobList
                        jobs={filteredAndMatchedJobs.filter(({ job }) => {
                          const jobService = (job as any).serviceSelection;
                          return jobService?.categoryId === catId;
                        })}
                        onJobSelect={setSelectedJob}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              )}

              {/* Default Job Browser if no specialties */}
              {contractorSpecialties.length === 0 && (
                <JobBrowser 
                  user={user} 
                  onJobSelect={setSelectedJob}
                  onJobUpdated={loadData}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            {activeJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                <h4 className="text-lg font-semibold mb-2">No Active Jobs</h4>
                <p className="text-muted-foreground mb-4">Browse available jobs to get started</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Jobs
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeJobs.map(job => (
                  <Card key={job.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <Badge>{job.status.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{job.address.city}, {job.address.state}</span>
                          </div>
                          {job.scheduledStart && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(job.scheduledStart).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent font-mono">
                          ${job.estimatedCost.min.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">{job.laborHours}h estimated</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="route">
            {activeJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Path className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                <h4 className="text-lg font-semibold mb-2">No Active Jobs to Route</h4>
                <p className="text-muted-foreground mb-4">Accept some jobs to optimize your route</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Jobs
                </Button>
              </Card>
            ) : (
              <RouteOptimizer
                jobs={activeJobs.map(job => ({
                  id: job.id,
                  title: job.title,
                  address: `${job.address.street}, ${job.address.city}, ${job.address.state} ${job.address.zip}`,
                  location: {
                    lat: job.address.lat || 0,
                    lng: job.address.lng || 0,
                  },
                  urgency: job.urgency,
                  estimatedDuration: job.laborHours ? job.laborHours * 3600 : undefined,
                }))}
                contractorLocation={{
                  lat: profile.location.lat,
                  lng: profile.location.lng,
                  address: profile.location.address,
                }}
                onRouteOptimized={(route) => {
                  console.log('Route optimized:', route);
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                <h4 className="text-lg font-semibold mb-2">No Completed Jobs Yet</h4>
                <p className="text-muted-foreground">Completed jobs will appear here</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {completedJobs.map(job => (
                  <Card key={job.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Completed {new Date(job.completedAt!).toLocaleDateString()}</span>
                          {job.rating && (
                            <div className="flex items-center gap-1 text-accent">
                              <Star className="w-4 h-4" weight="fill" />
                              <span className="font-semibold">{job.rating.overallScore}/100</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground font-mono">
                          ${job.actualCost?.toLocaleString() || job.estimatedCost.min.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsDashboard earnings={earnings} user={user} onUpdate={loadData} />
          </TabsContent>

          <TabsContent value="learning">
            <Card className="glass-card p-6 border-0 bg-transparent">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent">
                    <Brain className="w-7 h-7 text-white" weight="duotone" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AI Learning & Accuracy Metrics</h3>
                  <p className="text-muted-foreground">Platform intelligence and estimation accuracy</p>
                </div>
              </div>
              <AILearningDashboard contractorId={user.id} />
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <ComplianceDashboard user={user} />
          </TabsContent>

          <TabsContent value="subcontractors">
            <SubcontractorFinder contractorId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>

      {selectedJob && (
        <JobDetails 
          job={selectedJob} 
          user={user} 
          onClose={() => setSelectedJob(null)}
          onJobUpdated={loadData}
        />
      )}
    </div>
  );
}

// Job List Component with Match Quality
function JobList({ jobs, onJobSelect }: { jobs: Array<{ job: Job; match: any }>; onJobSelect: (job: Job) => void }) {
  if (jobs.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
        <h4 className="text-lg font-semibold mb-2">No Matching Jobs</h4>
        <p className="text-muted-foreground">No jobs found for your specialties</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map(({ job, match }) => (
        <Card
          key={job.id}
          className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => onJobSelect(job)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{job.title}</h3>
                {match && isBestMatch(match) && (
                  <Badge className="bg-accent text-white">Best Match</Badge>
                )}
                {match && (
                  <Badge variant="secondary">
                    {Math.round(match.matchScore)}% Match
                  </Badge>
                )}
                <Badge variant={job.urgency === 'emergency' ? 'destructive' : job.urgency === 'urgent' ? 'default' : 'secondary'}>
                  {job.urgency}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{job.address.city}, {job.address.state}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{job.laborHours}h</span>
                </div>
                {match && match.reasons.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    {match.reasons.slice(0, 2).join(' • ')}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent font-mono">
                ${job.estimatedCost.max.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">{job.bids.length} bids</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
