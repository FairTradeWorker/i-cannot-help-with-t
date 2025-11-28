import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Plus, MapPin, Clock, CheckCircle, Users, ChatCircle, UserCircle, Package, Briefcase, Camera, X } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickJobPost } from './QuickJobPost';
import { HomeownerProfileForm } from './HomeownerProfileForm';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import type { User } from '@/lib/types';

interface HomeownerDashboardProps {
  user: User;
  activeSubTab?: string | null;
}

interface MockJob {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  estimatedCost: {
    min: number;
    max: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  bids: number;
  messages: number;
}

export function HomeownerDashboard({ user, activeSubTab }: HomeownerDashboardProps) {
  const [activeTab, setActiveTab] = useState(activeSubTab === 'profile' ? 'profile' : activeSubTab === 'post-job' ? 'post-job' : 'my-jobs');
  const [jobs, setJobs] = useKV<MockJob[]>('homeowner-jobs', []);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'profile') setActiveTab('profile');
      else if (activeSubTab === 'post-job') setActiveTab('post-job');
      else if (activeSubTab === 'my-jobs') setActiveTab('my-jobs');
    }
  }, [activeSubTab]);

  const myJobs = jobs || [];
  const activeJobs = myJobs.filter(j => j.status === 'posted' || j.status === 'bidding' || j.status === 'assigned' || j.status === 'in_progress');
  const completedJobs = myJobs.filter(j => j.status === 'completed');

  const handleCreateJob = (type: 'video' | 'photo' | 'text') => {
    if (type === 'video') {
      setShowNewJobModal(true);
    } else if (type === 'photo') {
      toast.info('Photo job posting coming soon!');
    } else {
      toast.info('Text job posting coming soon!');
    }
  };

  const handleJobCreated = (jobData: { title: string; description: string }) => {
    const newJob: MockJob = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'New Roofing Project',
      description: jobData.description || 'Roofing repair and inspection needed',
      status: 'posted',
      createdAt: new Date(),
      estimatedCost: {
        min: 2500,
        max: 4500,
      },
      address: {
        street: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94103',
      },
      bids: 0,
      messages: 0,
    };

    setJobs((currentJobs) => {
      if (!currentJobs) return [newJob];
      return [...currentJobs, newJob];
    });

    setShowNewJobModal(false);
    toast.success('Job created successfully!');
    setActiveTab('my-jobs');
  };

  const selectedJob = myJobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Manage your home improvement projects</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassSurface
            id="homeowner-active-projects"
            context={{
              ...getDefaultGlassContext(),
              serviceCategory: 'jobs',
              urgency: activeJobs.length > 0 ? 'medium' : 'low',
              confidence: 0.9
            }}
          >
            <Card className="p-6 border-0 bg-transparent">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span>Active Projects</span>
              </div>
              <p className="text-3xl font-bold text-primary font-mono">{activeJobs.length}</p>
            </Card>
          </GlassSurface>

          <GlassSurface
            id="homeowner-completed-projects"
            context={{
              ...getDefaultGlassContext(),
              serviceCategory: 'jobs',
              completion: 1,
              confidence: 0.95
            }}
          >
            <Card className="p-6 border-0 bg-transparent">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <CheckCircle className="w-4 h-4" />
                <span>Completed Projects</span>
              </div>
              <p className="text-3xl font-bold text-secondary font-mono">{completedJobs.length}</p>
            </Card>
          </GlassSurface>

          <GlassSurface
            id="homeowner-total-jobs"
            context={{
              ...getDefaultGlassContext(),
              serviceCategory: 'jobs',
              confidence: 0.9
            }}
          >
            <Card className="p-6 border-0 bg-transparent">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Users className="w-4 h-4" />
                <span>Total Jobs</span>
              </div>
              <p className="text-3xl font-bold text-foreground font-mono">{myJobs.length}</p>
            </Card>
          </GlassSurface>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
            <TabsTrigger value="profile">
              <UserCircle className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="my-jobs">
              <Package className="w-4 h-4 mr-2" />
              Job Status
            </TabsTrigger>
            <TabsTrigger value="post-job">
              <Briefcase className="w-4 h-4 mr-2" />
              Post a Job
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <HomeownerProfileForm />
          </TabsContent>

          <TabsContent value="my-jobs">
            {myJobs.length === 0 ? (
              <GlassSurface
                id="homeowner-no-jobs"
                context={getDefaultGlassContext()}
              >
                <Card className="p-12 text-center border-0 bg-transparent">
                  <div className="max-w-md mx-auto">
                    <Clock className="w-20 h-20 text-muted-foreground mx-auto mb-4" weight="duotone" />
                    <h4 className="text-2xl font-semibold mb-2">No Projects Yet</h4>
                    <p className="text-muted-foreground mb-6">
                      Start your first home improvement project. Upload a video and get instant AI-powered estimates from qualified contractors.
                    </p>
                    <Button size="lg" onClick={() => setActiveTab('post-job')}>
                      <Plus className="w-5 h-5 mr-2" weight="bold" />
                      Create Your First Project
                    </Button>
                  </div>
                </Card>
              </GlassSurface>
            ) : (
              <div className="space-y-4">
                {myJobs.map((job, index) => {
                  const activeBids = job.bids || 0;
                  const unreadMessages = job.messages || 0;
                  
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <GlassSurface
                        id={`homeowner-job-${job.id}`}
                        context={{
                          ...getDefaultGlassContext(),
                          serviceCategory: 'jobs',
                          urgency: activeBids > 0 || unreadMessages > 0 ? 'medium' : 'low',
                          confidence: 0.8
                        }}
                        onClick={() => setSelectedJobId(job.id)}
                        className="cursor-pointer"
                      >
                        <Card 
                          className="p-6 border-0 bg-transparent hover:bg-transparent"
                        >
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold">{job.title}</h3>
                              <Badge variant="secondary">{job.status.replace('_', ' ')}</Badge>
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
                                <span>{job.bids} bid{job.bids !== 1 ? 's' : ''}</span>
                              </div>
                              
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <ChatCircle className="w-4 h-4" />
                                <span>{job.messages} message{job.messages !== 1 ? 's' : ''}</span>
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
                      </GlassSurface>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="post-job">
            <QuickJobPost onCreateJob={handleCreateJob} />
          </TabsContent>
        </Tabs>
      </motion.div>

      {showNewJobModal && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
          >
            <GlassSurface
              id="homeowner-video-job-modal"
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: 'jobs',
                urgency: 'medium'
              }}
              className="border-2"
            >
              <Card className="border-0 bg-transparent">
                <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Create Video Job Post</h2>
                    <p className="text-muted-foreground text-sm mt-1">Upload a video to get AI-powered estimates</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowNewJobModal(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-muted-foreground" weight="duotone" />
                    <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Record or upload a 30-60 second video showing the work needed
                    </p>
                    <Button size="lg" onClick={() => handleJobCreated({ title: 'Sample Roofing Project', description: 'Need roof inspection and repair' })}>
                      <Camera className="w-5 h-5 mr-2" />
                      Select Video File
                    </Button>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <h4 className="font-semibold text-sm">Tips for best results:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                      <li>Show all angles of the work area</li>
                      <li>Narrate what needs to be done</li>
                      <li>Include any existing damage or issues</li>
                      <li>Keep video under 60 seconds</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
            </GlassSurface>
          </motion.div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-4xl"
          >
            <Card className="glass-card border-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                    <Badge variant="secondary" className="mt-2">{selectedJob.status.replace('_', ' ')}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedJobId(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground">{selectedJob.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedJob.address.street}</span>
                      </div>
                      <div className="text-muted-foreground ml-6">
                        {selectedJob.address.city}, {selectedJob.address.state} {selectedJob.address.zip}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Budget Range</h3>
                      <p className="text-2xl font-bold text-accent font-mono">
                        ${selectedJob.estimatedCost.min.toLocaleString()} - ${selectedJob.estimatedCost.max.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Bids Received</h3>
                    {selectedJob.bids === 0 ? (
                      <Card className="p-8 text-center">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" weight="duotone" />
                        <p className="text-muted-foreground">No bids yet. Check back soon!</p>
                      </Card>
                    ) : (
                      <p className="text-muted-foreground">{selectedJob.bids} contractor{selectedJob.bids > 1 ? 's have' : ' has'} submitted bids</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            </GlassSurface>
          </motion.div>
        </div>
      )}
    </div>
  );
}
