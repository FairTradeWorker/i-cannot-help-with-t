// FIRST 300: Live countdown header component
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WarningCircle } from '@phosphor-icons/react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function First300Counter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    try {
      // Use Spark KV directly since this is a client component
      const count = await window.spark.kv.get<number>('first300-count');
      setCount(count ?? 300);
    } catch (error) {
      console.error('Failed to fetch First 300 count:', error);
      setCount(300); // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
    // Refresh every 8 seconds
    const interval = setInterval(fetchCount, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading || count === null) {
    return (
      <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
        <WarningCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-900 dark:text-red-100">
          Loading First Priority spots...
        </AlertDescription>
      </Alert>
    );
  }

  if (count <= 0) {
    return (
      <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
        <WarningCircle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-900 dark:text-orange-100 font-semibold">
          First Priority spots are full. New claims require $500 + $20/month.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Alert className="border-red-500 bg-red-50 dark:bg-red-950/20">
        <WarningCircle className="h-4 w-4 text-red-600 animate-pulse" />
        <AlertDescription className="text-red-900 dark:text-red-100">
          <span className="font-black text-2xl md:text-3xl">{count}</span>
          <span className="ml-2 font-semibold text-lg">
            SPOTS LEFT NATIONWIDE
          </span>
          <p className="text-sm mt-1 opacity-90">
            Claim First Priority on your zip code before your competitor gets first dibs forever
          </p>
        </AlertDescription>
      </Alert>
    </motion.div>
  );
}

