// Scheduling Calendar - Job scheduling with availability management
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  CaretLeft,
  CaretRight,
  X,
  Check,
  MapPin,
  User,
  Phone,
  Briefcase,
  Warning,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface ScheduledEvent {
  id: string;
  title: string;
  type: 'job' | 'estimate' | 'follow-up' | 'blocked';
  date: Date;
  startTime: string;
  endTime: string;
  client?: {
    name: string;
    phone?: string;
    address?: string;
  };
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
}

interface AvailabilitySlot {
  day: number; // 0-6 for Sunday-Saturday
  start: string;
  end: string;
  enabled: boolean;
}

// Sample events
const sampleEvents: ScheduledEvent[] = [
  {
    id: 'e1',
    title: 'Roof Inspection',
    type: 'estimate',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    client: { name: 'Sarah Johnson', phone: '(555) 123-4567', address: '123 Oak Lane' },
    status: 'confirmed',
  },
  {
    id: 'e2',
    title: 'Kitchen Remodel - Day 3',
    type: 'job',
    date: new Date(),
    startTime: '10:30',
    endTime: '17:00',
    client: { name: 'Mike Smith', phone: '(555) 987-6543', address: '456 Maple Ave' },
    status: 'scheduled',
    notes: 'Continuing cabinet installation',
  },
  {
    id: 'e3',
    title: 'HVAC Repair',
    type: 'job',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    startTime: '08:00',
    endTime: '12:00',
    client: { name: 'Emily Davis', address: '789 Pine St' },
    status: 'scheduled',
  },
  {
    id: 'e4',
    title: 'Follow-up Call - Johnson',
    type: 'follow-up',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '14:30',
    client: { name: 'Tom Johnson', phone: '(555) 456-7890' },
    status: 'scheduled',
  },
  {
    id: 'e5',
    title: 'Team Meeting',
    type: 'blocked',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    startTime: '08:00',
    endTime: '09:00',
    status: 'scheduled',
  },
];

const defaultAvailability: AvailabilitySlot[] = [
  { day: 0, start: '09:00', end: '17:00', enabled: false }, // Sunday
  { day: 1, start: '08:00', end: '18:00', enabled: true },  // Monday
  { day: 2, start: '08:00', end: '18:00', enabled: true },  // Tuesday
  { day: 3, start: '08:00', end: '18:00', enabled: true },  // Wednesday
  { day: 4, start: '08:00', end: '18:00', enabled: true },  // Thursday
  { day: 5, start: '08:00', end: '18:00', enabled: true },  // Friday
  { day: 6, start: '09:00', end: '14:00', enabled: true },  // Saturday
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SchedulingCalendarProps {
  userId?: string;
}

export function SchedulingCalendar({ userId }: SchedulingCalendarProps) {
  const [events, setEvents] = useState<ScheduledEvent[]>(sampleEvents);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(defaultAvailability);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  
  // New event form
  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'job' as ScheduledEvent['type'],
    startTime: '09:00',
    endTime: '17:00',
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    notes: '',
  });

  // Get current month's calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const days: (Date | null)[] = [];
    
    // Add padding for days before the month starts
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(e => 
      e.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const getEventColor = (type: ScheduledEvent['type']) => {
    switch (type) {
      case 'job': return 'bg-primary';
      case 'estimate': return 'bg-accent';
      case 'follow-up': return 'bg-secondary';
      case 'blocked': return 'bg-muted-foreground';
    }
  };

  const handleCreateEvent = () => {
    if (!selectedDate || !newEvent.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event: ScheduledEvent = {
      id: `e-${Date.now()}`,
      title: newEvent.title,
      type: newEvent.type,
      date: selectedDate,
      startTime: newEvent.startTime,
      endTime: newEvent.endTime,
      client: newEvent.clientName ? {
        name: newEvent.clientName,
        phone: newEvent.clientPhone || undefined,
        address: newEvent.clientAddress || undefined,
      } : undefined,
      notes: newEvent.notes || undefined,
      status: 'scheduled',
    };

    setEvents([...events, event]);
    setShowNewEvent(false);
    setNewEvent({
      title: '',
      type: 'job',
      startTime: '09:00',
      endTime: '17:00',
      clientName: '',
      clientPhone: '',
      clientAddress: '',
      notes: '',
    });
    toast.success('Event scheduled successfully!');
  };

  const updateEventStatus = (eventId: string, status: ScheduledEvent['status']) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, status } : e
    ));
    toast.success('Event status updated');
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
    setSelectedEvent(null);
    toast.success('Event deleted');
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

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
              <Calendar className="w-8 h-8 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Schedule</h1>
              <p className="text-muted-foreground">Manage your appointments and availability</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowAvailability(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Set Availability
            </Button>
            <Button onClick={() => setShowNewEvent(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Event
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <CaretLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <CaretRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-24" />;
                  }
                  
                  const dayEvents = getEventsForDate(date);
                  const isAvailable = availability[date.getDay()]?.enabled;
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={`h-24 p-1 border rounded-lg cursor-pointer transition-all ${
                        isSelected(date) ? 'border-primary bg-primary/5' :
                        isToday(date) ? 'border-accent bg-accent/5' :
                        !isAvailable ? 'bg-muted/30' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(date) ? 'text-accent' : ''
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-[10px] px-1 py-0.5 rounded truncate text-white ${getEventColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>Job</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-accent"></div>
                  <span>Estimate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-secondary"></div>
                  <span>Follow-up</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-muted-foreground"></div>
                  <span>Blocked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Day View / Event Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No events scheduled</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => setShowNewEvent(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map(event => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg cursor-pointer hover:border-primary/50 transition-all"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`}></div>
                            <span className="font-medium">{event.title}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(event.startTime)} - {formatTime(event.endTime)}
                          </p>
                        </div>
                        <Badge variant={
                          event.status === 'confirmed' ? 'default' :
                          event.status === 'completed' ? 'secondary' :
                          event.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {event.status}
                        </Badge>
                      </div>
                      {event.client && (
                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {event.client.name}
                          </div>
                          {event.client.address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.client.address}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* New Event Modal */}
      <AnimatePresence>
        {showNewEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewEvent(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold">Schedule Event</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowNewEvent(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <Label>Event Title *</Label>
                  <Input
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Roof Repair"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Event Type</Label>
                  <Select value={newEvent.type} onValueChange={(v) => setNewEvent({ ...newEvent, type: v as any })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="estimate">Estimate</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="blocked">Block Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Client Name</Label>
                  <Input
                    value={newEvent.clientName}
                    onChange={(e) => setNewEvent({ ...newEvent, clientName: e.target.value })}
                    placeholder="Client name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Client Phone</Label>
                  <Input
                    value={newEvent.clientPhone}
                    onChange={(e) => setNewEvent({ ...newEvent, clientPhone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    value={newEvent.clientAddress}
                    onChange={(e) => setNewEvent({ ...newEvent, clientAddress: e.target.value })}
                    placeholder="123 Main St"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Notes</Label>
                  <Textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    placeholder="Additional notes..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-6 border-t flex gap-3">
                <Button className="flex-1" onClick={handleCreateEvent}>
                  <Check className="w-4 h-4 mr-2" />
                  Schedule Event
                </Button>
                <Button variant="outline" onClick={() => setShowNewEvent(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability Modal */}
      <AnimatePresence>
        {showAvailability && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAvailability(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold">Weekly Availability</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowAvailability(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                {availability.map((slot, index) => (
                  <div key={slot.day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={slot.enabled}
                        onCheckedChange={(checked) => {
                          const newAvailability = [...availability];
                          newAvailability[index] = { ...slot, enabled: checked };
                          setAvailability(newAvailability);
                        }}
                      />
                      <span className="font-medium w-24">{fullDayNames[slot.day]}</span>
                    </div>
                    {slot.enabled ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={slot.start}
                          onChange={(e) => {
                            const newAvailability = [...availability];
                            newAvailability[index] = { ...slot, start: e.target.value };
                            setAvailability(newAvailability);
                          }}
                          className="w-28"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={slot.end}
                          onChange={(e) => {
                            const newAvailability = [...availability];
                            newAvailability[index] = { ...slot, end: e.target.value };
                            setAvailability(newAvailability);
                          }}
                          className="w-28"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unavailable</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t">
                <Button className="w-full" onClick={() => {
                  setShowAvailability(false);
                  toast.success('Availability updated!');
                }}>
                  <Check className="w-4 h-4 mr-2" />
                  Save Availability
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant={selectedEvent.status === 'confirmed' ? 'default' : 'secondary'}>
                    {selectedEvent.status}
                  </Badge>
                  <Badge variant="outline">{selectedEvent.type}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {selectedEvent.date.toLocaleDateString('en-US', { 
                      weekday: 'long', month: 'long', day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
                  </div>
                </div>

                {selectedEvent.client && (
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEvent.client.name}</span>
                    </div>
                    {selectedEvent.client.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedEvent.client.phone}</span>
                      </div>
                    )}
                    {selectedEvent.client.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedEvent.client.address}</span>
                      </div>
                    )}
                  </div>
                )}

                {selectedEvent.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{selectedEvent.notes}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t space-y-3">
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => updateEventStatus(selectedEvent.id, 'confirmed')}
                    disabled={selectedEvent.status === 'confirmed'}
                  >
                    Confirm
                  </Button>
                  <Button 
                    variant="secondary"
                    className="flex-1"
                    onClick={() => updateEventStatus(selectedEvent.id, 'completed')}
                    disabled={selectedEvent.status === 'completed'}
                  >
                    Complete
                  </Button>
                </div>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => deleteEvent(selectedEvent.id)}
                >
                  Delete Event
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
