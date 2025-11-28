import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassSurface, type GlassContext } from './GlassSurface';

interface HologramCard {
  id: string;
  priority: number;  // 0-100
  data: any;
  context: GlassContext;
}

interface HologramLayoutProps {
  cards: HologramCard[];
  renderCard: (card: HologramCard) => React.ReactNode;
  columns?: number;
  onCardClick?: (card: HologramCard) => void;
}

/**
 * Hologram Layout System - Self-organizing card grid
 * 
 * Cards automatically reposition based on priority, urgency, match quality, etc.
 */
export function HologramLayout({ 
  cards, 
  renderCard, 
  columns = 3,
  onCardClick 
}: HologramLayoutProps) {
  const [sortedCards, setSortedCards] = useState<HologramCard[]>([]);
  const [gridColumns, setGridColumns] = useState(columns);

  // Calculate responsive columns
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setGridColumns(1);
      else if (width < 1024) setGridColumns(2);
      else if (width < 1536) setGridColumns(3);
      else setGridColumns(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Sort cards by priority
  useEffect(() => {
    const sorted = [...cards].sort((a, b) => b.priority - a.priority);
    setSortedCards(sorted);
  }, [cards]);

  return (
    <div 
      className="hologram-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: '1.5rem',
        padding: '1rem'
      }}
    >
      <AnimatePresence mode="popLayout">
        {sortedCards.map((card, index) => (
          <motion.div
            key={card.id}
            layout
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
              layout: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
              delay: index * 0.05
            }}
            onClick={() => onCardClick?.(card)}
            className="cursor-pointer"
          >
            <GlassSurface
              id={`hologram-${card.id}`}
              context={card.context}
            >
              {renderCard(card)}
            </GlassSurface>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Calculate card priority based on multiple factors
 */
export function calculateCardPriority(
  urgency: 'low' | 'medium' | 'high' | 'critical',
  matchScore?: number,
  profitPotential?: number,
  hoursUntilDeadline?: number
): number {
  let priority = 0;

  // Urgency (0-40 points)
  const urgencyScores = {
    critical: 40,
    high: 30,
    medium: 15,
    low: 5
  };
  priority += urgencyScores[urgency] || 0;

  // Match quality (0-30 points)
  if (matchScore !== undefined) {
    priority += matchScore * 30;
  }

  // Profit potential (0-20 points)
  if (profitPotential !== undefined) {
    priority += Math.min(profitPotential / 1000 * 20, 20);
  }

  // Time sensitivity (0-10 points)
  if (hoursUntilDeadline !== undefined) {
    if (hoursUntilDeadline < 24) priority += 10;
    else if (hoursUntilDeadline < 48) priority += 5;
    else if (hoursUntilDeadline < 72) priority += 2;
  }

  return Math.min(priority, 100);
}

