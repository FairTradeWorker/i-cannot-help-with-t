import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  User,
  Briefcase,
  Clock,
  Phone,
  EnvelopeSimple,
  Star,
  Lightning,
  CaretRight,
  CaretLeft,
  X,
  Crosshair,
  Path,
  MapTrifold,
  ArrowsOutCardinal,
  Users,
  Truck,
  Wrench,
  CircleNotch,
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Configuration constants
const SIMULATION_INTERVAL_MS = 3000;
const MOVEMENT_SPEED_FACTOR = 0.1;

// Types for dispatch tracking
interface Worker {
  id: string;
  name: string;
  avatar?: string;
  status: 'available' | 'on-route' | 'on-job' | 'offline';
  location: { lat: number; lng: number };
  phone: string;
  email: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  currentJobId?: string;
  eta?: string;
}

interface DispatchJob {
  id: string;
  title: string;
  address: string;
  location: { lat: number; lng: number };
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  urgency: 'normal' | 'urgent' | 'emergency';
  assignedWorker?: string;
  estimatedDuration: number;
  scheduledTime?: string;
  customerName: string;
  customerPhone: string;
}

interface RouteConnection {
  workerId: string;
  jobId: string;
  polyline: number[][];
  distance: number;
  duration: number;
}

// Mock data for demonstration
const mockWorkers: Worker[] = [
  {
    id: 'w1',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    status: 'on-route',
    location: { lat: 30.2849, lng: -97.7341 },
    phone: '(555) 123-4567',
    email: 'mike@email.com',
    specialty: 'Plumbing',
    rating: 4.8,
    completedJobs: 127,
    currentJobId: 'j1',
    eta: '12 min',
  },
  {
    id: 'w2',
    name: 'Sarah Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'on-job',
    location: { lat: 30.3183, lng: -97.7089 },
    phone: '(555) 234-5678',
    email: 'sarah@email.com',
    specialty: 'Electrical',
    rating: 4.9,
    completedJobs: 89,
    currentJobId: 'j2',
  },
  {
    id: 'w3',
    name: 'David Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    status: 'available',
    location: { lat: 30.2672, lng: -97.7431 },
    phone: '(555) 345-6789',
    email: 'david@email.com',
    specialty: 'HVAC',
    rating: 4.7,
    completedJobs: 156,
  },
  {
    id: 'w4',
    name: 'Emily Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'available',
    location: { lat: 30.3952, lng: -97.7503 },
    phone: '(555) 456-7890',
    email: 'emily@email.com',
    specialty: 'Roofing',
    rating: 4.6,
    completedJobs: 78,
  },
  {
    id: 'w5',
    name: 'James Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'offline',
    location: { lat: 30.3293, lng: -97.6789 },
    phone: '(555) 567-8901',
    email: 'james@email.com',
    specialty: 'General',
    rating: 4.5,
    completedJobs: 203,
  },
];

const mockJobs: DispatchJob[] = [
  {
    id: 'j1',
    title: 'Kitchen Faucet Replacement',
    address: '123 Oak St, Austin, TX',
    location: { lat: 30.3049, lng: -97.7141 },
    status: 'assigned',
    urgency: 'urgent',
    assignedWorker: 'w1',
    estimatedDuration: 120,
    scheduledTime: '2:00 PM',
    customerName: 'John Smith',
    customerPhone: '(555) 111-2222',
  },
  {
    id: 'j2',
    title: 'Electrical Panel Upgrade',
    address: '456 Elm Ave, Austin, TX',
    location: { lat: 30.3183, lng: -97.7089 },
    status: 'in-progress',
    urgency: 'normal',
    assignedWorker: 'w2',
    estimatedDuration: 480,
    scheduledTime: '10:00 AM',
    customerName: 'Jane Doe',
    customerPhone: '(555) 222-3333',
  },
  {
    id: 'j3',
    title: 'AC Unit Repair',
    address: '789 Pine Blvd, Austin, TX',
    location: { lat: 30.3552, lng: -97.7803 },
    status: 'pending',
    urgency: 'emergency',
    estimatedDuration: 180,
    customerName: 'Bob Johnson',
    customerPhone: '(555) 333-4444',
  },
  {
    id: 'j4',
    title: 'Roof Inspection',
    address: '321 Maple Dr, Austin, TX',
    location: { lat: 30.2393, lng: -97.6900 },
    status: 'pending',
    urgency: 'normal',
    estimatedDuration: 60,
    customerName: 'Alice Brown',
    customerPhone: '(555) 444-5555',
  },
  {
    id: 'j5',
    title: 'Water Heater Installation',
    address: '654 Cedar Ln, Austin, TX',
    location: { lat: 30.3872, lng: -97.7231 },
    status: 'pending',
    urgency: 'urgent',
    estimatedDuration: 240,
    customerName: 'Charlie Wilson',
    customerPhone: '(555) 555-6666',
  },
];

const mockRoutes: RouteConnection[] = [
  {
    workerId: 'w1',
    jobId: 'j1',
    polyline: [
      [-97.7341, 30.2849],
      [-97.7290, 30.2900],
      [-97.7200, 30.2970],
      [-97.7141, 30.3049],
    ],
    distance: 3500,
    duration: 720,
  },
];

// Status colors and styles
const workerStatusColors: Record<Worker['status'], { bg: string; text: string; border: string }> = {
  available: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
  'on-route': { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
  'on-job': { bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-500' },
  offline: { bg: 'bg-gray-400', text: 'text-gray-500', border: 'border-gray-400' },
};

const jobUrgencyColors: Record<DispatchJob['urgency'], { bg: string; text: string; icon: string }> = {
  normal: { bg: 'bg-gray-100', text: 'text-gray-700', icon: 'text-gray-500' },
  urgent: { bg: 'bg-amber-100', text: 'text-amber-700', icon: 'text-amber-500' },
  emergency: { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-500' },
};

const jobStatusColors: Record<DispatchJob['status'], { bg: string; text: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-700' },
  assigned: { bg: 'bg-blue-100', text: 'text-blue-700' },
  'in-progress': { bg: 'bg-amber-100', text: 'text-amber-700' },
  completed: { bg: 'bg-green-100', text: 'text-green-700' },
};

export function DispatchMap() {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [jobs, setJobs] = useState<DispatchJob[]>(mockJobs);
  const [routes, setRoutes] = useState<RouteConnection[]>(mockRoutes);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedJob, setSelectedJob] = useState<DispatchJob | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'workers' | 'jobs'>('workers');
  const [mapZoom, setMapZoom] = useState(12);
  const [mapCenter, setMapCenter] = useState({ lat: 30.3072, lng: -97.7331 });
  const [isLive, setIsLive] = useState(true);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setWorkers(prev => prev.map(worker => {
        if (worker.status === 'on-route') {
          // Simulate movement towards job using interpolation
          const job = jobs.find(j => j.id === worker.currentJobId);
          if (job) {
            const dx = (job.location.lng - worker.location.lng) * MOVEMENT_SPEED_FACTOR;
            const dy = (job.location.lat - worker.location.lat) * MOVEMENT_SPEED_FACTOR;
            // Add slight randomness for more realistic movement
            const jitter = 0.5 + Math.random() * 0.5;
            return {
              ...worker,
              location: {
                lat: worker.location.lat + dy * jitter,
                lng: worker.location.lng + dx * jitter,
              },
            };
          }
        }
        return worker;
      }));
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isLive, jobs]);

  // Map bounds fitter component
  function MapBoundsFitter() {
    const map = useMap();
    
    useEffect(() => {
      // Delay to ensure map container is fully rendered
      const timer = setTimeout(() => {
        map.invalidateSize();
        
        const allPoints = [
          ...workers.map(w => [w.location.lat, w.location.lng] as [number, number]),
          ...jobs.map(j => [j.location.lat, j.location.lng] as [number, number]),
        ];
        
        if (allPoints.length > 0) {
          const bounds = L.latLngBounds(allPoints);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }, [map, workers, jobs]);
    
    return null;
  }

  // Create custom worker icon
  const createWorkerIcon = (worker: Worker, isSelected: boolean, isHovered: boolean) => {
    const statusColors: Record<Worker['status'], string> = {
      available: '#10b981',
      'on-route': '#3b82f6',
      'on-job': '#f59e0b',
      offline: '#9ca3af',
    };
    const color = statusColors[worker.status];
    const size = isSelected || isHovered ? 32 : 24;
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: white;
          border: 4px solid ${color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.6}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isSelected || isHovered ? 'transform: scale(1.2);' : ''}
          transition: transform 0.2s;
        ">👷</div>
      `,
      className: 'worker-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Create custom job icon
  const createJobIcon = (job: DispatchJob, isSelected: boolean, isHovered: boolean) => {
    const colors: Record<DispatchJob['urgency'], string> = {
      normal: '#6b7280',
      urgent: '#f59e0b',
      emergency: '#ef4444',
    };
    const color = colors[job.urgency];
    const size = isSelected || isHovered ? 32 : 24;
    const isEmergency = job.urgency === 'emergency';
    
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${size * 0.6}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isSelected || isHovered ? 'transform: scale(1.2);' : ''}
          ${isEmergency ? 'animation: pulse 2s infinite;' : ''}
          transition: transform 0.2s;
        ">🏠</div>
      `,
      className: 'job-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const handleAssignWorker = (workerId: string, jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'assigned', assignedWorker: workerId }
        : job
    ));
    setWorkers(prev => prev.map(worker =>
      worker.id === workerId
        ? { ...worker, status: 'on-route', currentJobId: jobId, eta: '15 min' }
        : worker
    ));
    // Add route
    const worker = workers.find(w => w.id === workerId);
    const job = jobs.find(j => j.id === jobId);
    if (worker && job) {
      setRoutes(prev => [...prev, {
        workerId,
        jobId,
        polyline: [
          [worker.location.lng, worker.location.lat],
          [(worker.location.lng + job.location.lng) / 2, (worker.location.lat + job.location.lat) / 2 + 0.01],
          [job.location.lng, job.location.lat],
        ],
        distance: 5000,
        duration: 900,
      }]);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const availableWorkers = workers.filter(w => w.status === 'available');
  const pendingJobs = jobs.filter(j => j.status === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary">
              <MapTrifold className="w-8 h-8 text-white" weight="fill" />
            </div>
            Dispatch Map
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time worker and job tracking with live updates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge 
            variant={isLive ? 'default' : 'secondary'} 
            className={`gap-2 px-4 py-2 ${isLive ? 'animate-pulse' : ''}`}
          >
            {isLive ? (
              <>
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                Live Updates
              </>
            ) : (
              <>
                <CircleNotch className="w-4 h-4" />
                Paused
              </>
            )}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? 'Pause' : 'Resume'} Updates
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Workers</p>
                <p className="text-3xl font-bold text-green-600">{availableWorkers.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <Users className="w-6 h-6 text-green-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Jobs</p>
                <p className="text-3xl font-bold text-amber-600">{pendingJobs.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <Briefcase className="w-6 h-6 text-amber-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {jobs.filter(j => j.status === 'in-progress').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <Wrench className="w-6 h-6 text-blue-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Route</p>
                <p className="text-3xl font-bold text-purple-600">
                  {workers.filter(w => w.status === 'on-route').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-purple-100">
                <Truck className="w-6 h-6 text-purple-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Split View */}
      <div className="flex gap-4 h-[calc(100vh-400px)] min-h-[600px]">
        {/* Sidebar */}
        <motion.div
          initial={{ width: sidebarCollapsed ? 48 : 400 }}
          animate={{ width: sidebarCollapsed ? 48 : 400 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex-shrink-0"
        >
          <Card className="h-full relative overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? <CaretRight className="w-4 h-4" /> : <CaretLeft className="w-4 h-4" />}
            </Button>

            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col"
                >
                  <CardHeader className="pb-2">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'workers' | 'jobs')}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="workers" className="gap-2">
                          <Users className="w-4 h-4" />
                          Workers
                        </TabsTrigger>
                        <TabsTrigger value="jobs" className="gap-2">
                          <Briefcase className="w-4 h-4" />
                          Jobs
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full px-6 pb-6">
                      {activeTab === 'workers' && (
                        <div className="space-y-3 pt-4">
                          {workers.map((worker, index) => (
                            <motion.div
                              key={worker.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedWorker?.id === worker.id 
                                    ? 'ring-2 ring-primary shadow-lg' 
                                    : ''
                                }`}
                                onClick={() => {
                                  setSelectedWorker(worker);
                                  setSelectedJob(null);
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="relative">
                                      <Avatar className="w-12 h-12">
                                        <AvatarImage src={worker.avatar} />
                                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <span
                                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                          workerStatusColors[worker.status].bg
                                        }`}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-semibold truncate">{worker.name}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          {worker.specialty}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span
                                          className={`text-xs font-medium ${
                                            workerStatusColors[worker.status].text
                                          }`}
                                        >
                                          {worker.status.replace('-', ' ')}
                                        </span>
                                        {worker.eta && (
                                          <span className="text-xs text-muted-foreground">
                                            • ETA: {worker.eta}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Star className="w-3 h-3 text-amber-500" weight="fill" />
                                          {worker.rating}
                                        </span>
                                        <span>{worker.completedJobs} jobs</span>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {activeTab === 'jobs' && (
                        <div className="space-y-3 pt-4">
                          {jobs.map((job, index) => (
                            <motion.div
                              key={job.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                  selectedJob?.id === job.id 
                                    ? 'ring-2 ring-primary shadow-lg' 
                                    : ''
                                } ${
                                  job.urgency === 'emergency' ? 'border-red-300' : ''
                                }`}
                                onClick={() => {
                                  setSelectedJob(job);
                                  setSelectedWorker(null);
                                }}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-sm">{job.title}</h4>
                                    <div className="flex gap-1">
                                      {job.urgency !== 'normal' && (
                                        <Badge
                                          variant="outline"
                                          className={`text-xs ${jobUrgencyColors[job.urgency].bg} ${jobUrgencyColors[job.urgency].text}`}
                                        >
                                          {job.urgency === 'emergency' && (
                                            <Lightning className="w-3 h-3 mr-1" weight="fill" />
                                          )}
                                          {job.urgency}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {job.address}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <Badge
                                      variant="secondary"
                                      className={`${jobStatusColors[job.status].bg} ${jobStatusColors[job.status].text}`}
                                    >
                                      {job.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDuration(job.estimatedDuration)}
                                    </span>
                                  </div>
                                  {job.status === 'pending' && (
                                    <div className="mt-3 pt-3 border-t">
                                      <p className="text-xs text-muted-foreground mb-2">
                                        Assign to available worker:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {availableWorkers.slice(0, 3).map(worker => (
                                          <Button
                                            key={worker.id}
                                            size="sm"
                                            variant="outline"
                                            className="h-7 text-xs"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAssignWorker(worker.id, job.id);
                                            }}
                                          >
                                            <Avatar className="w-4 h-4 mr-1">
                                              <AvatarImage src={worker.avatar} />
                                              <AvatarFallback>{worker.name[0]}</AvatarFallback>
                                            </Avatar>
                                            {worker.name.split(' ')[0]}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Map Area */}
        <div className="flex-1 relative">
          <Card className="h-full overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="icon" className="shadow-lg">
                      <Crosshair className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Center Map</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="icon" className="shadow-lg">
                      <ArrowsOutCardinal className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Fit All</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-10">
              <Card className="glass-card">
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>On Route</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span>On Job</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Emergency</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Path className="w-3 h-3 text-blue-500" />
                      <span>Route</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real Map with Leaflet */}
            <div className="w-full h-full relative z-0" style={{ minHeight: '600px' }}>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.7; transform: scale(1.1); }
                }
                .leaflet-container {
                  height: 100% !important;
                  width: 100% !important;
                  z-index: 0;
                  min-height: 600px;
                }
                .leaflet-container .leaflet-tile-container img {
                  max-width: none !important;
                }
              `}</style>
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%', minHeight: '600px' }}
                zoomControl={true}
                whenReady={() => {
                  // Map is ready, bounds fitter will handle the rest
                }}
              >
                <MapBoundsFitter />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Route Polylines */}
                {routes.map(route => {
                  const worker = workers.find(w => w.id === route.workerId);
                  const job = jobs.find(j => j.id === route.jobId);
                  if (!worker || !job) return null;
                  
                  const polylinePositions = route.polyline.map(([lng, lat]) => [lat, lng] as [number, number]);
                  
                  return (
                    <Polyline
                      key={`route-${route.workerId}-${route.jobId}`}
                      positions={polylinePositions}
                      pathOptions={{
                        color: '#3b82f6',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '10, 5',
                      }}
                    />
                  );
                })}
                
                {/* Worker Markers */}
                {workers.map(worker => {
                  const isSelected = selectedWorker?.id === worker.id;
                  const isHovered = hoveredMarker === `worker-${worker.id}`;
                  
                  return (
                    <Marker
                      key={`worker-${worker.id}`}
                      position={[worker.location.lat, worker.location.lng]}
                      icon={createWorkerIcon(worker, isSelected, isHovered)}
                      eventHandlers={{
                        click: () => {
                          setSelectedWorker(worker);
                          setSelectedJob(null);
                        },
                        mouseover: () => setHoveredMarker(`worker-${worker.id}`),
                        mouseout: () => setHoveredMarker(null),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.specialty}</p>
                          <Badge className={`mt-1 ${workerStatusColors[worker.status].bg} text-white`}>
                            {worker.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
                
                {/* Job Markers */}
                {jobs.map(job => {
                  const isSelected = selectedJob?.id === job.id;
                  const isHovered = hoveredMarker === `job-${job.id}`;
                  
                  return (
                    <Marker
                      key={`job-${job.id}`}
                      position={[job.location.lat, job.location.lng]}
                      icon={createJobIcon(job, isSelected, isHovered)}
                      eventHandlers={{
                        click: () => {
                          setSelectedJob(job);
                          setSelectedWorker(null);
                        },
                        mouseover: () => setHoveredMarker(`job-${job.id}`),
                        mouseout: () => setHoveredMarker(null),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <p className="font-semibold">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.address}</p>
                          <div className="flex gap-1 mt-1">
                            <Badge className={jobUrgencyColors[job.urgency].bg}>
                              {job.urgency}
                            </Badge>
                            <Badge variant="outline">{job.status}</Badge>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>

              {/* Selection Detail Popover */}
              <AnimatePresence>
                {(selectedWorker || selectedJob) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-4 right-4 w-80 z-20"
                  >
                    <Card className="glass-card shadow-xl">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {selectedWorker ? selectedWorker.name : selectedJob?.title}
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => {
                              setSelectedWorker(null);
                              setSelectedJob(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        {selectedWorker && (
                          <CardDescription className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${workerStatusColors[selectedWorker.status].bg} text-white`}
                            >
                              {selectedWorker.status.replace('-', ' ')}
                            </Badge>
                            <span>{selectedWorker.specialty}</span>
                          </CardDescription>
                        )}
                        {selectedJob && (
                          <CardDescription className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`${jobStatusColors[selectedJob.status].bg} ${jobStatusColors[selectedJob.status].text}`}
                            >
                              {selectedJob.status}
                            </Badge>
                            {selectedJob.urgency !== 'normal' && (
                              <Badge
                                variant="outline"
                                className={`${jobUrgencyColors[selectedJob.urgency].bg} ${jobUrgencyColors[selectedJob.urgency].text}`}
                              >
                                {selectedJob.urgency}
                              </Badge>
                            )}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedWorker && (
                          <>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={selectedWorker.avatar} />
                                <AvatarFallback>{selectedWorker.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-4 h-4 text-amber-500" weight="fill" />
                                  <span className="font-semibold">{selectedWorker.rating}</span>
                                  <span className="text-muted-foreground">
                                    ({selectedWorker.completedJobs} jobs)
                                  </span>
                                </div>
                                {selectedWorker.eta && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    ETA: <span className="font-medium text-primary">{selectedWorker.eta}</span>
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedWorker.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <EnvelopeSimple className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedWorker.email}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <EnvelopeSimple className="w-4 h-4 mr-2" />
                                Message
                              </Button>
                            </div>
                          </>
                        )}

                        {selectedJob && (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedJob.address}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>Est. {formatDuration(selectedJob.estimatedDuration)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedJob.customerName}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedJob.customerPhone}</span>
                              </div>
                            </div>

                            {selectedJob.assignedWorker && (
                              <div className="pt-3 border-t">
                                <p className="text-xs text-muted-foreground mb-2">Assigned to:</p>
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage 
                                      src={workers.find(w => w.id === selectedJob.assignedWorker)?.avatar} 
                                    />
                                    <AvatarFallback>
                                      {workers.find(w => w.id === selectedJob.assignedWorker)?.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {workers.find(w => w.id === selectedJob.assignedWorker)?.name}
                                  </span>
                                </div>
                              </div>
                            )}

                            {selectedJob.status === 'pending' && availableWorkers.length > 0 && (
                              <div className="pt-3 border-t">
                                <p className="text-xs text-muted-foreground mb-2">
                                  Quick assign:
                                </p>
                                <div className="space-y-2">
                                  {availableWorkers.map(worker => (
                                    <Button
                                      key={worker.id}
                                      size="sm"
                                      variant="outline"
                                      className="w-full justify-start"
                                      onClick={() => handleAssignWorker(worker.id, selectedJob.id)}
                                    >
                                      <Avatar className="w-6 h-6 mr-2">
                                        <AvatarImage src={worker.avatar} />
                                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                                      </Avatar>
                                      <div className="text-left">
                                        <p className="font-medium">{worker.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {worker.specialty} • {worker.rating}★
                                        </p>
                                      </div>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
