// FIRST 300: Main launch page with countdown and claimed zips map
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, CheckCircle, WarningCircle, Clock } from '@phosphor-icons/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { First300Counter } from '@/components/First300Counter';
import { First300Map } from '@/components/First300Map';
import { getFirst300Count, getFirst300ClaimedZips, FIRST_300_TOTAL, type First300Claim } from '@/lib/first300';
import { toast } from 'sonner';

export function First300Page() {
  const [count, setCount] = useState<number | null>(null);
  const [claimedZips, setClaimedZips] = useState<First300Claim[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [countData, zipsData] = await Promise.all([
        getFirst300Count(),
        getFirst300ClaimedZips()
      ]);
      setCount(countData);
      setClaimedZips(zipsData);
    } catch (error) {
      console.error('Failed to fetch First 300 data:', error);
      toast.error('Failed to load First Priority data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 8 seconds
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleClaimClick = () => {
    // Navigate to territories page
    window.location.href = '/#territories';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading First Priority launch...</p>
        </div>
      </div>
    );
  }

  const isComplete = count !== null && count <= 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          >
            First Priority Launch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            The first 300 operators get First Priority on every lead in their zip code — forever free.
            After that, it's $500 + $20/month to maintain First Priority status.
          </motion.p>
        </div>

        {/* Countdown Counter */}
        <div className="mb-8">
          <First300Counter />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Spots Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-primary">
                {count !== null ? count : '—'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {isComplete ? 'First Priority spots are full' : 'First Priority spots available'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Territories Claimed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-green-600">
                {FIRST_300_TOTAL - (count || 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                First Priority territories active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-blue-600">
                {new Set(claimedZips.map(z => z.zip.substring(0, 2))).size}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                States with First Priority territories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Map Visualization */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>First Priority Territories Map</CardTitle>
            <CardDescription>
              Live view of all claimed First Priority territories across the US
            </CardDescription>
          </CardHeader>
          <CardContent>
            <First300Map claimedZips={claimedZips} />
          </CardContent>
        </Card>

        {/* CTA Section */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">
                  Claim Your First Priority Spot Now
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Only {count} spots left nationwide. Drop your zip code below before your competitor gets first dibs forever.
                </p>
                <Button
                  size="lg"
                  onClick={handleClaimClick}
                  className="text-lg px-8 py-6"
                >
                  Claim First Priority →
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Pricing Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>First 300 Operators</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>First Priority on every lead in your zip code</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Forever free — no monthly fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Exclusive access before Second Priority operators</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>After First 300</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <WarningCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>$500 one-time fee to claim territory</span>
                </li>
                <li className="flex items-start gap-2">
                  <WarningCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>$20/month to maintain First Priority status</span>
                </li>
                <li className="flex items-start gap-2">
                  <WarningCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>If subscription lapses → automatically downgraded to Second Priority</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

