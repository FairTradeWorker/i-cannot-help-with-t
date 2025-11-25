import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { CurrencyDollar, Clock, CheckCircle, MapPin, Star, Calendar, ChatCircle, Scales } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { dataStore } from '@/lib/store';
import type { Job, User, Earnings } from '@/lib/types';
import { JobBrowser } from './JobBrowser';
import { JobDetails } from './JobDetails';
import { EarningsDashboard } from './EarningsDashboard';
import { ComplianceDashboard } from './ComplianceDashboard';

interface ContractorDashboardProps {
  user: User;
}

export function ContractorDashboard({ user }: ContractorDashboardProps) {
  const [activeTab, setActiveTab] = useState('browse');
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const jobs = await dataStore.getJobsForContractor(user.id);
      setMyJobs(jobs);
      
      const earningsData = await dataStore.getEarnings(user.id);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Failed to load contractor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const profile = user.contractorProfile;

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No contractor profile found</p>
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
              <Avatar className="w-16 h-16 bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{user.name[0]}</span>
              </Avatar>
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
                  {profile.verified && (
                    <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent-foreground">
                      <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                      Verified
                    </Badge>
                  )}
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
          <TabsList className="grid w-full max-w-4xl grid-cols-5 mb-8">
            <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="compliance">
              <Scales className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <JobBrowser 
              user={user} 
              onJobSelect={setSelectedJob}
              onJobUpdated={loadData}
            />
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

          <TabsContent value="compliance">
            <ComplianceDashboard user={user} />
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
