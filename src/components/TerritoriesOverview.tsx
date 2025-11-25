import { useState, useEffect, useRef } from 'react';
import { useKV } from '@github/spark/ho
import { useKV } from '@github/spark/hooks';
import {
  Sparkle,
} from '@
import { B
import { territor
  Sparkle,
  Lightning,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { territoryZips, type TerritoryZip } from '@/lib/territory-data';
import { useIsMobile } from '@/hooks/use-mobile';

  IL: "M550,220 L600,220 L600,320 L550,320
  MI: "M600,140 L650,
  OR: "M90,140 L170,14
  UT: "M230,240 L280,24
  NM: "M250,360 L320,360
 

  SD: "M360,130 L460,130 L460,200 L3
  KS: "M380,270 L500,270 L500,340 L380,340 Z",
 

  LA: "M500,430 L570,430 L570,510 L500,510 Z",
  AL: "M620,380 L670,380 L670,480 L620,480 Z
  WI: "M550,120 L610,120 L610,220 L550,220 Z",
  KY: "M620,300 L700,300 L700,360 L620,360 Z",
  WV: "M700,240 L750,240 L750,310 L700,310 Z",
  NC: "M680,340 L780,340 L780,400 L680,400 Z",
  MD: "M760,250 L810,250 L810,290 L760,290 Z",
  NJ: "M790,210 L820,210 L820,260 L790,260 Z",
  RI: "M830,180 L845,180 L845,200 L830,200 Z",
  VT: "M810,120 L835,120 L835,170 L810,170 Z
  ME: "M840,80 L880,80 L880,160 L840,160 Z",

  const [claimedTerritories, setClaimedTerrito
  const [mousePos, setMousePos] = useState({ x
  const containerRef = useRef<HTMLDivElement>(

    ...t,
    demandScore: Math.floor(Math.random() * 
    annualRevenue: (Math.random() * 2 + 0.5) *

  const moatMultiplier = (claimedCount / terri

    if (claimedCount > 100) {
    }

    if (containerRef.current) {
      setMousePos({
        y: e.clientY - rect.top,
    }

    if (onNavigateToDetail) {
    }

    const stateTerritories = territories.filte
    const highDemandInState = stateTerritories
    if (claimedInState > 0) return 'claimed';
    return 'default';

    return (
        initial={{ opacity: 0, y: 20 }}
  MD: "M760,250 L810,250 L810,290 L760,290 Z",
  DE: "M800,260 L820,260 L820,300 L800,300 Z",
  NJ: "M790,210 L820,210 L820,260 L790,260 Z",
  CT: "M810,180 L840,180 L840,210 L810,210 Z",
  RI: "M830,180 L845,180 L845,200 L830,200 Z",
                transition={{ duration: 3, rep
                <MapTrifold className="w-24 h-
              
                Territory Dominance Engine
  

                  {claimedCount} territories
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  {moatMultiplier}× moat
                <Badge className="bg-secondary/20 text-seco
                  ${runRate}M run-rate
              </div>
              <p className="text-

              <Button 
         
              >
                Explore Map
            </div>
        </Card>
    );

    <motion.div
      initial={{ opacity: 0 }}
      transition={{ duration: 0.6 }}

      {showParticle
          {[...Array(30)].map
              key={i}
     
                y: Ma

                y: [null, '-100%'],
              }}
                duration: Math.random() * 3 + 2,
                del
              }}
          ))}
      )}
     
    

        >
            Territory Dominan
          <p className="text-sm text
     
    

        className="absolute top-6 right-6 z-20 g
        <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">{claimedCount}</div>
          </div>

            <div className="text-xs text-mute
          <div className="w-px h-10 bg-border" />
            <div clas
    

      <div classN
          vi
          style={
          <defs>
              <feGaussianBlur stdDevia
                <feMergeNode in="color
              </feMerge>
       
          {Object.entries(statePathsSimplified).map((
            const fillColor = 
              colorType === 'high-demand' ? 'oklch(0.70 0.20 320 / 0.3)' :
            
              <motion.path
                d={path}
                st
                transition={{ duration: 3, repeat: Infinity }}
              >
                <MapTrifold className="w-24 h-24 text-primary mb-4" weight="fill" />
              </motion.div>
              
              <h2 className="text-2xl font-bold mb-2">
      {hoveredTerritory && (
              </h2>
              
              <div className="flex flex-wrap gap-2 justify-center mb-4">
            top: mousePos.y + 20,
                  <Sparkle className="w-3 h-3 mr-1" weight="fill" />
            <div className="font-bold text-l
                </Badge>
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Shield className="w-3 h-3 mr-1" weight="fill" />
            </div>
                </Badge>
                <Badge className="bg-secondary/20 text-secondary border-secondary/30">
                  <CurrencyDollar className="w-3 h-3 mr-1" weight="fill" />
                  ${runRate}M run-rate
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Tap to explore detailed territory map with real-time analytics
              </p>
              

                size="lg" 
                onClick={() => handleStateClick('overview')}


                <Lightning className="w-5 h-5 mr-2" weight="fill" />

              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

  }

  return (

      ref={containerRef}

      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-[calc(100vh-10rem)] w-full rounded-2xl overflow-hidden glass-card"
      onMouseMove={handleMouseMove}
    >

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary"
              initial={{ 
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                opacity: 0 

              animate={{
                y: [null, '-100%'],
                opacity: [0, 1, 0],

              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear',

            />
          ))}
        </div>
      )}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"

          <h1 className="text-3xl font-bold mb-1 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">

          </h1>
          <p className="text-sm text-muted-foreground">Real-time territory intelligence & market saturation analysis</p>
        </motion.div>



        initial={{ y: -20, opacity: 0 }}

        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-6 right-6 z-20 glass-card p-4 rounded-xl border border-border/50 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{claimedCount}</div>
            <div className="text-xs text-muted-foreground">territories claimed</div>

          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">{moatMultiplier}×</div>
            <div className="text-xs text-muted-foreground">moat strength</div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${runRate}M</div>
            <div className="text-xs text-muted-foreground">annual run-rate</div>
          </div>
        </div>
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center p-12">
        <svg

          className="w-full h-full"
          style={{ maxWidth: '1400px', maxHeight: '800px' }}
        >

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>

                <feMergeNode in="SourceGraphic"/>

            </filter>























































