// REAL-TIME TERRITORY MAP: US zip code map with live updates using react-simple-maps
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from '@vnedyalk0v/react19-simple-maps';
import { createCoordinates } from '@vnedyalk0v/react19-simple-maps';
import { MapPin, CheckCircle, Lock, Clock, MagnifyingGlass } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { getFirst300ClaimedZips, type First300Claim } from '@/lib/first300';
import { getTerritoryPricing, processTerritoryClaim } from '@/lib/territory-pricing';
import { validateTerritoryClaim, recordTerritoryOwnership, getOwnedTerritories, type EntityType } from '@/lib/territory-validation';
import type { User } from '@/lib/types';

const geoUrl = '/data/us-zips-medium.json'; // GeoJSON file (will fallback to states if not available)

interface TerritoryStatus {
  zip: string;
  status: 'available' | 'taken' | 'yours';
  holder?: string;
  priorityStatus?: 'first_priority' | 'second_priority';
  claimedAt?: Date;
}

interface RecentClaim {
  zip: string;
  timestamp: Date;
  city: string;
  state: string;
}

interface RealTimeTerritoryMapProps {
  currentUser?: User | null;
  onClaimClick?: (territory: TerritoryZip) => void;
}

export function RealTimeTerritoryMap({ currentUser, onClaimClick }: RealTimeTerritoryMapProps) {
  const [territoryStatuses, setTerritoryStatuses] = useState<Map<string, TerritoryStatus>>(new Map());
  const [recentClaims, setRecentClaims] = useState<RecentClaim[]>([]);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryZip | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState<EntityType>('Individual');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<{ isFirst300: boolean; initialFee: number; monthlyFee: number; priorityStatus: 'first_priority' | 'second_priority'; description: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [geoJsonData, setGeoJsonData] = useState<any>(null);
  const [geoJsonError, setGeoJsonError] = useState(false);

  // Fetch territory statuses and recent claims (real-time via polling)
  const fetchTerritoryData = async () => {
    try {
      // Get claimed territories from First 300 system
      const first300Claims = await getFirst300ClaimedZips();
      
      // Get user's owned territories if logged in
      let userOwnedZips: string[] = [];
      if (currentUser) {
        userOwnedZips = await getOwnedTerritories(
          entityType,
          currentUser.email,
          currentUser.id,
          taxId || undefined
        );
      }

      // Build status map
      const statusMap = new Map<string, TerritoryStatus>();
      
      // Mark all territories as available initially
      territoryZips.forEach(territory => {
        statusMap.set(territory.zip, {
          zip: territory.zip,
          status: 'available'
        });
      });

      // Update with First 300 claims
      first300Claims.forEach(claim => {
        const isYours = currentUser && claim.userId === currentUser.id;
        statusMap.set(claim.zip, {
          zip: claim.zip,
          status: isYours ? 'yours' : 'taken',
          holder: claim.userId,
          priorityStatus: claim.priorityStatus,
          claimedAt: claim.claimedAt
        });
      });

      // Update user's territories
      userOwnedZips.forEach(zip => {
        if (statusMap.has(zip)) {
          statusMap.set(zip, {
            ...statusMap.get(zip)!,
            status: 'yours'
          });
        }
      });

      setTerritoryStatuses(statusMap);

      // Get recent claims (last 10, within last hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recent = first300Claims
        .filter(c => c.claimedAt && new Date(c.claimedAt) > oneHourAgo)
        .sort((a, b) => {
          const dateA = a.claimedAt ? new Date(a.claimedAt).getTime() : 0;
          const dateB = b.claimedAt ? new Date(b.claimedAt).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 10)
        .map(claim => {
          const territory = territoryZips.find(t => t.zip === claim.zip);
          return {
            zip: claim.zip,
            timestamp: claim.claimedAt || new Date(),
            city: territory?.city || 'Unknown',
            state: territory?.state || 'Unknown'
          };
        });

      setRecentClaims(recent);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch territory data:', error);
      setLoading(false);
    }
  };

  // Load GeoJSON data for zip boundaries
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const response = await fetch(geoUrl);
        if (response.ok) {
          const data = await response.json();
          setGeoJsonData(data);
        } else {
          setGeoJsonError(true);
        }
      } catch (error) {
        console.warn('GeoJSON file not found, using marker-based map:', error);
        setGeoJsonError(true);
      }
    };
    loadGeoJSON();
  }, []);

  useEffect(() => {
    fetchTerritoryData();
    // Poll every 5 seconds for real-time updates (replaces Supabase subscriptions)
    const interval = setInterval(fetchTerritoryData, 5000);
    return () => clearInterval(interval);
  }, [currentUser, entityType, taxId]);

  // Get territory coordinates for markers
  const territoryCoordinates = useMemo(() => {
    return territoryZips
      .filter(t => t.latitude && t.longitude)
      .map(t => ({
        zip: t.zip,
        coordinates: createCoordinates(t.longitude, t.latitude),
        status: territoryStatuses.get(t.zip)?.status || 'available',
        priorityStatus: territoryStatuses.get(t.zip)?.priorityStatus,
        city: t.city,
        state: t.state
      }));
  }, [territoryStatuses]);

  const handleTerritoryClick = async (zip: string) => {
    const territory = territoryZips.find(t => t.zip === zip);
    if (!territory) return;

    const status = territoryStatuses.get(zip);
    if (status?.status === 'taken' || status?.status === 'yours') {
      // Show info tooltip for taken territories
      return;
    }

    if (!currentUser) {
      toast.error('Please log in to claim First Priority');
      return;
    }

    setSelectedTerritory(territory);
    setShowClaimModal(true);
    setValidationError(null);

    // Pre-fill email
    if (currentUser.email) {
      setEmail(currentUser.email);
    }

    // Get pricing
    try {
      const territoryPricing = await getTerritoryPricing(
        entityType,
        currentUser.email,
        currentUser.id,
        taxId || undefined
      );
      setPricing(territoryPricing);
    } catch (error) {
      console.error('Failed to get pricing:', error);
    }
  };

  const handleClaim = async () => {
    if (!selectedTerritory || !currentUser) return;

    setValidating(true);
    setValidationError(null);

    try {
      const validation = await validateTerritoryClaim({
        entityType,
        userId: currentUser.id,
        email: email || currentUser.email,
        taxId: taxId || undefined,
        territoryId: selectedTerritory.zip
      });

      if (!validation.valid) {
        setValidationError(validation.error || 'Validation failed');
        setValidating(false);
        return;
      }

      // Process claim with First 300 system
      const claimResult = await processTerritoryClaim(
        selectedTerritory.zip,
        entityType,
        email || currentUser.email,
        currentUser.id,
        taxId || undefined
      );

      if (!claimResult.success) {
        setValidationError('Failed to process claim. Please try again.');
        setValidating(false);
        return;
      }

      // Record ownership
      if (validation.entityHash) {
        await recordTerritoryOwnership(validation.entityHash, {
          entityType,
          userId: currentUser.id,
          email: email || currentUser.email,
          taxId: taxId || undefined,
          territoryId: selectedTerritory.zip
        });
      }

      toast.success('First Priority Claimed!', {
        description: `${selectedTerritory.city}, ${selectedTerritory.state} - ${claimResult.priorityStatus === 'first_priority' && !claimResult.requiresPayment ? 'Forever free!' : 'Payment required to activate.'}`,
      });

      setShowClaimModal(false);
      setSelectedTerritory(null);
      setEntityType('Individual');
      setTaxId('');
      setEmail('');

      // Refresh data
      await fetchTerritoryData();
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to claim territory');
    } finally {
      setValidating(false);
    }
  };

  const getTerritoryColor = (status: TerritoryStatus): string => {
    if (status.status === 'yours') return '#3B82F6'; // Blue
    if (status.status === 'taken') return '#EF4444'; // Red
    return '#10B981'; // Green (available)
  };

  // Calculate stats
  const stats = useMemo(() => {
    const total = territoryZips.length;
    const available = Array.from(territoryStatuses.values()).filter(s => s.status === 'available').length;
    const taken = Array.from(territoryStatuses.values()).filter(s => s.status === 'taken').length;
    const yours = Array.from(territoryStatuses.values()).filter(s => s.status === 'yours').length;
    const states = new Set(territoryZips.map(t => t.state)).size;
    return { total, available, taken, yours, states };
  }, [territoryStatuses]);

  if (loading) {
    return (
      <Card className="glass-card border-2 border-primary/20 backdrop-blur-xl bg-background/80">
        <CardContent className="p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading live territories...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass-card border-2 border-primary/20 backdrop-blur-xl bg-background/80">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Real-Time Territory Map
          </CardTitle>
          <CardDescription>
            Click any zip code to claim First Priority. Green = Available, Red = Taken, Blue = Yours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden border-2 border-border">
            {/* Legend */}
            <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/80 border border-green-600"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/80 border border-red-600"></div>
                  <span>First Priority Taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500/80 border-2 border-blue-600"></div>
                  <span>Your Territory</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="absolute top-4 right-4 z-10 flex gap-2 flex-wrap max-w-2xl">
              <Card className="bg-background/90 backdrop-blur-sm p-3 border shadow-lg text-center min-w-[100px]">
                <div className="text-2xl font-bold text-primary">{stats.total.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total Territories</div>
              </Card>
              <Card className="bg-background/90 backdrop-blur-sm p-3 border shadow-lg text-center min-w-[100px]">
                <div className="text-2xl font-bold text-green-600">{stats.available.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Available Now</div>
              </Card>
              <Card className="bg-background/90 backdrop-blur-sm p-3 border shadow-lg text-center min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.yours > 0 ? stats.yours : '—'}
                </div>
                <div className="text-xs text-muted-foreground">Your Territories</div>
              </Card>
              <Card className="bg-background/90 backdrop-blur-sm p-3 border shadow-lg text-center min-w-[100px]">
                <div className="text-2xl font-bold text-red-600">{stats.states}</div>
                <div className="text-xs text-muted-foreground">States Available</div>
              </Card>
            </div>

            {/* Recent claims indicator */}
            {recentClaims.length > 0 && (
              <div className="absolute bottom-20 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">Recent Claims</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {recentClaims.slice(0, 5).map((claim) => (
                    <div key={claim.zip} className="text-xs text-muted-foreground">
                      {claim.city}, {claim.state} {claim.zip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* The Map */}
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{ scale: 1000 }}
              className="w-full h-full"
            >
              {/* US States base map */}
              <Geographies geography="https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json">
                {({ geographies }) =>
                  geographies.map((geo, index) => (
                    <Geography
                      key={geo.properties?.name || `geo-${index}`}
                      geography={geo}
                      fill="#F3F4F6"
                      stroke="#D1D5DB"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none' },
                        pressed: { outline: 'none' }
                      }}
                    />
                  ))
                }
              </Geographies>

              {/* Zip code boundaries from GeoJSON (if available) */}
              {geoJsonData && (
                <Geographies geography={geoJsonData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      // Try multiple property names for zip code
                      const zip = geo.properties?.ZCTA5CE10 || 
                                  geo.properties?.ZIP || 
                                  geo.properties?.GEOID || 
                                  geo.properties?.ZCTA5CE20 ||
                                  geo.properties?.ZCTA5 ||
                                  geo.properties?.ZIP_CODE ||
                                  geo.properties?.zip;
                      if (!zip) return null;
                      
                      // Normalize zip to 5-digit string for matching
                      const zipStr = String(zip).padStart(5, '0').substring(0, 5);

                      const status = territoryStatuses.get(zipStr);
                      if (!status) {
                        // Default gray for territories not in our system
                        return (
                          <Geography
                            key={zipStr}
                            geography={geo}
                            fill="#E5E7EB"
                            stroke="#9CA3AF"
                            strokeWidth={0.3}
                            style={{
                              default: { outline: 'none' },
                              hover: { outline: 'none', fill: '#D1D5DB' },
                              pressed: { outline: 'none' }
                            }}
                          />
                        );
                      }

                      const fillColor = getTerritoryColor(status);
                      const isYours = status.status === 'yours';

                      return (
                        <TooltipProvider key={zipStr}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Geography
                                geography={geo}
                                fill={fillColor}
                                fillOpacity={0.7}
                                stroke={fillColor}
                                strokeWidth={isYours ? 2 : 0.5}
                                style={{
                                  default: { outline: 'none', cursor: status.status === 'available' ? 'pointer' : 'default' },
                                  hover: {
                                    outline: 'none',
                                    fill: status.status === 'available' ? '#059669' : fillColor,
                                    fillOpacity: 0.9,
                                    strokeWidth: 1.5
                                  },
                                  pressed: { outline: 'none' }
                                }}
                                onClick={() => handleTerritoryClick(zipStr)}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p className="font-semibold">Zip: {zipStr}</p>
                                <p className="text-sm">
                                  {status.status === 'available' && 'Available - Click to claim'}
                                  {status.status === 'taken' && `First Priority Taken${status.priorityStatus === 'first_priority' ? ' (First 300)' : ' (Paid)'}`}
                                  {status.status === 'yours' && `Your Territory${status.priorityStatus === 'first_priority' ? ' (First 300 - Free Forever)' : ' (Paid)'}`}
                                </p>
                                {status.claimedAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Claimed {new Date(status.claimedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })
                  }
                </Geographies>
              )}

              {/* Territory zip codes as markers (fallback if no GeoJSON) */}
              {geoJsonError && territoryCoordinates.map((territory) => {
                const status = territoryStatuses.get(territory.zip);
                if (!status) return null;

                const fillColor = getTerritoryColor(status);
                const strokeColor = getTerritoryColor(status);
                const radius = status.status === 'yours' ? 8 : status.status === 'taken' ? 6 : 4;

                return (
                  <TooltipProvider key={territory.zip}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Marker coordinates={territory.coordinates}>
                          <circle
                            r={radius}
                            fill={fillColor}
                            stroke={strokeColor}
                            strokeWidth={status.status === 'yours' ? 2 : 1}
                            style={{ cursor: status.status === 'available' ? 'pointer' : 'default' }}
                            onClick={() => handleTerritoryClick(territory.zip)}
                          />
                        </Marker>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          <p className="font-semibold">Zip: {territory.zip}</p>
                          <p className="text-sm">{territory.city}, {territory.state}</p>
                          <p className="text-sm">
                            {status.status === 'available' && 'Available - Click to claim'}
                            {status.status === 'taken' && `First Priority Taken${status.priorityStatus === 'first_priority' ? ' (First 300)' : ' (Paid)'}`}
                            {status.status === 'yours' && `Your Territory${status.priorityStatus === 'first_priority' ? ' (First 300 - Free Forever)' : ' (Paid)'}`}
                          </p>
                          {status.claimedAt && (
                            <p className="text-xs text-muted-foreground">
                              Claimed {new Date(status.claimedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}

              {/* Recent claims as animated dots */}
              {recentClaims.map((claim, index) => {
                const territory = territoryZips.find(t => t.zip === claim.zip);
                if (!territory || !territory.latitude || !territory.longitude) return null;

                return (
                  <Marker
                    key={`recent-${claim.zip}-${index}`}
                    coordinates={createCoordinates(territory.longitude, territory.latitude)}
                  >
                    <g>
                      <circle
                        r={6}
                        fill="#EF4444"
                        stroke="#DC2626"
                        strokeWidth={2}
                        opacity={0.8}
                        className="animate-pulse"
                      />
                    </g>
                  </Marker>
                );
              })}
            </ComposableMap>

            {/* Search Bar */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg flex gap-2 w-full max-w-md">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="flex-1 p-2 border rounded-md bg-background text-sm"
              >
                <option value="">All States</option>
                {Array.from(new Set(territoryZips.map(t => t.state))).sort().map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <div className="relative flex-1">
                <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search zip, city, state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Claim Modal */}
      <Dialog open={showClaimModal} onOpenChange={setShowClaimModal}>
        <DialogContent className="glass-card border-2 border-primary/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Claim First Priority</DialogTitle>
            <DialogDescription className="text-base">
              Review the details before claiming First Priority on this zip code
            </DialogDescription>
          </DialogHeader>
          
          {selectedTerritory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Territory</p>
                <div className="text-lg font-semibold">
                  {selectedTerritory.city}, {selectedTerritory.state} {selectedTerritory.zip}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTerritory.county} County
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pricing</p>
                  {pricing ? (
                    <>
                      <p className="text-2xl font-bold text-primary">
                        {pricing.isFirst300 ? 'FREE' : `$${pricing.initialFee}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pricing.description}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-primary">Loading...</p>
                    </>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Population</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(selectedTerritory.population / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              {/* Entity Information */}
              <div className="space-y-4 pt-4 border-t">
                <p className="text-sm font-semibold">Entity Information</p>
                <div>
                  <label className="text-sm font-medium mb-2 block">Entity Type *</label>
                  <select
                    value={entityType}
                    onChange={(e) => {
                      setEntityType(e.target.value as EntityType);
                      if (e.target.value === 'Individual') {
                        setTaxId('');
                      }
                      setValidationError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="Individual">Individual</option>
                    <option value="LLC">LLC</option>
                    <option value="Corporation">Corporation</option>
                  </select>
                </div>

                {(entityType === 'LLC' || entityType === 'Corporation') && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tax ID (EIN) *</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => {
                        setTaxId(e.target.value);
                        setValidationError(null);
                      }}
                      placeholder="12-3456789"
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationError(null);
                    }}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>

                {validationError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">{validationError}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowClaimModal(false);
                setSelectedTerritory(null);
                setValidationError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              disabled={validating || !selectedTerritory}
            >
              {validating ? 'Processing...' : 'Claim First Priority'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
