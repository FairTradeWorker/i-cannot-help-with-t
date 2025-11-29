import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKV } from '@github/spark/hooks';
import { 
  MapTrifold, 
  ListBullets, 
  MagnifyingGlass,
  CheckCircle,
  Lock,
  TrendUp,
  Users,
  CurrencyDollar,
  Star,
  Buildings,
  Plus,
  X,
  Warning
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { US_STATES, type StateData } from '@/lib/us-states-data';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { validateTerritoryClaim, recordTerritoryOwnership, getOwnedTerritories, type EntityType } from '@/lib/territory-validation';
import { dataStore } from '@/lib/store';
import type { User } from '@/lib/types';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface TerritoryLeafletMapProps {
  territories: Array<TerritoryZip & { status: string }>;
  selectedTerritory: TerritoryZip | null;
  onTerritoryClick: (territory: TerritoryZip) => void;
  selectedState: StateData | null;
}

function MapBoundsFitter({ territories, selectedState }: { territories: Array<TerritoryZip & { status: string }>, selectedState: StateData | null }) {
  const map = useMap();
  
  useEffect(() => {
    // Delay to ensure map container is fully rendered
    const timer = setTimeout(() => {
      map.invalidateSize();
      
      const validTerritories = territories.filter(t => t.latitude && t.longitude);
      if (validTerritories.length > 0) {
        const points = validTerritories.map(t => [t.latitude, t.longitude] as [number, number]);
        const bounds = L.latLngBounds(points);
        
        // If a state is selected, zoom in more
        const maxZoom = selectedState ? 7 : 10;
        map.fitBounds(bounds, { padding: [50, 50], maxZoom });
      } else {
        // Default to center of USA
        map.setView([39.8283, -98.5795], 4);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map, territories, selectedState]);
  
  return null;
}

function TerritoryLeafletMap({ territories, selectedTerritory, onTerritoryClick, selectedState }: TerritoryLeafletMapProps) {
  // Create custom territory marker icon
  const createTerritoryIcon = (territory: TerritoryZip & { status: string }, isSelected: boolean) => {
    let color: string;
    let iconText: string;
    
    if (territory.status === 'claimed') {
      color = '#ef4444'; // red
      iconText = '🔒';
    } else if (territory.status === 'available') {
      color = '#22c55e'; // green
      iconText = '✓';
    } else {
      color = '#6b7280'; // gray
      iconText = '○';
    }
    
    const size = isSelected ? 32 : 24;
    
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
          color: white;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${isSelected ? 'transform: scale(1.3); border-color: #3b82f6;' : ''}
          transition: transform 0.2s;
          cursor: pointer;
        ">${iconText}</div>
      `,
      className: 'territory-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const validTerritories = territories.filter(t => t.latitude && t.longitude);

  return (
    <Card className="overflow-hidden">
      <div className="relative h-[600px] w-full">
        <style>{`
          .leaflet-container {
            height: 100% !important;
            width: 100% !important;
          }
          .leaflet-container .leaflet-tile-container img {
            max-width: none !important;
          }
        `}</style>
        <MapContainer
          center={[39.8283, -98.5795]} // Center of USA
          zoom={4}
          style={{ height: '100%', width: '100%', minHeight: '600px' }}
          zoomControl={true}
          whenReady={() => {
            // Map is ready, bounds fitter will handle the rest
          }}
        >
          <MapBoundsFitter territories={territories} selectedState={selectedState} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Territory Markers */}
          {validTerritories.map(territory => {
            const isSelected = selectedTerritory?.zip === territory.zip;
            
            return (
              <Marker
                key={territory.zip}
                position={[territory.latitude, territory.longitude]}
                icon={createTerritoryIcon(territory, isSelected)}
                eventHandlers={{
                  click: () => onTerritoryClick(territory),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-lg">{territory.city}, {territory.state}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{territory.zip} • {territory.county} County</p>
                    <div className="space-y-1 mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Population:</span>
                        <span className="font-semibold">{(territory.population / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Median Income:</span>
                        <span className="font-semibold">${(territory.medianIncome / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-semibold text-primary">${territory.monthlyPrice}/mo</span>
                      </div>
                    </div>
                    <Badge 
                      variant={territory.status === 'available' ? 'default' : 'secondary'}
                      className={`w-full justify-center ${
                        territory.status === 'available' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : territory.status === 'claimed'
                          ? 'bg-red-600 hover:bg-red-700'
                          : ''
                      }`}
                    >
                      {territory.status === 'available' ? (
                        <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                      ) : (
                        <Lock className="w-3 h-3 mr-1" weight="fill" />
                      )}
                      {territory.status === 'available' ? 'Available' : territory.status === 'claimed' ? 'Claimed' : 'Unavailable'}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <p className="text-xs font-semibold mb-2">Legend</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white" />
              <span>Claimed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-500 border-2 border-white" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TerritoryMapPage() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryZip | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [entityType, setEntityType] = useState<EntityType>('Individual');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validating, setValidating] = useState(false);

  // Load current user
  useEffect(() => {
    dataStore.getCurrentUser().then(setCurrentUser);
  }, []);

  const territories = territoryZips.map(t => ({
    ...t,
    status: claimedTerritories?.includes(t.zip) ? 'claimed' : (t.available ? 'available' : 'unavailable')
  }));

  const filteredTerritories = territories.filter(territory => {
    const matchesSearch = 
      territory.zip.includes(searchQuery) ||
      territory.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
      territory.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesState = !selectedState || territory.state === selectedState.abbreviation;
    
    return matchesSearch && matchesState;
  });

  const handleClaimTerritory = async (territory: TerritoryZip) => {
    if (!currentUser) {
      toast.error('Please log in to claim a territory');
      return;
    }

    setSelectedTerritory(territory);
    setShowClaimDialog(true);
    setValidationError(null);
    
    // Pre-fill email from user
    if (currentUser.email) {
      setEmail(currentUser.email);
    }

    // Check if user already owns a territory
    try {
      const owned = await getOwnedTerritories(
        entityType,
        currentUser.email,
        currentUser.id,
        taxId || undefined
      );
      if (owned.length > 0) {
        setValidationError(`You already own ${owned.length} territory/territories. Only one territory per entity is allowed.`);
      }
    } catch (error) {
      console.error('Failed to check owned territories:', error);
    }
  };

  const validateClaim = async () => {
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

      setClaimedTerritories(current => [...(current || []), selectedTerritory.zip]);
      
      toast.success('Territory Claimed!', {
        description: `${selectedTerritory.city}, ${selectedTerritory.state} - Exclusive Rights to Our Leads`,
      });
      
      setShowClaimDialog(false);
      setSelectedTerritory(null);
      setEntityType('Individual');
      setTaxId('');
      setEmail('');
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to claim territory');
    } finally {
      setValidating(false);
    }
  };

  const handleStateClick = (state: StateData) => {
    setSelectedState(state.abbreviation === selectedState?.abbreviation ? null : state);
  };

  const stats = {
    totalTerritories: territories.length,
    available: territories.filter(t => t.status === 'available').length,
    claimed: territories.filter(t => t.status === 'claimed').length,
    myTerritories: claimedTerritories?.length || 0,
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Territory Map</h1>
            <p className="text-lg text-muted-foreground">
              $45/month per territory • Exclusive Rights to Our Leads
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setView('map')}
            >
              <MapTrifold className="w-5 h-5 mr-2" weight={view === 'map' ? 'fill' : 'regular'} />
              Map View
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setView('list')}
            >
              <ListBullets className="w-5 h-5 mr-2" weight={view === 'list' ? 'fill' : 'regular'} />
              List View
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Territories</p>
                  <p className="text-3xl font-bold">{stats.totalTerritories}</p>
                </div>
                <MapTrifold className="w-10 h-10 text-primary" weight="fill" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>
                  <p className="text-3xl font-bold text-green-600">{stats.available}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-600" weight="fill" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Claimed</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.claimed}</p>
                </div>
                <Lock className="w-10 h-10 text-amber-600" weight="fill" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">My Territories</p>
                  <p className="text-3xl font-bold text-primary">{stats.myTerritories}</p>
                </div>
                <Buildings className="w-10 h-10 text-primary" weight="fill" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by zip code, city, county, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base"
          />
        </div>

        {selectedState && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Badge variant="secondary" className="text-sm px-4 py-2">
              Filtered: {selectedState.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0"
                onClick={() => setSelectedState(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </Badge>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {view === 'map' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <TerritoryLeafletMap
              territories={filteredTerritories}
              selectedTerritory={selectedTerritory}
              onTerritoryClick={handleClaimTerritory}
              selectedState={selectedState}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredTerritories.map((territory, index) => (
              <motion.div
                key={territory.zip}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`h-full ${
                  territory.status === 'claimed' ? 'border-amber-500/50 bg-amber-50/50' : ''
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {territory.city}, {territory.state}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {territory.zip} • {territory.county} County
                        </CardDescription>
                      </div>
                      <Badge variant={territory.status === 'available' ? 'default' : 'secondary'}>
                        {territory.status === 'available' ? (
                          <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                        ) : (
                          <Lock className="w-3 h-3 mr-1" weight="fill" />
                        )}
                        {territory.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="w-4 h-4 mr-1" />
                          Population
                        </div>
                        <p className="text-2xl font-bold">{(territory.population / 1000).toFixed(1)}K</p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CurrencyDollar className="w-4 h-4 mr-1" />
                          Median Income
                        </div>
                        <p className="text-2xl font-bold">
                          ${(territory.medianIncome / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Monthly Price</span>
                        <span className="text-xl font-bold text-primary">
                          ${territory.monthlyPrice}/mo
                        </span>
                      </div>
                      
                      {territory.status === 'available' ? (
                        <Button 
                          className="w-full"
                          onClick={() => handleClaimTerritory(territory)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Claim Territory
                        </Button>
                      ) : (
                        <Button className="w-full" variant="secondary" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Already Claimed
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showClaimDialog} onOpenChange={setShowClaimDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Claim Territory</DialogTitle>
            <DialogDescription className="text-base">
              Review the details before claiming this territory
            </DialogDescription>
          </DialogHeader>
          
          {selectedTerritory && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Territory</Label>
                <div className="text-lg font-semibold">
                  {selectedTerritory.city}, {selectedTerritory.state} {selectedTerritory.zip}
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTerritory.county} County
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Price</Label>
                  <p className="text-2xl font-bold text-primary">
                    {claimedTerritories && claimedTerritories.length < 10 ? 'FREE' : `$${selectedTerritory.monthlyPrice}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {claimedTerritories && claimedTerritories.length < 10 
                      ? 'First 10 territories FREE' 
                      : 'One-time purchase'}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Population</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {(selectedTerritory.population / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ZIP Code:</span>
                    <span className="font-semibold">{selectedTerritory.zip}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Median Income:</span>
                    <span className="font-semibold">
                      ${(selectedTerritory.medianIncome / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Timezone:</span>
                    <span className="font-semibold text-primary">
                      {selectedTerritory.timezone.split('/')[1]}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Entity Information */}
              <div className="space-y-4 pt-4 border-t">
                <Label className="text-sm font-semibold">Entity Information</Label>
                <div>
                  <Label htmlFor="entity-type">Entity Type *</Label>
                  <Select value={entityType} onValueChange={(v: EntityType) => {
                    setEntityType(v);
                    if (v === 'Individual') {
                      setTaxId('');
                    }
                    setValidationError(null);
                  }}>
                    <SelectTrigger id="entity-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="LLC">LLC</SelectItem>
                      <SelectItem value="Corporation">Corporation</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Only one territory per Individual/LLC/Corporation
                  </p>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder={currentUser?.email || 'your@email.com'}
                  />
                </div>

                {(entityType === 'LLC' || entityType === 'Corporation') && (
                  <div>
                    <Label htmlFor="tax-id">Tax ID (EIN) *</Label>
                    <Input
                      id="tax-id"
                      type="text"
                      value={taxId}
                      onChange={(e) => {
                        // Format EIN (XX-XXXXXXX)
                        const value = e.target.value.replace(/[^\d]/g, '');
                        if (value.length <= 9) {
                          const formatted = value.length > 2 
                            ? `${value.slice(0, 2)}-${value.slice(2)}`
                            : value;
                          setTaxId(formatted);
                        }
                        setValidationError(null);
                      }}
                      placeholder="XX-XXXXXXX"
                      maxLength={10}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for {entityType}. Format: XX-XXXXXXX
                    </p>
                  </div>
                )}

                {validationError && (
                  <Alert variant="destructive">
                    <Warning className="w-4 h-4" />
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowClaimDialog(false);
              setValidationError(null);
              setEntityType('Individual');
              setTaxId('');
              setEmail('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={validateClaim}
              disabled={validating || !!validationError}
            >
              <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
              {validating ? 'Validating...' : 'Confirm & Claim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
