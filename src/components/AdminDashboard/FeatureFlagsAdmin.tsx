/**
 * Feature Flags Admin UI
 * 
 * This component provides an admin interface for managing feature flags,
 * including enabling/disabling flags, viewing flag status, and managing rollouts.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import {
  Flag,
  MagnifyingGlass,
  Funnel,
  Lightning,
  Users,
  ChartLine,
  Gear,
  Trash,
  Plus,
  Eye,
  EyeSlash,
} from '@phosphor-icons/react';
import {
  getAllFlags,
  overrideFlag,
  clearOverride,
  getOverrides,
  updateFlag,
  type FeatureFlag,
} from '@/lib/feature-flags';

// ============================================================================
// Types
// ============================================================================

interface FlagStats {
  totalFlags: number;
  enabledFlags: number;
  disabledFlags: number;
  overriddenFlags: number;
  rolloutFlags: number;
}

// ============================================================================
// Feature Flag Card Component
// ============================================================================

interface FlagCardProps {
  flag: FeatureFlag;
  isOverridden: boolean;
  overrideValue?: boolean;
  onToggle: (key: string, enabled: boolean) => void;
  onOverride: (key: string, enabled: boolean) => void;
  onClearOverride: (key: string) => void;
  onEdit: (flag: FeatureFlag) => void;
}

function FlagCard({
  flag,
  isOverridden,
  overrideValue,
  onToggle,
  onOverride,
  onClearOverride,
  onEdit,
}: FlagCardProps) {
  const effectiveEnabled = isOverridden ? overrideValue : flag.enabled;

  return (
    <Card className={`transition-all ${isOverridden ? 'ring-2 ring-yellow-400' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{flag.name}</h3>
              {flag.variants && flag.variants.length > 0 && (
                <Badge variant="outline" className="text-xs">A/B Test</Badge>
              )}
              {isOverridden && (
                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                  Override
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{flag.description}</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">{flag.key}</code>
            
            {flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Rollout</span>
                  <span>{flag.rolloutPercentage}%</span>
                </div>
                <Progress value={flag.rolloutPercentage} className="h-1.5" />
              </div>
            )}
            
            {flag.targetRules && flag.targetRules.length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{flag.targetRules.length} targeting rule(s)</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Switch
              checked={effectiveEnabled}
              onCheckedChange={(checked) => onToggle(flag.key, checked)}
            />
            <div className="flex gap-1">
              {isOverridden ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onClearOverride(flag.key)}
                  className="h-7 px-2 text-xs"
                >
                  Clear Override
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onOverride(flag.key, !flag.enabled)}
                  className="h-7 px-2 text-xs"
                >
                  {flag.enabled ? <EyeSlash className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(flag)}
                className="h-7 px-2 text-xs"
              >
                <Gear className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main Feature Flags Admin Component
// ============================================================================

export function FeatureFlagsAdmin() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled' | 'rollout'>('all');
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);

  useEffect(() => {
    setFlags(getAllFlags());
    setOverrides(getOverrides());
  }, []);

  const handleToggle = (key: string, enabled: boolean) => {
    updateFlag(key, { enabled });
    setFlags(getAllFlags());
  };

  const handleOverride = (key: string, enabled: boolean) => {
    overrideFlag(key, enabled);
    setOverrides(getOverrides());
  };

  const handleClearOverride = (key: string) => {
    clearOverride(key);
    setOverrides(getOverrides());
  };

  const handleEdit = (flag: FeatureFlag) => {
    setSelectedFlag(flag);
  };

  // Calculate stats
  const stats: FlagStats = {
    totalFlags: flags.length,
    enabledFlags: flags.filter(f => f.enabled).length,
    disabledFlags: flags.filter(f => !f.enabled).length,
    overriddenFlags: Object.keys(overrides).length,
    rolloutFlags: flags.filter(f => f.rolloutPercentage !== undefined && f.rolloutPercentage < 100).length,
  };

  // Filter flags
  const filteredFlags = flags.filter(flag => {
    const matchesSearch = 
      flag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flag.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'enabled':
        return flag.enabled;
      case 'disabled':
        return !flag.enabled;
      case 'rollout':
        return flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100;
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary">
              <Flag className="w-8 h-8 text-white" weight="fill" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Feature Flags</h1>
              <p className="text-muted-foreground">Manage feature rollouts and A/B tests</p>
            </div>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Flag
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.totalFlags}</div>
              <div className="text-sm text-muted-foreground">Total Flags</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.enabledFlags}</div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.disabledFlags}</div>
              <div className="text-sm text-muted-foreground">Disabled</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.overriddenFlags}</div>
              <div className="text-sm text-muted-foreground">Overridden</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.rolloutFlags}</div>
              <div className="text-sm text-muted-foreground">In Rollout</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search flags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="enabled">Enabled</TabsTrigger>
              <TabsTrigger value="disabled">Disabled</TabsTrigger>
              <TabsTrigger value="rollout">In Rollout</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Flags List */}
        <div className="grid gap-4">
          {filteredFlags.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Flag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No flags found</h3>
                <p className="text-muted-foreground">
                  {searchQuery 
                    ? 'Try adjusting your search or filter' 
                    : 'Create your first feature flag to get started'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFlags.map(flag => (
              <FlagCard
                key={flag.key}
                flag={flag}
                isOverridden={flag.key in overrides}
                overrideValue={overrides[flag.key]}
                onToggle={handleToggle}
                onOverride={handleOverride}
                onClearOverride={handleClearOverride}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        {/* Developer Note */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lightning className="w-5 h-5 text-primary mt-0.5" weight="fill" />
              <div>
                <h4 className="font-semibold mb-1">Developer Note</h4>
                <p className="text-sm text-muted-foreground">
                  Local overrides are stored in your browser and only affect your session.
                  They're useful for testing features without affecting other users.
                  Clear overrides to see the actual flag state for production users.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default FeatureFlagsAdmin;
