import { useState } from 'react';
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
  X
} from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
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
import { USMap } from './USMap';

export function TerritoryMapPage() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryZip | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);

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

  const handleClaimTerritory = (territory: TerritoryZip) => {
    setSelectedTerritory(territory);
    setShowClaimDialog(true);
  };

  const confirmClaim = () => {
    if (selectedTerritory) {
      setClaimedTerritories(current => [...(current || []), selectedTerritory.zip]);
      
      toast.success('Territory Claimed!', {
        description: `${selectedTerritory.city}, ${selectedTerritory.state} - $45/month for Exclusive Rights to Our Leads`,
      });
      
      setShowClaimDialog(false);
      setSelectedTerritory(null);
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
            <Card>
              <CardContent className="p-6">
                <USMap
                  selectedState={selectedState?.abbreviation}
                  onStateClick={handleStateClick}
                />
              </CardContent>
            </Card>
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
                  <Label className="text-sm text-muted-foreground">Monthly Price</Label>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedTerritory.monthlyPrice}/mo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Exclusive Rights to Our Leads
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
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClaimDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmClaim}>
              <CheckCircle className="w-4 h-4 mr-2" weight="fill" />
              Confirm & Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
