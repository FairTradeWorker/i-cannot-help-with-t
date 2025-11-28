/**
 * Glassmorphism 2.0 - Holographic Surface Engine (HSE)
 * 
 * Intelligent glass rendering system that adapts to context, data, and user state.
 */

export type GlassDepth = 0 | 1 | 2 | 3 | 4;
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type WeatherCondition = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface GlassLayer {
  id: string;
  depth: GlassDepth;
  blur: number;        // 0-24px
  opacity: number;     // 0-1
  refraction: number;  // 0-1 (light bending intensity)
  glow: boolean;       // Edge glow for critical items
  borderWidth: number; // 1-4px
  borderColor: string;
  shadowColor: string;
  tint: string;
}

export interface GlassContext {
  urgency?: UrgencyLevel;
  confidence?: number;  // 0-1
  completion?: number;  // 0-1
  serviceCategory?: string;
  weather?: WeatherCondition;
  timeOfDay?: TimeOfDay;
  dataComplexity?: 'simple' | 'moderate' | 'complex' | 'enterprise';
  layers?: number;
  relationships?: number;
  realtime?: boolean;
}

export interface BlurField {
  center: { x: number; y: number };
  intensity: number;  // 0-1
  radius: number;      // Blur spread distance
  falloff: 'linear' | 'exponential';
}

export interface Refraction {
  angle: number;           // Light source angle
  intensity: number;        // 0-1
  chromaticAberration: boolean;
  caustics: boolean;
}

export interface LightingContext {
  cursor: { x: number; y: number };
  timeOfDay: TimeOfDay;
  weather: WeatherCondition;
  colorTemperature: number;  // Kelvin (2700-6500)
}

export class GlassmorphismEngine {
  private glassLayers: Map<string, GlassLayer> = new Map();
  private lightingContext: LightingContext;
  private cursorPosition: { x: number; y: number } = { x: 0, y: 0 };
  private animationFrame: number | null = null;

  constructor() {
    this.initializeLighting();
    this.attachCursorTracking();
    this.startLightingUpdate();
  }

  private initializeLighting() {
    const hour = new Date().getHours();
    const timeOfDay = this.getTimeOfDay(hour);
    
    this.lightingContext = {
      cursor: { x: 0, y: 0 },
      timeOfDay,
      weather: 'sunny', // Default, can be updated from weather API
      colorTemperature: this.getColorTemperature(timeOfDay)
    };
  }

  private getTimeOfDay(hour: number): TimeOfDay {
    if (hour >= 6 && hour < 10) return 'morning';
    if (hour >= 10 && hour < 16) return 'afternoon';
    if (hour >= 16 && hour < 20) return 'evening';
    return 'night';
  }

  private getColorTemperature(timeOfDay: TimeOfDay): number {
    switch (timeOfDay) {
      case 'morning': return 5500;
      case 'afternoon': return 6500;
      case 'evening': return 3200;
      case 'night': return 2700;
    }
  }

  private attachCursorTracking() {
    document.addEventListener('mousemove', (e) => {
      this.cursorPosition = { x: e.clientX, y: e.clientY };
      this.lightingContext.cursor = this.cursorPosition;
      this.updateAllGlassLighting();
    });
  }

  private startLightingUpdate() {
    const update = () => {
      const hour = new Date().getHours();
      const newTimeOfDay = this.getTimeOfDay(hour);
      
      if (newTimeOfDay !== this.lightingContext.timeOfDay) {
        this.lightingContext.timeOfDay = newTimeOfDay;
        this.lightingContext.colorTemperature = this.getColorTemperature(newTimeOfDay);
        this.updateAllGlassLighting();
      }
      
      this.animationFrame = requestAnimationFrame(update);
    };
    
    this.animationFrame = requestAnimationFrame(update);
  }

  /**
   * Register a glass element with the engine
   */
  registerGlass(id: string, context: GlassContext): GlassLayer {
    const layer = this.createGlassLayer(context);
    this.glassLayers.set(id, layer);
    this.applyGlassToDOM(id, layer);
    return layer;
  }

  /**
   * Update glass properties based on new context
   */
  updateGlass(id: string, context: Partial<GlassContext>): void {
    const existingLayer = this.glassLayers.get(id);
    if (!existingLayer) return;

    const updatedContext = { ...this.getContextForId(id), ...context };
    const newLayer = this.createGlassLayer(updatedContext);
    this.glassLayers.set(id, newLayer);
    this.applyGlassToDOM(id, newLayer);
  }

  /**
   * Unregister a glass element
   */
  unregisterGlass(id: string): void {
    this.glassLayers.delete(id);
    const element = document.querySelector(`[data-glass-id="${id}"]`);
    if (element) {
      element.removeAttribute('data-glass-id');
      element.classList.remove('glass-surface');
    }
  }

  /**
   * Create glass layer from context
   */
  private createGlassLayer(context: GlassContext): GlassLayer {
    const depth = this.calculateDepth(context);
    const blur = this.calculateBlur(context);
    const opacity = this.calculateOpacity(context);
    const refraction = this.calculateRefraction(context);
    const { borderWidth, borderColor, shadowColor, tint } = this.calculateVisuals(context);

    return {
      id: context.serviceCategory || 'default',
      depth,
      blur,
      opacity,
      refraction,
      glow: context.urgency === 'critical' || context.urgency === 'high',
      borderWidth,
      borderColor,
      shadowColor,
      tint
    };
  }

  private calculateDepth(context: GlassContext): GlassDepth {
    if (context.urgency === 'critical') return 4;
    if (context.urgency === 'high') return 3;
    if (context.dataComplexity === 'enterprise') return 3;
    if (context.dataComplexity === 'complex') return 2;
    return 1;
  }

  private calculateBlur(context: GlassContext): number {
    let blur = 12; // Base blur

    // Urgency increases blur (more attention)
    if (context.urgency === 'critical') blur += 8;
    else if (context.urgency === 'high') blur += 4;
    else if (context.urgency === 'low') blur -= 4;

    // Low confidence increases blur (uncertainty)
    if (context.confidence !== undefined) {
      blur += (1 - context.confidence) * 12;
    }

    // Complexity increases blur
    if (context.dataComplexity === 'enterprise') blur += 8;
    else if (context.dataComplexity === 'complex') blur += 4;
    else if (context.dataComplexity === 'simple') blur -= 4;

    // Weather affects blur
    if (context.weather === 'storm') blur += 8;
    else if (context.weather === 'rain') blur += 4;
    else if (context.weather === 'sunny') blur -= 2;

    return Math.max(4, Math.min(24, blur));
  }

  private calculateOpacity(context: GlassContext): number {
    let opacity = 0.7; // Base opacity

    // High confidence = more solid
    if (context.confidence !== undefined) {
      opacity = 0.4 + (context.confidence * 0.5);
    }

    // Urgency = more visible
    if (context.urgency === 'critical') opacity = Math.min(0.95, opacity + 0.15);
    else if (context.urgency === 'high') opacity = Math.min(0.9, opacity + 0.1);
    else if (context.urgency === 'low') opacity = Math.max(0.4, opacity - 0.2);

    // Completion reduces opacity
    if (context.completion !== undefined && context.completion >= 1) {
      opacity = Math.max(0.3, opacity - 0.3);
    }

    return Math.max(0.3, Math.min(0.95, opacity));
  }

  private calculateRefraction(context: GlassContext): number {
    let refraction = 0.2; // Base refraction

    // High confidence = clearer (less refraction)
    if (context.confidence !== undefined) {
      refraction = 0.1 + ((1 - context.confidence) * 0.3);
    }

    // Urgency = more refraction (attention)
    if (context.urgency === 'critical') refraction = Math.min(0.5, refraction + 0.2);
    else if (context.urgency === 'high') refraction = Math.min(0.4, refraction + 0.1);

    return Math.max(0.1, Math.min(0.5, refraction));
  }

  private calculateVisuals(context: GlassContext): {
    borderWidth: number;
    borderColor: string;
    shadowColor: string;
    tint: string;
  } {
    // Urgency-based visuals
    const urgencyVisuals = {
      critical: {
        borderWidth: 4,
        borderColor: 'rgba(239,68,68,0.9)',
        shadowColor: 'rgba(239,68,68,0.6)',
        tint: 'rgba(239,68,68,0.2)'
      },
      high: {
        borderWidth: 2,
        borderColor: 'rgba(249,115,22,0.7)',
        shadowColor: 'rgba(249,115,22,0.4)',
        tint: 'rgba(249,115,22,0.15)'
      },
      medium: {
        borderWidth: 1.5,
        borderColor: 'rgba(234,179,8,0.5)',
        shadowColor: 'rgba(234,179,8,0.3)',
        tint: 'rgba(234,179,8,0.1)'
      },
      low: {
        borderWidth: 1,
        borderColor: 'rgba(34,197,94,0.3)',
        shadowColor: 'rgba(34,197,94,0.2)',
        tint: 'rgba(34,197,94,0.1)'
      }
    };

    const base = urgencyVisuals[context.urgency || 'low'];

    // Service category tint overlay
    const serviceTint = this.getServiceTint(context.serviceCategory);
    if (serviceTint) {
      base.tint = this.blendColors(base.tint, serviceTint, 0.5);
    }

    // Weather overlay
    const weatherTint = this.getWeatherTint(context.weather);
    if (weatherTint) {
      base.tint = this.blendColors(base.tint, weatherTint, 0.3);
    }

    return base;
  }

  private getServiceTint(category?: string): string | null {
    const tints: Record<string, string> = {
      'roofing': 'rgba(71,85,105,0.3)',
      'plumbing': 'rgba(20,184,166,0.3)',
      'electrical': 'rgba(250,204,21,0.3)',
      'landscaping': 'rgba(34,197,94,0.3)',
      'hvac': 'rgba(59,130,246,0.3)',
      'construction': 'rgba(249,115,22,0.3)'
    };
    return category ? tints[category] || null : null;
  }

  private getWeatherTint(weather?: WeatherCondition): string | null {
    const tints: Record<WeatherCondition, string> = {
      'sunny': 'rgba(255,235,59,0.2)',
      'cloudy': 'rgba(148,163,184,0.2)',
      'rain': 'rgba(59,130,246,0.3)',
      'storm': 'rgba(30,41,59,0.4)',
      'snow': 'rgba(255,255,255,0.3)'
    };
    return weather ? tints[weather] : null;
  }

  private blendColors(color1: string, color2: string, ratio: number): string {
    // Simple color blending (extract RGB and blend)
    const extractRGB = (color: string) => {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : [255, 255, 255];
    };

    const rgb1 = extractRGB(color1);
    const rgb2 = extractRGB(color2);
    const alpha = color1.includes('rgba') ? parseFloat(color1.match(/[\d.]+\)$/)?.[0] || '1') : 1;

    const blended = rgb1.map((c1, i) => 
      Math.round(c1 * (1 - ratio) + rgb2[i] * ratio)
    );

    return `rgba(${blended[0]}, ${blended[1]}, ${blended[2]}, ${alpha})`;
  }

  private applyGlassToDOM(id: string, layer: GlassLayer): void {
    const element = document.querySelector(`[data-glass-id="${id}"]`) as HTMLElement;
    if (!element) return;

    // Set CSS custom properties
    element.style.setProperty('--glass-blur', `${layer.blur}px`);
    element.style.setProperty('--glass-opacity', layer.opacity.toString());
    element.style.setProperty('--glass-refraction', layer.refraction.toString());
    element.style.setProperty('--glass-border-width', `${layer.borderWidth}px`);
    element.style.setProperty('--glass-border-color', layer.borderColor);
    element.style.setProperty('--glass-shadow-color', layer.shadowColor);
    element.style.setProperty('--glass-tint', layer.tint);
    element.style.setProperty('--glass-glow', layer.glow ? '1' : '0');

    // Set data attributes for CSS selectors
    element.setAttribute('data-glass-depth', layer.depth.toString());
    element.setAttribute('data-glass-urgency', layer.glow ? 'high' : 'normal');
  }

  private updateAllGlassLighting(): void {
    this.glassLayers.forEach((layer, id) => {
      this.applyLightingToGlass(id, layer);
    });
  }

  private applyLightingToGlass(id: string, layer: GlassLayer): void {
    const element = document.querySelector(`[data-glass-id="${id}"]`) as HTMLElement;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(
      this.cursorPosition.y - centerY,
      this.cursorPosition.x - centerX
    );

    element.style.setProperty('--light-angle', `${(angle * 180) / Math.PI}deg`);
    element.style.setProperty('--light-x', `${this.cursorPosition.x}px`);
    element.style.setProperty('--light-y', `${this.cursorPosition.y}px`);
    element.style.setProperty('--color-temp', this.lightingContext.colorTemperature.toString());
  }

  private getContextForId(id: string): GlassContext {
    // In real implementation, this would fetch from component state
    return {};
  }

  /**
   * Update weather context (can be called from weather API)
   */
  updateWeather(weather: WeatherCondition): void {
    this.lightingContext.weather = weather;
    this.glassLayers.forEach((layer, id) => {
      const element = document.querySelector(`[data-glass-id="${id}"]`) as HTMLElement;
      if (element) {
        const weatherTint = this.getWeatherTint(weather);
        if (weatherTint) {
          element.style.setProperty('--weather-tint', weatherTint);
        }
      }
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.glassLayers.clear();
  }
}

// Singleton instance
let glassEngineInstance: GlassmorphismEngine | null = null;

export function getGlassEngine(): GlassmorphismEngine {
  if (!glassEngineInstance) {
    glassEngineInstance = new GlassmorphismEngine();
  }
  return glassEngineInstance;
}

