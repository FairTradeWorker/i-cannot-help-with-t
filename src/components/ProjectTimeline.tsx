// Project Timeline Component - Visual progress tracking for jobs
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Circle,
  Clock,
  User,
  Hammer,
  Package,
  CurrencyDollar,
  Camera,
  ChatCircle,
  ArrowRight,
  CalendarBlank,
  Warning,
  Star,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming' | 'blocked';
  completedDate?: Date;
  estimatedDate?: Date;
  amount?: number;
  photos?: string[];
  notes?: string;
}

interface ProjectTimelineProps {
  jobId: string;
  jobTitle: string;
  contractor?: {
    name: string;
    avatar?: string;
    rating: number;
  };
  milestones: Milestone[];
  totalBudget: number;
  paidAmount: number;
  startDate: Date;
  estimatedEndDate: Date;
  onAddUpdate?: () => void;
  onMessageContractor?: () => void;
  onReleaseMilestone?: (milestoneId: string) => void;
}

// Sample milestones for demonstration
const sampleMilestones: Milestone[] = [
  {
    id: 'm1',
    title: 'Project Kickoff',
    description: 'Initial assessment and materials ordering',
    status: 'completed',
    completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    amount: 1500,
  },
  {
    id: 'm2',
    title: 'Demolition & Prep',
    description: 'Remove old fixtures and prepare workspace',
    status: 'completed',
    completedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    amount: 2000,
  },
  {
    id: 'm3',
    title: 'Main Installation',
    description: 'Install new roofing materials',
    status: 'current',
    estimatedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    amount: 5000,
  },
  {
    id: 'm4',
    title: 'Finishing Work',
    description: 'Final touches and cleanup',
    status: 'upcoming',
    estimatedDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    amount: 1500,
  },
  {
    id: 'm5',
    title: 'Final Inspection',
    description: 'Walkthrough and approval',
    status: 'upcoming',
    estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    amount: 0,
  },
];

export function ProjectTimeline({
  jobId = 'sample-job',
  jobTitle = 'Roof Replacement Project',
  contractor = { name: 'Mike Johnson', rating: 96 },
  milestones = sampleMilestones,
  totalBudget = 10000,
  paidAmount = 3500,
  startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  estimatedEndDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  onAddUpdate,
  onMessageContractor,
  onReleaseMilestone,
}: Partial<ProjectTimelineProps>) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const progressPercentage = (completedMilestones / milestones.length) * 100;
  const paymentPercentage = (paidAmount / totalBudget) * 100;

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" weight="fill" />;
      case 'current':
        return <Clock className="w-6 h-6 text-primary animate-pulse" weight="fill" />;
      case 'blocked':
        return <Warning className="w-6 h-6 text-destructive" weight="fill" />;
      default:
        return <Circle className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'current':
        return 'bg-primary';
      case 'blocked':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    const diff = estimatedEndDate.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">{jobTitle}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarBlank className="w-4 h-4" />
                  Started: {formatDate(startDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {getDaysRemaining()} days remaining
                </span>
              </div>
            </div>
            {contractor && (
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={contractor.avatar} />
                  <AvatarFallback>{contractor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{contractor.name}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-amber-500" weight="fill" />
                    <span>{contractor.rating}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Project Progress</span>
                <span className="text-sm text-muted-foreground">{completedMilestones}/{milestones.length} milestones</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPercentage)}% complete</p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Payment Released</span>
                <span className="text-sm text-muted-foreground">${paidAmount.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
              </div>
              <Progress value={paymentPercentage} className="h-3 bg-muted [&>div]:bg-accent" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(paymentPercentage)}% paid</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={onMessageContractor}>
              <ChatCircle className="w-4 h-4 mr-2" />
              Message Contractor
            </Button>
            <Button variant="outline" onClick={onAddUpdate}>
              <Camera className="w-4 h-4 mr-2" />
              Add Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-border" />

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex gap-4">
                    {/* Status indicator */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-background border-2 ${
                        milestone.status === 'completed' ? 'border-green-500' :
                        milestone.status === 'current' ? 'border-primary' :
                        milestone.status === 'blocked' ? 'border-destructive' : 'border-muted'
                      }`}>
                        {getStatusIcon(milestone.status)}
                      </div>
                    </div>

                    {/* Content */}
                    <div 
                      className={`flex-1 p-4 rounded-lg border transition-all cursor-pointer ${
                        expandedMilestone === milestone.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setExpandedMilestone(
                        expandedMilestone === milestone.id ? null : milestone.id
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge variant={
                              milestone.status === 'completed' ? 'default' :
                              milestone.status === 'current' ? 'secondary' :
                              milestone.status === 'blocked' ? 'destructive' : 'outline'
                            }>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        </div>
                        <div className="text-right">
                          {milestone.amount && milestone.amount > 0 && (
                            <p className="font-bold">${milestone.amount.toLocaleString()}</p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {milestone.completedDate ? formatDate(milestone.completedDate) : 
                             milestone.estimatedDate ? `Est. ${formatDate(milestone.estimatedDate)}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Expanded content */}
                      {expandedMilestone === milestone.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t"
                        >
                          {milestone.notes && (
                            <p className="text-sm text-muted-foreground mb-4">{milestone.notes}</p>
                          )}
                          
                          {milestone.status === 'current' && milestone.amount && (
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onReleaseMilestone?.(milestone.id);
                              }}
                            >
                              <CurrencyDollar className="w-4 h-4 mr-2" />
                              Release ${milestone.amount.toLocaleString()}
                            </Button>
                          )}
                          
                          {milestone.status === 'completed' && (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" weight="fill" />
                              Payment released on {milestone.completedDate && formatDate(milestone.completedDate)}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
