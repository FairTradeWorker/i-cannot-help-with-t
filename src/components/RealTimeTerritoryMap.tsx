// REAL-TIME TERRITORY MAP: US zip code map with live updates
'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});
import { MapPin, CheckCircle, Lock, Clock } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { dataStore } from '@/lib/store';
import type { User } from '@/lib/types';

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

  // Fetch territory statuses and recent claims
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

  useEffect(() => {
    fetchTerritoryData();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchTerritoryData, 5000);
    return () => clearInterval(interval);
  }, [currentUser, entityType, taxId]);

  // Get territory coordinates for markers
  const territoryCoordinates = useMemo(() => {
    return territoryZips
      .filter(t => t.latitude && t.longitude)
      .map(t => ({
        zip: t.zip,
        coordinates: [t.longitude, t.latitude] as [number, number],
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


  if (loading) {
    return (
      <Card className="glass-card border-2 border-primary/20">
        <CardContent className="p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading territory map...</p>
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
            <MapContainer
              center={[39.8283, -98.5795]}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Territory zip codes as markers/circles */}
              {territoryCoordinates.map((territory) => {
                const status = territoryStatuses.get(territory.zip);
                if (!status) return null;

                const fillColor = getTerritoryColor(status);
                const strokeColor = getTerritoryColor(status);
                const radius = status.status === 'yours' ? 8 : status.status === 'taken' ? 6 : 4;

                return (
                  <CircleMarker
                    key={territory.zip}
                    center={[territory.coordinates[1], territory.coordinates[0]]}
                    radius={radius}
                    pathOptions={{
                      fillColor: fillColor,
                      fillOpacity: 0.8,
                      color: strokeColor,
                      weight: status.status === 'yours' ? 2 : 1
                    }}
                    eventHandlers={{
                      click: () => handleTerritoryClick(territory.zip),
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({ fillOpacity: 1, weight: 2 });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({ fillOpacity: 0.8, weight: status.status === 'yours' ? 2 : 1 });
                      }
                    }}
                  >
                    <Popup>
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
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Recent claims as animated dots */}
              {recentClaims.map((claim, index) => {
                const territory = territoryZips.find(t => t.zip === claim.zip);
                if (!territory || !territory.latitude || !territory.longitude) return null;

                return (
                  <CircleMarker
                    key={`recent-${claim.zip}-${index}`}
                    center={[territory.latitude, territory.longitude]}
                    radius={5}
                    pathOptions={{
                      fillColor: '#EF4444',
                      fillOpacity: 0.8,
                      color: '#DC2626',
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">Recent Claim</p>
                        <p>{claim.city}, {claim.state} {claim.zip}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(claim.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
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

            {/* Recent claims indicator */}
            {recentClaims.length > 0 && (
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
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

