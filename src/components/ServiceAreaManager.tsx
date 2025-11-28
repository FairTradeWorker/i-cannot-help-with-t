// Service Area Management - Visual map-based service area configuration
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Minus,
  Trash,
  PencilSimple,
  Check,
  X,
  Target,
  GlobeHemisphereWest,
  Car,
  Clock,
  CurrencyDollar,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { territoryZips, getTerritoriesByState, type TerritoryZip } from '@/lib/territory-data';

interface ServiceZone {
  id: string;
  name: string;
  type: 'primary' | 'extended' | 'on-request';
  zipCodes: string[];
  radius: number; // miles
  travelFee: number;
  enabled: boolean;
  center?: { lat: number; lng: number };
}

interface ServiceAreaManagerProps {
  userId?: string;
  onSave?: (zones: ServiceZone[]) => void;
}

const defaultZones: ServiceZone[] = [
  {
    id: 'zone-1',
    name: 'Primary Service Area',
    type: 'primary',
    zipCodes: ['78701', '78702', '78703', '78704', '78705'],
    radius: 15,
    travelFee: 0,
    enabled: true,
    center: { lat: 30.27, lng: -97.74 },
  },
  {
    id: 'zone-2',
    name: 'Extended Area',
    type: 'extended',
    zipCodes: ['78721', '78722', '78723', '78724', '78725'],
    radius: 30,
    travelFee: 25,
    enabled: true,
    center: { lat: 30.30, lng: -97.70 },
  },
  {
    id: 'zone-3',
    name: 'Special Request Zone',
    type: 'on-request',
    zipCodes: [],
    radius: 50,
    travelFee: 75,
    enabled: false,
    center: { lat: 30.25, lng: -97.80 },
  },
];

export function ServiceAreaManager({ userId, onSave }: ServiceAreaManagerProps) {
  const [zones, setZones] = useState<ServiceZone[]>(defaultZones);
  const [selectedZone, setSelectedZone] = useState<string | null>('zone-1');
  const [editingZone, setEditingZone] = useState<ServiceZone | null>(null);
  const [searchZip, setSearchZip] = useState('');
  const [homeBase, setHomeBase] = useState({ address: '123 Main St, Austin, TX 78701' });
  const [maxTravelDistance, setMaxTravelDistance] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the map
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
    ctx.fillStyle = 'rgba(248, 250, 252, 1)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      ctx.beginPath();
      ctx.moveTo(i * (width / 20), 0);
      ctx.lineTo(i * (width / 20), height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * (height / 20));
      ctx.lineTo(width, i * (height / 20));
      ctx.stroke();
    }

    // Center point (Austin area)
    const centerLat = 30.27;
    const centerLng = -97.74;
    const scale = 15; // pixels per mile approximately
    
    const toX = (lng: number) => width / 2 + (lng - centerLng) * scale * 10;
    const toY = (lat: number) => height / 2 - (lat - centerLat) * scale * 10;
    
    // Draw zones as circles
    zones.forEach(zone => {
      if (!zone.enabled || !zone.center) return;
      
      const x = toX(zone.center.lng);
      const y = toY(zone.center.lat);
      const r = zone.radius * scale / 3;
      
      // Zone circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      
      if (zone.type === 'primary') {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
      } else if (zone.type === 'extended') {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      } else {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      }
      
      ctx.lineWidth = selectedZone === zone.id ? 3 : 2;
      ctx.fill();
      ctx.stroke();
    });
    
    // Draw zip code markers from territory data
    const txZips = getTerritoriesByState('TX').slice(0, 50);
    txZips.forEach(zip => {
      const x = toX(zip.longitude);
      const y = toY(zip.latitude);
      
      // Check if in any zone
      const inZone = zones.some(z => z.zipCodes.includes(zip.zip));
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = inZone ? 'rgba(59, 130, 246, 0.8)' : 'rgba(100, 116, 139, 0.5)';
      ctx.fill();
    });
    
    // Draw home base
    const homeX = toX(centerLng);
    const homeY = toY(centerLat);
    
    ctx.beginPath();
    ctx.arc(homeX, homeY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
  }, [zones, selectedZone]);

  const addZipToZone = (zipCode: string) => {
    if (!selectedZone) return;
    
    setZones(zones.map(z => {
      if (z.id === selectedZone && !z.zipCodes.includes(zipCode)) {
        return { ...z, zipCodes: [...z.zipCodes, zipCode] };
      }
      return z;
    }));
    toast.success(`Added ${zipCode} to zone`);
  };

  const removeZipFromZone = (zoneId: string, zipCode: string) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, zipCodes: z.zipCodes.filter(zc => zc !== zipCode) };
      }
      return z;
    }));
  };

  const toggleZone = (zoneId: string) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, enabled: !z.enabled };
      }
      return z;
    }));
  };

  const updateZone = (zoneId: string, updates: Partial<ServiceZone>) => {
    setZones(zones.map(z => {
      if (z.id === zoneId) {
        return { ...z, ...updates };
      }
      return z;
    }));
  };

  const addNewZone = () => {
    const newZone: ServiceZone = {
      id: `zone-${Date.now()}`,
      name: 'New Service Zone',
      type: 'extended',
      zipCodes: [],
      radius: 20,
      travelFee: 50,
      enabled: true,
      center: { lat: 30.27, lng: -97.74 },
    };
    setZones([...zones, newZone]);
    setSelectedZone(newZone.id);
    toast.success('New zone created');
  };

  const deleteZone = (zoneId: string) => {
    if (zones.length <= 1) {
      toast.error('You must have at least one service zone');
      return;
    }
    setZones(zones.filter(z => z.id !== zoneId));
    setSelectedZone(zones[0]?.id || null);
    toast.success('Zone deleted');
  };

  const handleSave = () => {
    onSave?.(zones);
    toast.success('Service areas saved successfully!');
  };

  const selectedZoneData = zones.find(z => z.id === selectedZone);

  // Search for zip codes
  const searchResults = searchZip.length >= 3 
    ? territoryZips.filter(z => z.zip.includes(searchZip) || z.city.toLowerCase().includes(searchZip.toLowerCase())).slice(0, 10)
    : [];

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
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Service Areas</h1>
              <p className="text-muted-foreground">Define where you provide services</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <GlobeHemisphereWest className="w-5 h-5" />
                Service Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden border mb-4">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  className="w-full h-auto cursor-pointer"
                  onClick={(e) => {
                    // Could implement click-to-add functionality here
                  }}
                />
                
                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur p-3 rounded-lg border shadow-sm">
                  <p className="text-xs font-semibold mb-2">Legend</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span>Home Base</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-blue-500/50"></span>
                      <span>Primary Zone</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
                      <span>Extended Zone</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full bg-amber-500/50"></span>
                      <span>On-Request</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Home Base Setting */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <Label className="text-sm font-semibold">Home Base Address</Label>
                <Input
                  value={homeBase.address}
                  onChange={(e) => setHomeBase({ address: e.target.value })}
                  className="mt-2"
                  placeholder="Enter your business address"
                />
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex-1">
                    <Label className="text-xs">Max Travel Distance: {maxTravelDistance} miles</Label>
                    <Slider
                      value={[maxTravelDistance]}
                      onValueChange={([value]) => setMaxTravelDistance(value)}
                      min={10}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zone Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Service Zones</CardTitle>
                <Button size="sm" variant="outline" onClick={addNewZone}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Zone List */}
              {zones.map(zone => (
                <div
                  key={zone.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedZone === zone.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedZone(zone.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        zone.type === 'primary' ? 'default' :
                        zone.type === 'extended' ? 'secondary' : 'outline'
                      }>
                        {zone.type}
                      </Badge>
                      <span className="font-medium">{zone.name}</span>
                    </div>
                    <Switch
                      checked={zone.enabled}
                      onCheckedChange={() => toggleZone(zone.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {zone.zipCodes.length} zips
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      {zone.radius} mi
                    </span>
                    <span className="flex items-center gap-1">
                      <CurrencyDollar className="w-3 h-3" />
                      ${zone.travelFee}
                    </span>
                  </div>
                </div>
              ))}

              {/* Selected Zone Details */}
              {selectedZoneData && (
                <div className="pt-4 border-t space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Zone Settings</h4>
                    {zones.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteZone(selectedZoneData.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Zone Name</Label>
                      <Input
                        value={selectedZoneData.name}
                        onChange={(e) => updateZone(selectedZoneData.id, { name: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Radius: {selectedZoneData.radius} miles</Label>
                      <Slider
                        value={[selectedZoneData.radius]}
                        onValueChange={([value]) => updateZone(selectedZoneData.id, { radius: value })}
                        min={5}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Travel Fee: ${selectedZoneData.travelFee}</Label>
                      <Slider
                        value={[selectedZoneData.travelFee]}
                        onValueChange={([value]) => updateZone(selectedZoneData.id, { travelFee: value })}
                        min={0}
                        max={200}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  {/* Add Zip Codes */}
                  <div>
                    <Label className="text-xs">Add Zip Codes</Label>
                    <div className="relative mt-1">
                      <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={searchZip}
                        onChange={(e) => setSearchZip(e.target.value)}
                        placeholder="Search zip or city..."
                        className="pl-9"
                      />
                    </div>
                    
                    {searchResults.length > 0 && (
                      <div className="mt-2 max-h-32 overflow-y-auto border rounded-md">
                        {searchResults.map(result => (
                          <div
                            key={result.zip}
                            className="p-2 text-sm hover:bg-muted cursor-pointer flex items-center justify-between"
                            onClick={() => {
                              addZipToZone(result.zip);
                              setSearchZip('');
                            }}
                          >
                            <span>{result.zip} - {result.city}, {result.state}</span>
                            <Plus className="w-4 h-4" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Current Zip Codes */}
                  <div>
                    <Label className="text-xs">Current Zip Codes ({selectedZoneData.zipCodes.length})</Label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedZoneData.zipCodes.map(zip => (
                        <Badge key={zip} variant="secondary" className="pr-1">
                          {zip}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-4 w-4 ml-1 hover:bg-destructive/20"
                            onClick={() => removeZipFromZone(selectedZoneData.id, zip)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      ))}
                      {selectedZoneData.zipCodes.length === 0 && (
                        <span className="text-xs text-muted-foreground">No zip codes added</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
