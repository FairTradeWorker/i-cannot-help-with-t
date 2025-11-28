// Activity Feed - Real-time dashboard activity notifications
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  Clock,
  User,
  Briefcase,
  CurrencyDollar,
  ChatCircle,
  Star,
  MapTrifold,
  Warning,
  Info,
  ArrowRight,
  Funnel,
  X,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  type: 'job' | 'bid' | 'payment' | 'message' | 'review' | 'territory' | 'milestone' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actor?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    amount?: number;
    rating?: number;
    jobTitle?: string;
    status?: string;
  };
}

// Sample activity data
const generateSampleActivities = (): ActivityItem[] => [
  {
    id: 'a1',
    type: 'bid',
    title: 'New Bid Received',
    description: 'Premier Renovations submitted a bid of $12,500 for your Kitchen Remodel project',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    actor: { name: 'Premier Renovations' },
    metadata: { amount: 12500, jobTitle: 'Kitchen Remodel' },
  },
  {
    id: 'a2',
    type: 'message',
    title: 'New Message',
    description: 'Mike Johnson sent you a message about the Roof Repair project',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    actor: { name: 'Mike Johnson' },
    metadata: { jobTitle: 'Roof Repair' },
  },
  {
    id: 'a3',
    type: 'payment',
    title: 'Payment Received',
    description: 'You received a milestone payment of $3,500',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    metadata: { amount: 3500, jobTitle: 'HVAC Installation' },
  },
  {
    id: 'a4',
    type: 'review',
    title: 'New Review',
    description: 'Sarah M. left a 5-star review for your recent work',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    actor: { name: 'Sarah M.' },
    metadata: { rating: 98 },
  },
  {
    id: 'a5',
    type: 'job',
    title: 'Job Status Updated',
    description: 'Your Kitchen Remodel project has moved to "In Progress"',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
    metadata: { jobTitle: 'Kitchen Remodel', status: 'In Progress' },
  },
  {
    id: 'a6',
    type: 'territory',
    title: 'Territory Update',
    description: '3 new zip codes available in your area (78731, 78732, 78733)',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'a7',
    type: 'milestone',
    title: 'Milestone Completed',
    description: 'Demolition phase marked as complete for Bathroom Renovation',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    metadata: { jobTitle: 'Bathroom Renovation' },
  },
  {
    id: 'a8',
    type: 'system',
    title: 'Profile Verified',
    description: 'Your contractor license has been verified successfully',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'a9',
    type: 'bid',
    title: 'Bid Accepted',
    description: 'Your bid for the Plumbing Repair project has been accepted!',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    read: true,
    metadata: { amount: 2800, jobTitle: 'Plumbing Repair' },
  },
];

const getActivityIcon = (type: ActivityItem['type']) => {
  const iconClass = 'w-5 h-5';
  switch (type) {
    case 'job':
      return <Briefcase className={iconClass} />;
    case 'bid':
      return <CurrencyDollar className={iconClass} />;
    case 'payment':
      return <CurrencyDollar className={iconClass} />;
    case 'message':
      return <ChatCircle className={iconClass} />;
    case 'review':
      return <Star className={iconClass} />;
    case 'territory':
      return <MapTrifold className={iconClass} />;
    case 'milestone':
      return <CheckCircle className={iconClass} />;
    case 'system':
      return <Info className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const getActivityColor = (type: ActivityItem['type']) => {
  switch (type) {
    case 'job':
      return 'bg-primary/10 text-primary';
    case 'bid':
      return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
    case 'payment':
      return 'bg-accent/10 text-accent';
    case 'message':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
    case 'review':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
    case 'territory':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
    case 'milestone':
      return 'bg-secondary/10 text-secondary';
    case 'system':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

interface ActivityFeedProps {
  userId?: string;
  compact?: boolean;
  maxItems?: number;
}

export function ActivityFeed({ userId, compact = false, maxItems }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>(generateSampleActivities());
  const [filter, setFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const unreadCount = activities.filter(a => !a.read).length;

  const filteredActivities = activities.filter(a => 
    filter === 'all' || a.type === filter
  );

  const displayedActivities = maxItems && !showAll 
    ? filteredActivities.slice(0, maxItems) 
    : filteredActivities;

  const markAsRead = (id: string) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const markAllAsRead = () => {
    setActivities(activities.map(a => ({ ...a, read: true })));
    toast.success('All notifications marked as read');
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add a new activity occasionally
      if (Math.random() > 0.9) {
        const types: ActivityItem['type'][] = ['job', 'bid', 'message'];
        const type = types[Math.floor(Math.random() * types.length)];
        const newActivity: ActivityItem = {
          id: `a-${Date.now()}`,
          type,
          title: type === 'job' ? 'New Job Posted' : type === 'bid' ? 'New Bid Received' : 'New Message',
          description: `You have a new ${type} notification`,
          timestamp: new Date(),
          read: false,
        };
        setActivities(prev => [newActivity, ...prev]);
        toast.info(newActivity.title, { description: newActivity.description });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Activity
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayedActivities.map(activity => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 p-2 rounded-lg transition-colors cursor-pointer hover:bg-muted/50 ${
                  !activity.read ? 'bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(activity.id)}
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${!activity.read ? 'font-semibold' : ''}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
                {!activity.read && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
          {maxItems && filteredActivities.length > maxItems && !showAll && (
            <Button 
              variant="ghost" 
              className="w-full mt-4"
              onClick={() => setShowAll(true)}
            >
              View All Activity
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary">
              <Bell className="w-8 h-8 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Activity Feed</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Funnel className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
                <SelectItem value="bid">Bids</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Activity List */}
      <Card>
        <ScrollArea className="h-[600px]">
          <div className="p-4 space-y-2">
            <AnimatePresence>
              {displayedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    !activity.read ? 'bg-primary/5 border-primary/20' : ''
                  }`}
                  onClick={() => markAsRead(activity.id)}
                >
                  <div className={`p-3 rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold ${!activity.read ? 'text-foreground' : 'text-foreground'}`}>
                        {activity.title}
                      </h4>
                      {!activity.read && (
                        <Badge variant="default" className="h-5 text-[10px]">New</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{activity.description}</p>
                    
                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="flex items-center gap-4 mt-2">
                        {activity.metadata.amount && (
                          <Badge variant="secondary">
                            <CurrencyDollar className="w-3 h-3 mr-1" />
                            ${activity.metadata.amount.toLocaleString()}
                          </Badge>
                        )}
                        {activity.metadata.rating && (
                          <Badge variant="secondary">
                            <Star className="w-3 h-3 mr-1 text-amber-500" weight="fill" />
                            {activity.metadata.rating}/100
                          </Badge>
                        )}
                        {activity.metadata.status && (
                          <Badge variant="outline">{activity.metadata.status}</Badge>
                        )}
                      </div>
                    )}

                    {/* Actor */}
                    {activity.actor && (
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={activity.actor.avatar} />
                          <AvatarFallback className="text-xs">{activity.actor.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{activity.actor.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                    <Button variant="ghost" size="sm">
                      View
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {displayedActivities.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Activity</h3>
                <p className="text-muted-foreground">
                  {filter !== 'all' ? 'No activity matches your filter' : 'Your activity feed is empty'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
