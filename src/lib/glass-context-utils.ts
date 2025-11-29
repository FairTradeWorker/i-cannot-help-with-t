import type { Job, User } from '@/lib/types';
import type { GlassContext, UrgencyLevel, WeatherCondition, TimeOfDay } from '@/lib/glassmorphism-engine';

/**
 * Convert job data to glass context
 */
export function jobToGlassContext(job: Job): GlassContext {
  const urgency: UrgencyLevel = 
    job.urgency === 'emergency' ? 'critical' :
    job.urgency === 'urgent' ? 'high' :
    job.urgency === 'normal' ? 'low' : 'medium';

  const serviceCategory = (job as any).serviceSelection?.categoryId;
  
  // Calculate confidence from AI scope if available
  const confidence = job.scope?.confidenceScore || undefined;

  // Determine completion status
  const completion = job.status === 'completed' ? 1 :
                    job.status === 'in_progress' ? 0.5 :
                    job.status === 'assigned' ? 0.3 : 0;

  // Determine data complexity
  const dataComplexity = 
    job.bids.length > 10 || job.messages.length > 20 ? 'complex' :
    job.bids.length > 5 || job.messages.length > 10 ? 'moderate' :
    'simple';

  return {
    urgency,
    confidence,
    completion,
    serviceCategory,
    dataComplexity,
    layers: Math.ceil(job.bids.length / 3) + 1,
    relationships: job.bids.length + job.messages.length,
    realtime: job.status === 'bidding' || job.status === 'in_progress'
  };
}

/**
 * Convert contractor data to glass context
 */
export function contractorToGlassContext(contractor: User): GlassContext {
  const profile = contractor.contractorProfile;
  if (!profile) {
    return {
      urgency: 'low',
      dataComplexity: 'simple'
    };
  }

  // High rating = high confidence
  const confidence = profile.rating / 100;

  // Determine complexity from specialties
  const complexity = 
    (profile.serviceSpecialties?.length || 0) > 5 ? 'enterprise' :
    (profile.serviceSpecialties?.length || 0) > 2 ? 'complex' :
    (profile.serviceSpecialties?.length || 0) > 0 ? 'moderate' :
    'simple';

  return {
    urgency: profile.availability === 'available' ? 'medium' : 'low',
    confidence,
    serviceCategory: profile.serviceSpecialties?.[0]?.categoryId,
    dataComplexity: complexity,
    layers: (profile.serviceSpecialties?.length || 0) + 1,
    relationships: (profile.completedJobs || 0) + (profile.licenses.length || 0)
  };
}

/**
 * Get weather condition (mock - in production, use weather API)
 */
export function getWeatherCondition(location: { city: string; state: string }): WeatherCondition {
  // Mock implementation - in production, fetch from weather API
  const hour = new Date().getHours();
  const month = new Date().getMonth();
  
  // Simple heuristic
  if (month >= 11 || month <= 2) {
    // Winter months
    return Math.random() > 0.7 ? 'snow' : 'cloudy';
  } else if (month >= 5 && month <= 8) {
    // Summer months
    return Math.random() > 0.8 ? 'storm' : 'sunny';
  } else {
    return Math.random() > 0.6 ? 'rain' : 'cloudy';
  }
}

/**
 * Get default glass context for general UI elements
 */
export function getDefaultGlassContext(): GlassContext {
  const hour = new Date().getHours();
  const timeOfDay: TimeOfDay = 
    hour >= 5 && hour < 12 ? 'morning' :
    hour >= 12 && hour < 17 ? 'afternoon' :
    hour >= 17 && hour < 21 ? 'evening' : 'night';

  return {
    urgency: 'low',
    confidence: 0.9,
    completion: 1,
    weather: 'sunny',
    timeOfDay,
    dataComplexity: 'simple'
  };
}

/**
 * Get time of day
 */
export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 20) return 'evening';
  return 'night';
}

/**
 * Enhance context with weather and time
 */
export function enhanceGlassContext(
  baseContext: GlassContext,
  location?: { city: string; state: string }
): GlassContext {
  const enhanced = { ...baseContext };
  
  if (location) {
    enhanced.weather = getWeatherCondition(location);
  }
  
  enhanced.timeOfDay = getTimeOfDay();
  
  return enhanced;
}

