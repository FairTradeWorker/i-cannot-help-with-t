import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { motion } from 'framer-motion';
import {
  BellRinging,
  CheckCircle,
  Info,
  Warning,
  Star,
  CurrencyDollar,
  Hammer,
  ChatCircle,
  Calendar,
  Trash,
  DotsThree,
} from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'message' | 'payment' | 'job';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'job',
    title: 'New Job Estimate Received',
    message: 'Elite Home Services sent you an estimate of $2,450 for Kitchen Renovation',
    timestamp: '5 minutes ago',
    read: false,
    actionLabel: 'View Estimate',
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Quick Fix Plumbing replied to your inquiry about bathroom repairs',
    timestamp: '1 hour ago',
    read: false,
    actionLabel: 'Open Chat',
  },
  {
    id: '3',
    type: 'success',
    title: 'Job Completed',
    message: 'Your HVAC Installation job has been marked as complete',
    timestamp: '2 hours ago',
    read: true,
    actionLabel: 'Leave Review',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Processed',
    message: 'Payment of $1,200 has been successfully processed',
    timestamp: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    title: 'Territory Available',
    message: 'New territory opened in your area: Roofing - ZIP 90210',
    timestamp: '1 day ago',
    read: true,
    actionLabel: 'View Territory',
  },
  {
    id: '6',
    type: 'warning',
    title: 'Estimate Expiring Soon',
    message: 'Your estimate for Deck Repair expires in 2 days',
    timestamp: '1 day ago',
    read: true,
    actionLabel: 'Review Now',
  },
  {
    id: '7',
    type: 'job',
    title: 'Job Posted Successfully',
    message: 'Your Roof Repair job is now live and visible to contractors',
    timestamp: '2 days ago',
    read: true,
  },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useKV<Notification[]>('notifications', initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = (notifications || []).filter((n) => 
    filter === 'all' ? true : !n.read
  );

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" weight="fill" />;
      case 'warning':
        return <Warning className="w-5 h-5" weight="fill" />;
      case 'message':
        return <ChatCircle className="w-5 h-5" weight="fill" />;
      case 'payment':
        return <CurrencyDollar className="w-5 h-5" weight="fill" />;
      case 'job':
        return <Hammer className="w-5 h-5" weight="fill" />;
      default:
        return <Info className="w-5 h-5" weight="fill" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success bg-success/10';
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'message':
        return 'text-accent bg-accent/10';
      case 'payment':
        return 'text-secondary bg-secondary/10';
      case 'job':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((current) =>
      (current || []).map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) => (current || []).map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    setNotifications((current) => (current || []).filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary">
            <BellRinging className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Notifications</h2>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {(notifications || []).length > 0 && (
            <Button variant="outline" onClick={clearAll}>
              <Trash className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Tabs value={filter} onValueChange={(val) => setFilter(val as any)} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            All Notifications ({(notifications || []).length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="py-16 text-center">
                <BellRinging className="w-16 h-16 mx-auto mb-4 text-muted-foreground" weight="duotone" />
                <h3 className="text-xl font-bold mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' ? "You're all caught up!" : 'Notifications will appear here'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-20rem)]">
              <div className="space-y-3">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`glass-card transition-all hover:shadow-md cursor-pointer ${
                        !notification.read ? 'border-2 border-primary/30 bg-primary/5' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${getIconColor(notification.type)}`}>
                            {getIcon(notification.type)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{notification.title}</h4>
                                {!notification.read && (
                                  <Badge variant="default" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {notification.timestamp}
                                </span>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <DotsThree className="w-4 h-4" weight="bold" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-destructive"
                                    >
                                      <Trash className="w-4 h-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {notification.message}
                            </p>
                            {notification.actionLabel && (
                              <Button variant="outline" size="sm">
                                {notification.actionLabel}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
