import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { 
  Lightning,
  MapTrifold,
  CurrencyDollar,
  TrendUp,
  CheckCircle,
  MagnifyingGlass,
  CaretDown,
  Circle,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  territoryZips, 
  getStateStats, 
  getTotalTerritoryCount, 
  getAvailableTerritoryCount,
  getTerritoriesByState,
  claimTerritory,
  releaseTerritory,
  takenTerritories,
  type TerritoryZip 
} from '@/lib/territory-data';

interface TerritoriesOverviewProps {
  onNavigateToDetail?: (stateCode: string) => void;
}

// Format revenue with proper abbreviation (K for thousands, M for millions)
function formatRevenue(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${(amount / 1000).toFixed(0)}K`;
}

export function TerritoriesOverview({ onNavigateToDetail }: TerritoriesOverviewProps) {
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('map');
  const [liveUpdateCounter, setLiveUpdateCounter] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate live updates - randomly mark territories as taken/available
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate some territories getting claimed
      const availableZips = territoryZips.filter(t => t.available && !takenTerritories.has(t.zip));
      if (availableZips.length > 0 && Math.random() > 0.7) {
        const randomZip = availableZips[Math.floor(Math.random() * availableZips.length)];
        claimTerritory(randomZip.zip);
        setLiveUpdateCounter(c => c + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stateStats = getStateStats();
  const totalTerritories = getTotalTerritoryCount();
  const availableTerritories = getAvailableTerritoryCount();
  
  // Get territories based on selected state
  const displayTerritories = selectedState === 'all' 
    ? territoryZips 
    : getTerritoriesByState(selectedState);
  
  // Filter by search
  const filteredTerritories = displayTerritories.filter(t => 
    t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.zip.includes(searchQuery) ||
    t.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const claimedCount = claimedTerritories?.length || 0;

  const handleClaimTerritory = (zip: string) => {
    const territory = territoryZips.find(t => t.zip === zip);
    if (!territory) return;
    
    if (claimedTerritories?.includes(zip)) {
      releaseTerritory(zip);
      setClaimedTerritories((current) => current?.filter(z => z !== zip) || []);
    } else {
      claimTerritory(zip);
      setClaimedTerritories((current) => [...(current || []), zip]);
    }
  };

  // Draw the live territory map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (width / 20), 0);
      ctx.lineTo(i * (width / 20), height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * (height / 15));
      ctx.lineTo(width, i * (height / 15));
      ctx.stroke();
    }
    
    // Map bounds for continental US
    const minLat = 24.5;
    const maxLat = 49.5;
    const minLng = -125;
    const maxLng = -66;
    
    const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * width;
    const toY = (lat: number) => height - ((lat - minLat) / (maxLat - minLat)) * height;
    
    // Draw territories as dots
    territoryZips.forEach(t => {
      const x = toX(t.longitude);
      const y = toY(t.latitude);
      
      const isAvailable = t.available && !takenTerritories.has(t.zip);
      const isClaimed = claimedTerritories?.includes(t.zip);
      
      // Outer glow for claimed
      if (isClaimed) {
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.fill();
      }
      
      ctx.beginPath();
      ctx.arc(x, y, isClaimed ? 5 : 3, 0, Math.PI * 2);
      
      if (isClaimed) {
        ctx.fillStyle = '#3b82f6'; // blue for claimed by user
      } else if (isAvailable) {
        ctx.fillStyle = '#22c55e'; // green for available
      } else {
        ctx.fillStyle = '#ef4444'; // red for taken
      }
      ctx.fill();
    });
    
    // Draw state labels
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    
    const stateLabels: Record<string, [number, number]> = {
      TX: [-99.5, 31],
      AZ: [-111.5, 34.2],
      GA: [-83.5, 32.7],
      CO: [-105.5, 39],
      TN: [-86, 35.8],
      WA: [-120.5, 47.4],
      OR: [-120.5, 44],
      NV: [-117, 39],
      UT: [-111.5, 39.3],
      NM: [-106, 34.5],
      OH: [-82.8, 40.3],
      MI: [-85, 44],
      IL: [-89.3, 40],
      IN: [-86.1, 40],
      NC: [-79.5, 35.5],
      SC: [-81, 34],
      VA: [-79, 37.5],
      PA: [-77.5, 41],
      MN: [-94.5, 46],
      WI: [-89.7, 44.5],
      MO: [-92.5, 38.5],
      KS: [-98.5, 38.5],
      OK: [-97.5, 35.5],
      LA: [-92, 31],
      AL: [-86.8, 32.8],
      MS: [-89.7, 32.8],
      AR: [-92.5, 35],
      KY: [-85.5, 37.8],
      WV: [-80.5, 38.8],
      IA: [-93.5, 42],
      NE: [-99.8, 41.5],
      SD: [-100, 44.5],
      ND: [-100.5, 47.5],
      MT: [-110, 47],
      WY: [-107.5, 43],
      ID: [-114.5, 44.5],
    };
    
    Object.entries(stateLabels).forEach(([state, [lng, lat]]) => {
      const x = toX(lng);
      const y = toY(lat);
      ctx.fillText(state, x, y);
    });
    
  }, [liveUpdateCounter, claimedTerritories]);

  return (
    <div className="space-y-6 px-0 sm:px-0" style={{ paddingLeft: '0', paddingRight: '0' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Available Territories</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Priority Access to first Leads in your zip codes</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="flex items-center gap-2">
              <Circle className="w-3 h-3 text-green-500" weight="fill" />
              <span className="text-xs text-muted-foreground">Live Updates</span>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">Your Territories</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono">{claimedCount}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary">
                <MapTrifold className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{totalTerritories.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Territories</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary">
                <Lightning className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{availableTerritories.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent">
                <CurrencyDollar className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">$45</p>
                <p className="text-sm text-muted-foreground">Per Month</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive">
                <TrendUp className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{stateStats.length}</p>
                <p className="text-sm text-muted-foreground">States Available</p>
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'list' | 'map')} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="map" className="flex-1 sm:flex-initial">
                <MapTrifold className="w-4 h-4 mr-2" />
                Live Map
              </TabsTrigger>
              <TabsTrigger value="list" className="flex-1 sm:flex-initial">
                <MagnifyingGlass className="w-4 h-4 mr-2" />
                Browse Territories
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {stateStats.map(s => (
                    <SelectItem key={s.state} value={s.state}>
                      {s.state} ({s.available} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search zip, city, state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>

          <TabsContent value="map" className="mt-0">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Live Territory Map</h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span>Taken</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Your Territories</span>
                  </div>
                </div>
              </div>
              <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden w-full">
                <canvas 
                  ref={canvasRef} 
                  width={1000} 
                  height={600} 
                  className="w-full h-auto max-w-full"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {stateStats.slice(0, 12).map(s => (
                  <Card 
                    key={s.state} 
                    className="p-3 cursor-pointer hover:border-primary transition-colors w-full"
                    onClick={() => setSelectedState(s.state)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold flex-shrink-0" style={{ fontSize: '18px' }}>{s.state}</span>
                      <div className="flex items-center gap-1.5 flex-1 justify-end min-w-0">
                        <span className="font-mono whitespace-nowrap" style={{ fontSize: '16px' }}>{s.total}</span>
                        <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: '14px', color: '#6b7280' }}>total</span>
                        <Badge variant={s.available > 0 ? 'default' : 'secondary'} className="text-xs whitespace-nowrap flex-shrink-0" style={{ fontSize: '12px', padding: '2px 6px' }}>
                          {s.available}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTerritories.slice(0, 30).map((territory, index) => {
                const isClaimed = claimedTerritories?.includes(territory.zip);
                const isAvailable = territory.available && !takenTerritories.has(territory.zip);
                const demandScore = Math.floor(territory.population / 1000) + Math.floor(territory.medianIncome / 2000);
                const annualRevenue = territory.population * (territory.medianIncome / 1000) * 0.8;
                
                return (
                  <motion.div
                    key={territory.zip}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                      <Card className={`glass-card p-6 border-0 bg-transparent ${!isAvailable && !isClaimed ? 'opacity-60' : ''} ${isClaimed ? 'border-primary border-2' : ''}`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${isClaimed ? 'bg-primary' : isAvailable ? 'bg-secondary' : 'bg-muted'}`}>
                              <MapTrifold className={`w-6 h-6 ${isClaimed || isAvailable ? 'text-white' : 'text-foreground'}`} weight="fill" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{territory.zip}</h3>
                              <p className="text-xs text-muted-foreground">{territory.city}, {territory.state}</p>
                            </div>
                          </div>
                          {isClaimed && (
                            <CheckCircle className="w-6 h-6 text-primary" weight="fill" />
                          )}
                          {!isAvailable && !isClaimed && (
                            <Badge variant="destructive">Taken</Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Demand Score</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={demandScore > 70 ? 'default' : 'secondary'}>
                                {Math.min(demandScore, 100)}/100
                              </Badge>
                              {demandScore > 70 && (
                                <TrendUp className="w-4 h-4 text-accent" weight="bold" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Est. Annual Revenue</span>
                            <span className="font-mono font-semibold">
                              {formatRevenue(annualRevenue)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Population</span>
                            <span className="font-mono font-semibold">{territory.population.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Monthly Cost</span>
                            <span className="font-mono font-semibold">$45</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleClaimTerritory(territory.zip)}
                          variant={isClaimed ? 'outline' : 'default'}
                          className="w-full"
                          disabled={!isAvailable && !isClaimed}
                        >
                          {isClaimed ? 'Release Territory' : isAvailable ? 'Claim Territory' : 'Not Available'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            {filteredTerritories.length > 30 && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Showing 30 of {filteredTerritories.length} territories. Use search or filter by state to find specific areas.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
