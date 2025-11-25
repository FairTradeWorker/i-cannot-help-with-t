import { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, CheckCircle, Users, ChatCircle } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { dataStore } from '@/lib/store';
import type { Job, User } from '@/lib/types';
import { VideoUploader } from './VideoUploader';
import { JobDetails } from './JobDetails';

interface HomeownerDashboardProps {
  user: User;
}

export function HomeownerDashboard({ user }: HomeownerDashboardProps) {
  const [activeTab, setActiveTab] = useState('my-jobs');
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const jobs = await dataStore.getJobsForHomeowner(user.id);
      setMyJobs(jobs);
    } catch (error) {
      console.error('Failed to load homeowner data:', error);
    } finally {
      setLoading(false);
    }
  };

  const profile = user.homeownerProfile;

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No homeowner profile found</p>
      </div>
    );
  }

  const activeJobs = myJobs.filter(j => j.status === 'posted' || j.status === 'bidding' || j.status === 'assigned' || j.status === 'in_progress');
  const completedJobs = myJobs.filter(j => j.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
              <p className="text-muted-foreground mt-1">Manage your home improvement projects</p>
            </div>
            <Button size="lg" onClick={() => setShowNewJob(true)}>
              <Plus className="w-5 h-5 mr-2" weight="bold" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="w-4 h-4" />
              <span>Active Projects</span>
            </div>
            <p className="text-3xl font-bold text-primary font-mono">{activeJobs.length}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>Completed Projects</span>
            </div>
            <p className="text-3xl font-bold text-accent font-mono">{profile.completedProjects}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              <span>Loyalty Points</span>
            </div>
            <p className="text-3xl font-bold text-foreground font-mono">{profile.loyaltyPoints}</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
            <TabsTrigger value="my-jobs">My Projects</TabsTrigger>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="my-jobs">
            {myJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="max-w-md mx-auto">
                  <Clock className="w-20 h-20 text-muted-foreground mx-auto mb-4" weight="duotone" />
                  <h4 className="text-2xl font-semibold mb-2">No Projects Yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start your first home improvement project. Upload a video and get instant AI-powered estimates from qualified contractors.
                  </p>
                  <Button size="lg" onClick={() => setShowNewJob(true)}>
                    <Plus className="w-5 h-5 mr-2" weight="bold" />
                    Create Your First Project
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {myJobs.map(job => {
                  const activeBids = job.bids.filter(b => b.status === 'pending').length;
                  const unreadMessages = job.messages.filter(m => !m.read && m.senderId !== user.id).length;
                  
                  return (
                    <Card 
                      key={job.id} 
                      className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{job.title}</h3>
                            <Badge>{job.status.replace('_', ' ')}</Badge>
                            {activeBids > 0 && (
                              <Badge variant="outline" className="bg-accent/10">
                                {activeBids} new bid{activeBids > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {unreadMessages > 0 && (
                              <Badge variant="outline" className="bg-primary/10">
                                <ChatCircle className="w-3 h-3 mr-1" weight="fill" />
                                {unreadMessages}
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
                              <Users className="w-4 h-4" />
                              <span>{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <ChatCircle className="w-4 h-4" />
                              <span>{job.messages.length} message{job.messages.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground mb-1">Budget</p>
                          <p className="text-2xl font-bold text-accent font-mono">
                            ${job.estimatedCost.min.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            - ${job.estimatedCost.max.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
                <h4 className="text-lg font-semibold mb-2">No Active Projects</h4>
                <p className="text-muted-foreground">Start a new project to see it here</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeJobs.map(job => (
                  <Card 
                    key={job.id} 
                    className="p-6 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <Badge>{job.status.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                          <span>{job.bids.length} bids received</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-accent font-mono">
                          ${job.estimatedCost.min.toLocaleString()}
                        </p>
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
                <h4 className="text-lg font-semibold mb-2">No Completed Projects</h4>
                <p className="text-muted-foreground">Completed projects will appear here</p>
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
                            <span className="text-accent font-semibold">Rated {job.rating.overallScore}/100</span>
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
        </Tabs>
      </div>

      {showNewJob && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <Button variant="ghost" onClick={() => setShowNewJob(false)}>
                  Close
                </Button>
              </div>
              <VideoUploader homeownerId={user.id} onJobCreated={() => {
                setShowNewJob(false);
                loadData();
              }} />
            </div>
          </div>
        </div>
      )}

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
