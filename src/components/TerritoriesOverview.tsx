import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { 
  Lightning,
  MapTrifold,
  CurrencyDollar,
  TrendUp,
  CheckCircle,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Territory {
  id: string;
  state: string;
  zip: string;
  demandScore: number;
  annualRevenue: number;
  claimed: boolean;
}

interface TerritoriesOverviewProps {
  onNavigateToDetail?: (stateCode: string) => void;
}

const states = [
  'CA', 'TX', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'WA', 'AZ', 'MA', 'VA', 'CO', 'WI', 'MN', 'OR', 'NV', 'NM',
  'KS', 'SD', 'LA', 'AL', 'KY', 'MD', 'NJ', 'RI', 'ME',
];

export function TerritoriesOverview({ onNavigateToDetail }: TerritoriesOverviewProps) {
  const [claimedTerritories, setClaimedTerritories] = useKV<string[]>('claimed-territories', []);
  const [searchQuery, setSearchQuery] = useState('');

  const territories: Territory[] = states.map((state) => ({
    id: `${state}-001`,
    state,
    zip: '00000',
    demandScore: Math.floor(Math.random() * 100),
    annualRevenue: (Math.random() * 2 + 0.5) * 1000000,
    claimed: claimedTerritories?.includes(state) || false,
  }));

  const filteredTerritories = territories.filter(t => 
    t.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const claimedCount = claimedTerritories?.length || 0;

  const handleClaimTerritory = (stateCode: string) => {
    setClaimedTerritories((current) => {
      if (current?.includes(stateCode)) {
        return current.filter(s => s !== stateCode);
      }
      if (current && current.length >= 1) {
        toast.error('Territory Limit Reached', {
          description: 'You can only own one territory. Please release your current territory before claiming a new one.',
        });
        return current;
      }
      return [...(current || []), stateCode];
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Territories</h1>
            <p className="text-muted-foreground">Priority Access to first Leads in your zip codes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Claimed</p>
            <p className="text-3xl font-bold font-mono">{claimedCount}/{territories.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary">
                <MapTrifold className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{territories.length}</p>
                <p className="text-sm text-muted-foreground">Total Territories</p>
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
              <div className="p-3 rounded-xl bg-secondary">
                <Lightning className="w-6 h-6 text-white" weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold font-mono">{territories.filter(t => !t.claimed).length}</p>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search by state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerritories.map((territory, index) => (
          <motion.div
            key={territory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
          >
            <Card className={`p-6 glass-card glass-hover ${territory.claimed ? 'border-primary' : ''}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${territory.claimed ? 'bg-primary' : 'bg-muted'}`}>
                      <MapTrifold className={`w-6 h-6 ${territory.claimed ? 'text-white' : 'text-foreground'}`} weight="fill" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{territory.state}</h3>
                      <p className="text-xs text-muted-foreground">State Territory</p>
                    </div>
                  </div>
                  {territory.claimed && (
                    <CheckCircle className="w-6 h-6 text-primary" weight="fill" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Demand Score</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={territory.demandScore > 70 ? 'default' : 'secondary'}>
                        {territory.demandScore}/100
                      </Badge>
                      {territory.demandScore > 70 && (
                        <TrendUp className="w-4 h-4 text-accent" weight="bold" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Est. Annual Revenue</span>
                    <span className="font-mono font-semibold">
                      ${(territory.annualRevenue / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Cost</span>
                    <span className="font-mono font-semibold">$45</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleClaimTerritory(territory.state)}
                  variant={territory.claimed ? 'outline' : 'default'}
                  className="w-full"
                >
                  {territory.claimed ? 'Release Territory' : 'Claim Territory'}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
