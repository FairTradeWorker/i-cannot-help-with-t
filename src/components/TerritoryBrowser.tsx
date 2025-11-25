import { useState } from 'react';
import { motion } from 'framer-motion';
import { US_STATES, REGIONS, getStatesByRegion, type StateData } from '@/lib/us-states-data';
import { USMap } from './USMap';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MagnifyingGlass, 
  MapTrifold, 
  ListBullets, 
  Users, 
  Briefcase, 
  Star,
  TrendUp,
  Globe
} from '@phosphor-icons/react';

export function TerritoryBrowser() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'map' | 'list'>('map');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredStates = US_STATES.filter(state => {
    const matchesSearch = 
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.abbreviation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || state.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleStateClick = (state: StateData) => {
    setSelectedState(state);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold">Territory Map</h2>
            <p className="text-muted-foreground">
              Explore contractor availability across all 50 states
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('map')}
            >
              <MapTrifold className="w-4 h-4 mr-2" weight={view === 'map' ? 'fill' : 'regular'} />
              Map View
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('list')}
            >
              <ListBullets className="w-4 h-4 mr-2" weight={view === 'list' ? 'fill' : 'regular'} />
              List View
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            <Button
              variant={selectedRegion === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRegion('all')}
            >
              <Globe className="w-4 h-4 mr-2" />
              All Regions
            </Button>
            {REGIONS.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {view === 'map' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="glass-card p-6">
            <USMap
              onStateClick={handleStateClick}
              selectedState={selectedState?.abbreviation}
            />
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredStates.map((state, index) => (
            <motion.div
              key={state.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`glass-card p-4 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedState?.id === state.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedState(state)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{state.name}</h3>
                      <p className="text-sm text-muted-foreground">{state.capital}</p>
                    </div>
                    <Badge variant="secondary" className="font-mono">
                      {state.abbreviation}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" weight="duotone" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contractors</p>
                        <p className="text-sm font-semibold">
                          {state.activeContractors.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-secondary" weight="duotone" />
                      <div>
                        <p className="text-xs text-muted-foreground">Jobs</p>
                        <p className="text-sm font-semibold">
                          {state.totalJobs.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent" weight="fill" />
                      <div>
                        <p className="text-xs text-muted-foreground">Rating</p>
                        <p className="text-sm font-semibold">{state.averageRating.toFixed(1)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <TrendUp className="w-4 h-4 text-primary" weight="duotone" />
                      <div>
                        <p className="text-xs text-muted-foreground">Region</p>
                        <p className="text-sm font-semibold text-xs">{state.region}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Top Services</p>
                    <div className="flex flex-wrap gap-1">
                      {state.topServices.slice(0, 3).map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {selectedState && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedState.name}</h3>
                  <p className="text-muted-foreground">
                    Capital: {selectedState.capital} • Population: {selectedState.population.toLocaleString()}
                  </p>
                </div>
                <Badge className="text-lg px-4 py-2">{selectedState.abbreviation}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Contractors</p>
                  <p className="text-2xl font-bold text-primary">
                    {selectedState.activeContractors.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold text-secondary">
                    {selectedState.totalJobs.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold text-accent">
                    {selectedState.averageRating.toFixed(1)} ★
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Region</p>
                  <p className="text-2xl font-bold">{selectedState.region}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Top Services in {selectedState.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedState.topServices.map((service, index) => (
                    <Badge key={service} variant="secondary" className="text-sm px-3 py-1">
                      {index + 1}. {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Licensing Information</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Authority:</span> {selectedState.licensingAuthority}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={selectedState.licensingWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Visit Licensing Website
                      <TrendUp className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
