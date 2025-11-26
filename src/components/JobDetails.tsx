import { useState } from 'react';
import { X, MapPin, Clock, CurrencyDollar, ChatCircle, PaperPlane, Calendar, CheckCircle, Package, Toolbox } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { dataStore } from '@/lib/store';
import { JobFeedbackModal } from '@/components/JobFeedbackModal';
import type { Job, User, Bid, Message } from '@/lib/types';

interface JobDetailsProps {
  job: Job;
  user: User;
  onClose: () => void;
  onJobUpdated: () => void;
}

export function JobDetails({ job, user, onClose, onJobUpdated }: JobDetailsProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [bidAmount, setBidAmount] = useState(job.estimatedCost.min.toString());
  const [bidMessage, setBidMessage] = useState('');
  const [bidTimeline, setBidTimeline] = useState({ start: '', end: '' });
  const [messageText, setMessageText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actualCost, setActualCost] = useState('');
  const [actualMaterialsCost, setActualMaterialsCost] = useState('');
  const [actualLaborHours, setActualLaborHours] = useState('');
  const [showCompletionForm, setShowCompletionForm] = useState(false);

  const isContractor = user.role === 'contractor';
  const isHomeowner = user.role === 'homeowner';
  const hasMyBid = job.bids.some(b => b.contractorId === user.id);
  const myBid = job.bids.find(b => b.contractorId === user.id);
  const isMyJob = job.contractorId === user.id;

  const handleSubmitBid = async () => {
    if (!bidAmount || !bidMessage || !bidTimeline.start || !bidTimeline.end) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const bid: Bid = {
        id: 'bid-' + Date.now(),
        jobId: job.id,
        contractorId: user.id,
        contractor: {
          name: user.name,
          rating: user.contractorProfile?.rating || 0,
          completedJobs: user.contractorProfile?.completedJobs || 0,
          avatar: user.avatar,
          hourlyRate: user.contractorProfile?.hourlyRate || 0
        },
        amount: parseFloat(bidAmount),
        timeline: {
          start: new Date(bidTimeline.start),
          end: new Date(bidTimeline.end)
        },
        message: bidMessage,
        status: 'pending',
        createdAt: new Date()
      };

      await dataStore.addBidToJob(job.id, bid);
      
      await dataStore.addNotification({
        id: 'notif-' + Date.now(),
        userId: job.homeownerId,
        type: 'bid_received',
        title: 'New Bid Received',
        message: `${user.name} submitted a bid of $${bidAmount} for "${job.title}"`,
        data: { jobId: job.id, bidId: bid.id },
        read: false,
        createdAt: new Date()
      });

      toast.success('Bid submitted successfully!');
      onJobUpdated();
      onClose();
    } catch (error) {
      toast.error('Failed to submit bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptBid = async (bidId: string) => {
    setSubmitting(true);
    try {
      await dataStore.acceptBid(job.id, bidId);
      
      const acceptedBid = job.bids.find(b => b.id === bidId);
      if (acceptedBid) {
        await dataStore.addNotification({
          id: 'notif-' + Date.now(),
          userId: acceptedBid.contractorId,
          type: 'bid_accepted',
          title: 'Bid Accepted!',
          message: `Your bid of $${acceptedBid.amount} for "${job.title}" was accepted!`,
          data: { jobId: job.id },
          read: false,
          createdAt: new Date()
        });
      }

      toast.success('Bid accepted! Job assigned to contractor.');
      onJobUpdated();
      onClose();
    } catch (error) {
      toast.error('Failed to accept bid');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const message: Message = {
        id: 'msg-' + Date.now(),
        jobId: job.id,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        content: messageText,
        timestamp: new Date(),
        read: false
      };

      await dataStore.addMessageToJob(job.id, message);
      setMessageText('');
      toast.success('Message sent');
      onJobUpdated();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleMarkComplete = async () => {
    if (!actualCost || !actualMaterialsCost || !actualLaborHours) {
      toast.error('Please fill in all completion details');
      return;
    }

    setSubmitting(true);
    try {
      const updatedJob = await dataStore.getJobById(job.id);
      if (!updatedJob) throw new Error('Job not found');

      updatedJob.status = 'completed';
      updatedJob.completedAt = new Date();
      updatedJob.actualCost = parseFloat(actualCost);
      updatedJob.updatedAt = new Date();

      await dataStore.saveJob(updatedJob);

      toast.success('Job marked as completed!');
      setShowCompletionForm(false);
      
      if (job.scope) {
        setShowFeedbackModal(true);
      } else {
        onJobUpdated();
        onClose();
      }
    } catch (error) {
      console.error('Failed to mark job complete:', error);
      toast.error('Failed to mark job as complete');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    onJobUpdated();
    onClose();
  };

  const handleStartJob = async () => {
    setSubmitting(true);
    try {
      const updatedJob = await dataStore.getJobById(job.id);
      if (!updatedJob) throw new Error('Job not found');

      updatedJob.status = 'in_progress';
      updatedJob.updatedAt = new Date();

      await dataStore.saveJob(updatedJob);
      toast.success('Job started!');
      onJobUpdated();
    } catch (error) {
      console.error('Failed to start job:', error);
      toast.error('Failed to start job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="bids">
              Bids ({job.bids.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({job.messages.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {job.videoUrl && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                      src={job.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                      poster={job.videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>

                {job.scope && (
                  <Card className="p-5 bg-accent/5 border-accent/30">
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" weight="fill" />
                      Scope of Service
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Summary</p>
                        <p className="text-xs leading-relaxed">{job.scope.summary}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-xs font-semibold mb-2">Estimated Cost Range</p>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Minimum</span>
                            <span className="font-mono font-semibold">${job.scope.estimatedCost.min.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Maximum</span>
                            <span className="font-mono font-semibold">${job.scope.estimatedCost.max.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Labor Hours</span>
                            <span className="font-mono font-semibold">{job.scope.laborHours}h</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Sq. Footage</span>
                            <span className="font-mono font-semibold">{job.scope.estimatedSquareFootage} ft²</span>
                          </div>
                        </div>
                      </div>
                      
                      {job.scope.materials.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold mb-2">Materials ({job.scope.materials.length})</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {job.scope.materials.slice(0, 3).map((m, i) => (
                                <div key={i} className="text-[10px] text-muted-foreground flex justify-between">
                                  <span>• {m.name}</span>
                                  <span>${m.estimatedCost}</span>
                                </div>
                              ))}
                              {job.scope.materials.length > 3 && (
                                <p className="text-[10px] text-muted-foreground italic">+{job.scope.materials.length - 3} more</p>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {isContractor && !hasMyBid && job.status === 'posted' && (
                        <>
                          <Separator />
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => {
                              const element = document.getElementById('bid-section');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            Submit Bid
                          </Button>
                        </>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{job.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {job.address.street}, {job.address.city}, {job.address.state} {job.address.zip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estimated Time</p>
                      <p className="text-sm text-muted-foreground">{job.laborHours} hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <CurrencyDollar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Budget Range</p>
                      <p className="text-sm text-muted-foreground">
                        ${job.estimatedCost.min.toLocaleString()} - ${job.estimatedCost.max.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Status</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Current Status</p>
                    <Badge>{job.status.replace('_', ' ')}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Urgency</p>
                    <Badge variant={job.urgency === 'emergency' ? 'destructive' : 'secondary'}>
                      {job.urgency}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Posted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {job.scope && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3">AI-Generated Scope</h3>
                  <p className="text-sm text-muted-foreground mb-4">{job.scope.summary}</p>
                  
                  {job.scope.materials.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Materials Needed:</p>
                      <div className="space-y-1">
                        {job.scope.materials.map((m, i) => (
                          <div key={i} className="text-sm text-muted-foreground">
                            • {m.name} - {m.quantity} {m.unit} (${m.estimatedCost})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {isContractor && !hasMyBid && job.status === 'posted' && (
              <>
                <Separator />
                <Card className="p-6 bg-accent/5" id="bid-section">
                  <h3 className="text-lg font-semibold mb-4">Submit Your Bid</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bidAmount">Bid Amount ($)</Label>
                      <Input
                        id="bidAmount"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bidTimeline.start}
                          onChange={(e) => setBidTimeline({ ...bidTimeline, start: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={bidTimeline.end}
                          onChange={(e) => setBidTimeline({ ...bidTimeline, end: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="bidMessage">Message to Homeowner</Label>
                      <Textarea
                        id="bidMessage"
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="Describe your approach, experience with similar jobs, etc."
                        rows={4}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSubmitBid} 
                      disabled={submitting}
                      className="w-full"
                      size="lg"
                    >
                      {submitting ? 'Submitting...' : 'Submit Bid'}
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {hasMyBid && myBid && (
              <>
                <Separator />
                <Card className="p-6 bg-primary/5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-primary" weight="fill" />
                    <h3 className="text-lg font-semibold">Your Bid</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold font-mono">${myBid.amount.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{myBid.message}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Start: {new Date(myBid.timeline.start).toLocaleDateString()}</span>
                      <span>End: {new Date(myBid.timeline.end).toLocaleDateString()}</span>
                    </div>
                    <Badge>{myBid.status}</Badge>
                  </div>
                </Card>
              </>
            )}

            {isContractor && isMyJob && job.status === 'assigned' && (
              <>
                <Separator />
                <Card className="p-6 bg-secondary/5 border-secondary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Ready to Start?</h3>
                      <p className="text-sm text-muted-foreground">
                        Begin working on this job
                      </p>
                    </div>
                    <Button onClick={handleStartJob} disabled={submitting} size="lg" variant="secondary">
                      <Toolbox className="w-5 h-5 mr-2" weight="fill" />
                      Start Job
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {isContractor && isMyJob && (job.status === 'assigned' || job.status === 'in_progress') && !showCompletionForm && (
              <>
                <Separator />
                <Card className="p-6 bg-accent/5 border-accent/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Ready to Complete?</h3>
                      <p className="text-sm text-muted-foreground">
                        Mark this job as complete and provide feedback to help AI learn
                      </p>
                    </div>
                    <Button onClick={() => setShowCompletionForm(true)} size="lg">
                      <CheckCircle className="w-5 h-5 mr-2" weight="fill" />
                      Mark Complete
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {showCompletionForm && (
              <>
                <Separator />
                <Card className="p-6 bg-accent/5">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Toolbox className="w-5 h-5 text-accent" weight="duotone" />
                    Job Completion Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="actualCost">Final Total Cost ($)</Label>
                      <Input
                        id="actualCost"
                        type="number"
                        value={actualCost}
                        onChange={(e) => setActualCost(e.target.value)}
                        placeholder="5000"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Total amount charged to customer
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="actualMaterialsCost">Materials Cost ($)</Label>
                      <Input
                        id="actualMaterialsCost"
                        type="number"
                        value={actualMaterialsCost}
                        onChange={(e) => setActualMaterialsCost(e.target.value)}
                        placeholder="2000"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Total spent on materials for this job
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="actualLaborHours">Actual Labor Hours</Label>
                      <Input
                        id="actualLaborHours"
                        type="number"
                        value={actualLaborHours}
                        onChange={(e) => setActualLaborHours(e.target.value)}
                        placeholder="24"
                        className="font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Total hours worked on this job
                      </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCompletionForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleMarkComplete}
                        disabled={submitting || !actualCost || !actualMaterialsCost || !actualLaborHours}
                        className="flex-1"
                      >
                        {submitting ? 'Completing...' : 'Complete Job'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            {job.bids.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No bids yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {job.bids.map(bid => (
                  <Card key={bid.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{bid.contractor.name}</h4>
                          <Badge variant={bid.status === 'accepted' ? 'default' : 'secondary'}>
                            {bid.status}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4" />
                            <span>{bid.contractor.completedJobs} jobs</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>★ {bid.contractor.rating}/100</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{bid.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Start: {new Date(bid.timeline.start).toLocaleDateString()}</span>
                          <span>End: {new Date(bid.timeline.end).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-6">
                        <p className="text-2xl font-bold font-mono mb-2">${bid.amount.toLocaleString()}</p>
                        {isHomeowner && bid.status === 'pending' && job.status === 'posted' && (
                          <Button onClick={() => handleAcceptBid(bid.id)} disabled={submitting}>
                            Accept Bid
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="messages" className="space-y-4">
            <Card className="p-4 max-h-96 overflow-y-auto">
              {job.messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No messages yet</p>
              ) : (
                <div className="space-y-4">
                  {job.messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`p-3 rounded-lg ${
                        msg.senderId === user.id 
                          ? 'bg-primary/10 ml-8' 
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{msg.senderName}</span>
                        <Badge variant="outline" className="text-xs">{msg.senderRole}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={3}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon" className="flex-shrink-0">
                  <PaperPlane className="w-5 h-5" weight="fill" />
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>

      {showFeedbackModal && job.scope && (
        <JobFeedbackModal
          open={showFeedbackModal}
          onClose={handleFeedbackClose}
          job={job}
          prediction={job.scope}
          actualCost={parseFloat(actualCost)}
          actualMaterialsCost={parseFloat(actualMaterialsCost)}
          actualLaborHours={parseFloat(actualLaborHours)}
        />
      )}
    </Dialog>
  );
}
