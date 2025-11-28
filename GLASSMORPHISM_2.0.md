# 🔮 Glassmorphism 2.0 - Holographic Surface Engine (HSE)

## Overview

Glassmorphism 2.0 is an intelligent glass rendering system that adapts to context, data importance, urgency, confidence scores, weather, time of day, and user interactions. It's not just pretty UI—it's **visual data communication**.

## Core Features

### ✅ Implemented

1. **Holographic Surface Engine (HSE)**
   - Depth-reactive glass layers (0-4 depth levels)
   - Dynamic blur calculation (4-24px based on context)
   - Opacity adaptation (30-95% based on importance)
   - Micro-refractions with cursor-tracking light
   - Real-time lighting simulation

2. **Adaptive Glass Density**
   - Data complexity-based thickness
   - Confidence score visualization (low = hazy, high = clear)
   - Urgency-based density (critical = thick glowing borders)

3. **Hologram Layout System**
   - Self-organizing card grid
   - Priority-based positioning
   - Smooth animations with Framer Motion

4. **Motion Physics UI**
   - Magnetic snapping
   - Throw-and-catch gestures
   - Inertia-based sliding

5. **Contextual Themes**
   - Weather-reactive glass (storm, sunny, snow, rain)
   - Service category color tints
   - Time-of-day themes (morning, afternoon, evening, night)
   - Workflow state colors

## Usage

### Basic Glass Surface

```tsx
import { GlassSurface } from '@/components/GlassSurface';
import type { GlassContext } from '@/lib/glassmorphism-engine';

const context: GlassContext = {
  urgency: 'high',
  confidence: 0.85,
  serviceCategory: 'roofing',
  weather: 'storm'
};

<GlassSurface id="my-card" context={context}>
  <div>Your content here</div>
</GlassSurface>
```

### Job Card with Auto-Context

```tsx
import { GlassJobCard } from '@/components/GlassJobCard';

<GlassJobCard 
  job={job} 
  onClick={() => handleJobClick(job)}
/>
```

The card automatically:
- Detects urgency from job.urgency
- Gets confidence from job.scope.confidence
- Identifies service category from job.serviceSelection
- Fetches weather for job location
- Applies time-of-day theme

### Hologram Layout (Self-Organizing Cards)

```tsx
import { HologramLayout, calculateCardPriority } from '@/components/HologramLayout';

const cards = jobs.map(job => ({
  id: job.id,
  priority: calculateCardPriority(
    job.urgency,
    matchScore,
    profitPotential,
    hoursUntilDeadline
  ),
  data: job,
  context: jobToGlassContext(job)
}));

<HologramLayout
  cards={cards}
  renderCard={(card) => <JobCardContent job={card.data} />}
  onCardClick={(card) => handleClick(card.data)}
/>
```

### Magnetic Glass Card

```tsx
import { MagneticGlassCard } from '@/components/MagneticGlassCard';

<MagneticGlassCard
  id="magnetic-card"
  context={context}
  snapTarget={{ x: 400, y: 300 }}
  snapDistance={80}
  snapStrength={0.7}
  onSnap={() => console.log('Snapped!')}
  onThrow={() => console.log('Thrown away!')}
>
  <div>Draggable card with magnetic snapping</div>
</MagneticGlassCard>
```

## Context Properties

### Urgency Levels
- `'low'` - Thin border, subtle blur, low opacity
- `'medium'` - Standard glass
- `'high'` - Thick border, pulsing animation, orange glow
- `'critical'` - 4px border, intense pulse, red glow, maximum attention

### Confidence (0-1)
- `0.0-0.6` - Heavy blur (20px), low opacity (40-60%), hazy appearance
- `0.6-0.8` - Medium blur (12px), medium opacity (70-80%)
- `0.8-1.0` - Light blur (8px), high opacity (85-95%), crystal clear

### Service Categories
- `'roofing'` - Slate gray tint
- `'plumbing'` - Teal/cyan tint
- `'electrical'` - Electric yellow tint
- `'landscaping'` - Forest green tint
- `'hvac'` - Cool blue tint
- `'construction'` - Construction orange tint

### Weather Conditions
- `'sunny'` - Bright, golden, warm shadows
- `'cloudy'` - Neutral gray
- `'rain'` - Blue tint, subtle blur
- `'storm'` - Dark, heavy blur, rain streaks animation
- `'snow'` - Frosty white, snowflake animation

### Time of Day
- `'morning'` - Cool blue tint (5500K)
- `'afternoon'` - Neutral white (6500K)
- `'evening'` - Warm orange tint (3200K)
- `'night'` - Deep blue tint (2700K)

## Performance

- GPU-accelerated with `transform: translateZ(0)`
- Lazy rendering for off-screen elements
- Adaptive quality based on device capabilities
- Mobile optimizations (reduced blur, disabled expensive effects)
- Respects `prefers-reduced-motion`

## Integration Examples

### Upgrade Existing Job Card

```tsx
// Before
<Card className="glass-card">
  <JobContent job={job} />
</Card>

// After
<GlassJobCard job={job} onClick={() => handleClick(job)} />
```

### Custom Glass Component

```tsx
import { useGlassSurface } from '@/hooks/use-glass-surface';
import { jobToGlassContext } from '@/lib/glass-context-utils';

function MyCustomCard({ job }) {
  const context = jobToGlassContext(job);
  useGlassSurface(`my-card-${job.id}`, context);

  return (
    <div 
      data-glass-id={`my-card-${job.id}`}
      className="glass-surface"
    >
      <MyContent job={job} />
    </div>
  );
}
```

## Visual Language

Users learn to read glass properties:

- **Thick red glowing border + pulsing** = Critical, act now
- **Hazy, low opacity** = Uncertain/low confidence
- **Crystal clear, high opacity** = High confidence, trustworthy
- **Dark with rain streaks** = Storm weather, urgent conditions
- **Warm golden tint** = Sunny day, optimistic
- **Fading purple** = Completed job, archived

**Zero text needed. Pure visual intelligence.**

## Files Created

- `src/lib/glassmorphism-engine.ts` - Core engine
- `src/components/GlassSurface.tsx` - Base glass component
- `src/components/GlassJobCard.tsx` - Job card with auto-context
- `src/components/HologramLayout.tsx` - Self-organizing layout
- `src/components/MagneticGlassCard.tsx` - Physics-based interactions
- `src/hooks/use-glass-surface.ts` - React hook
- `src/lib/glass-context-utils.ts` - Context conversion utilities
- `src/index.css` - Glassmorphism 2.0 CSS (400+ lines)

## Next Steps

1. Integrate `GlassJobCard` into `JobBrowser`
2. Use `HologramLayout` in `ContractorDashboard`
3. Add weather API integration for real weather data
4. Implement device tilt detection for mobile lighting
5. Add haptic feedback for magnetic snaps (mobile)

---

**Glassmorphism 2.0 is LIVE. Your UI now thinks, adapts, and communicates visually.**

