import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  MapTrifold,
  Clock,
  CurrencyDollar,
  Path,
  GasPump,
  ArrowsClockwise,
  CheckCircle,
  Warning,
  Lightning,
  Swap,
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { routingAPI, type JobLocation, type OptimizedRoute } from '@/lib/routing-api';
import { RouteMap } from '@/components/RouteMap';
import { toast } from 'sonner';

interface RouteOptimizerProps {
  jobs: Array<{
    id: string;
    title: string;
    address: string;
    location: { lat: number; lng: number };
    urgency?: 'normal' | 'urgent' | 'emergency';
    estimatedDuration?: number;
  }>;
  contractorLocation: { lat: number; lng: number; address?: string };
  onRouteOptimized?: (route: OptimizedRoute) => void;
}

export function RouteOptimizer({ jobs, contractorLocation, onRouteOptimized }: RouteOptimizerProps) {
  const [optimizedRoute, setOptimizedRoute] = useState<OptimizedRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [avoidFerries, setAvoidFerries] = useState(false);
  const [returnToStart, setReturnToStart] = useState(true);
  const [selectedJobs, setSelectedJobs] = useState<string[]>(jobs.map(j => j.id));

  useEffect(() => {
    setSelectedJobs(jobs.map(j => j.id));
  }, [jobs]);

  const handleOptimizeRoute = async () => {
    if (selectedJobs.length === 0) {
      toast.error('Please select at least one job to optimize');
      return;
    }

    setLoading(true);
    try {
      const jobsToOptimize: JobLocation[] = jobs
        .filter(j => selectedJobs.includes(j.id))
        .map(j => ({
          id: j.id,
          name: j.title,
          address: j.address,
          lat: j.location.lat,
          lng: j.location.lng,
          urgency: j.urgency,
          estimatedDuration: j.estimatedDuration,
        }));

      const route = await routingAPI.optimizeJobRoute(
        jobsToOptimize,
        contractorLocation,
        returnToStart,
        {
          avoid_tolls: avoidTolls,
          avoid_highways: avoidHighways,
          avoid_ferries: avoidFerries,
        }
      );

      setOptimizedRoute(route);
      onRouteOptimized?.(route);
      toast.success('Route optimized successfully!');
    } catch (error) {
      console.error('Route optimization error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const getUrgencyColor = (urgency?: 'normal' | 'urgent' | 'emergency') => {
    switch (urgency) {
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
      case 'urgent':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUrgencyIcon = (urgency?: 'normal' | 'urgent' | 'emergency') => {
    switch (urgency) {
      case 'emergency':
        return <Lightning className="w-3 h-3" weight="fill" />;
      case 'urgent':
        return <Warning className="w-3 h-3" weight="fill" />;
      default:
        return <CheckCircle className="w-3 h-3" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Path className="w-5 h-5 text-primary" weight="bold" />
              </div>
              Route Options
            </CardTitle>
            <CardDescription>Configure your route preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-tolls" className="flex items-center gap-2 cursor-pointer">
                  <CurrencyDollar className="w-4 h-4 text-muted-foreground" />
                  Avoid Tolls
                </Label>
                <Switch
                  id="avoid-tolls"
                  checked={avoidTolls}
                  onCheckedChange={setAvoidTolls}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-highways" className="flex items-center gap-2 cursor-pointer">
                  <MapTrifold className="w-4 h-4 text-muted-foreground" />
                  Avoid Highways
                </Label>
                <Switch
                  id="avoid-highways"
                  checked={avoidHighways}
                  onCheckedChange={setAvoidHighways}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="avoid-ferries" className="flex items-center gap-2 cursor-pointer">
                  <Path className="w-4 h-4 text-muted-foreground" />
                  Avoid Ferries
                </Label>
                <Switch
                  id="avoid-ferries"
                  checked={avoidFerries}
                  onCheckedChange={setAvoidFerries}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="return-to-start" className="flex items-center gap-2 cursor-pointer">
                  <ArrowsClockwise className="w-4 h-4 text-muted-foreground" />
                  Return to Start
                </Label>
                <Switch
                  id="return-to-start"
                  checked={returnToStart}
                  onCheckedChange={setReturnToStart}
                />
              </div>
            </div>

            <Separator />

            <Button
              onClick={handleOptimizeRoute}
              disabled={loading || selectedJobs.length === 0}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  >
                    <ArrowsClockwise className="w-5 h-5 mr-2" />
                  </motion.div>
                  Optimizing...
                </>
              ) : (
                <>
                  <Path className="w-5 h-5 mr-2" weight="bold" />
                  Optimize Route
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {optimizedRoute && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.177 }}
          >
            <Card className="glass-card border-primary/50">
              <CardHeader>
                <CardTitle className="text-lg">Route Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Path className="w-4 h-4" />
                    Total Distance
                  </div>
                  <span className="font-semibold">
                    {routingAPI.formatDistance(optimizedRoute.totalDistance)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Total Duration
                  </div>
                  <span className="font-semibold">
                    {routingAPI.formatDuration(optimizedRoute.totalDuration)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GasPump className="w-4 h-4" />
                    Fuel Cost
                  </div>
                  <span className="font-semibold">
                    {routingAPI.formatCurrency(optimizedRoute.fuelCost)}
                  </span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CurrencyDollar className="w-4 h-4" />
                    Estimated Cost
                  </div>
                  <span className="font-bold text-primary">
                    {routingAPI.formatCurrency(optimizedRoute.estimatedCost)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="lg:col-span-2 space-y-4">
        {optimizedRoute && optimizedRoute.polyline && optimizedRoute.polyline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.177 }}
          >
            <RouteMap route={optimizedRoute} />
          </motion.div>
        )}

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <MapPin className="w-5 h-5 text-accent" weight="fill" />
              </div>
              Select Jobs ({selectedJobs.length} of {jobs.length})
            </CardTitle>
            <CardDescription>
              Choose which jobs to include in your optimized route
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No jobs available to route</p>
                  </div>
                ) : (
                  jobs.map((job, index) => {
                    const isSelected = selectedJobs.includes(job.id);
                    const optimizedIndex = optimizedRoute?.stops.findIndex(s => s.id === job.id);
                    
                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.044, duration: 0.133 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-[0.088s] ${
                            isSelected
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => toggleJobSelection(job.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                    optimizedIndex !== undefined && optimizedIndex > 0
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {optimizedIndex !== undefined && optimizedIndex > 0 ? (
                                    optimizedIndex
                                  ) : (
                                    <MapPin weight="fill" />
                                  )}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold truncate">{job.title}</h4>
                                  {job.urgency && (
                                    <Badge className={getUrgencyColor(job.urgency)} variant="secondary">
                                      {getUrgencyIcon(job.urgency)}
                                      <span className="ml-1 text-xs capitalize">{job.urgency}</span>
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {job.address}
                                </p>
                                {job.estimatedDuration && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    Est. {Math.round(job.estimatedDuration / 60)}h duration
                                  </div>
                                )}
                              </div>

                              <div className="flex-shrink-0">
                                <div
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-[0.088s] ${
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : 'border-muted-foreground/30'
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.088 }}
                                    >
                                      <CheckCircle className="w-4 h-4 text-primary-foreground" weight="fill" />
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {optimizedRoute && optimizedRoute.legs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.177, delay: 0.088 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swap className="w-5 h-5 text-primary" />
                  Turn-by-Turn Directions
                </CardTitle>
                <CardDescription>Optimized route segments</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {optimizedRoute.legs.map((leg, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {index + 1}
                          </div>
                          {index < optimizedRoute.legs.length - 1 && (
                            <div className="w-0.5 h-12 bg-border my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              Leg {index + 1}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{routingAPI.formatDistance(leg.distance)}</span>
                              <span>•</span>
                              <span>{routingAPI.formatDuration(leg.duration)}</span>
                            </div>
                          </div>
                          {leg.steps && leg.steps.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {leg.steps.length} steps
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
