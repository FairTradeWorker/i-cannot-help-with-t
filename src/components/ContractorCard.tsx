import { Star, CheckCircle, MapPin, CurrencyDollar, Briefcase } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlassSurface } from './GlassSurface';
import { contractorToGlassContext } from '@/lib/glass-context-utils';
import type { User } from '@/lib/types';

interface ContractorCardProps {
  contractor: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedJobs: number;
    hourlyRate?: number;
    specialties?: string[];
    location?: string;
    verified?: boolean;
  } | User;
  compact?: boolean;
  showActions?: boolean;
  onSelect?: () => void;
}

export function ContractorCard({ contractor, compact = false, showActions = true, onSelect }: ContractorCardProps) {
  // Helper to safely get contractor properties
  const getContractorProp = <T,>(prop: string, fallback: T): T => {
    if ('contractorProfile' in contractor) {
      const profile = contractor.contractorProfile;
      if (prop === 'rating') return (profile?.rating ?? fallback) as T;
      if (prop === 'completedJobs') return (profile?.completedJobs ?? fallback) as T;
      if (prop === 'hourlyRate') return (profile?.hourlyRate ?? fallback) as T;
      if (prop === 'verified') return (profile?.verified ?? fallback) as T;
      return fallback;
    }
    return (contractor as any)[prop] ?? fallback;
  };
  
  const contractorName = 'contractorProfile' in contractor ? contractor.name : contractor.name;
  const contractorAvatar = 'contractorProfile' in contractor ? contractor.avatar : contractor.avatar;
  const rating = getContractorProp('rating', 0);
  const contractorCompletedJobs = getContractorProp('completedJobs', 0);
  const contractorHourlyRate = getContractorProp('hourlyRate', undefined as number | undefined);
  const contractorVerified = getContractorProp('verified', false);
  const contractorSpecialties = 'contractorProfile' in contractor
    ? contractor.contractorProfile?.serviceSpecialties?.flatMap(s => s.services) || []
    : ('specialties' in contractor ? contractor.specialties || [] : []);
  const contractorLocation = 'contractorProfile' in contractor
    ? undefined
    : ('location' in contractor ? contractor.location : undefined);

  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-secondary';
    if (rating >= 85) return 'text-primary';
    if (rating >= 75) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 95) return { label: 'Exceptional', variant: 'default' as const };
    if (rating >= 85) return { label: 'Excellent', variant: 'secondary' as const };
    if (rating >= 75) return { label: 'Good', variant: 'outline' as const };
    return { label: 'Average', variant: 'outline' as const };
  };

  // Get glass context
  const glassContext = 'contractorProfile' in contractor
    ? contractorToGlassContext(contractor)
    : {
        urgency: 'low' as const,
        confidence: rating / 100,
        serviceCategory: contractorSpecialties[0]?.toLowerCase() || 'general',
        dataComplexity: 'simple' as const
      };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12 border-2 border-border">
            <AvatarImage src={contractorAvatar} alt={contractorName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {contractorName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {contractorVerified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-card flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" weight="fill" />
            </div>
          )}
        </div>
              
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base truncate">{contractorName}</h4>
            {contractorVerified && (
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" weight="fill" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className={`w-3 h-3 ${getRatingColor(rating)}`} weight="fill" />
              <span className="font-semibold">{rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{contractorCompletedJobs} jobs</span>
          </div>
        </div>
      </div>
    );
  }

  const ratingBadge = getRatingBadge(rating);

  return (
    <GlassSurface
      id={`contractor-${contractor.id}`}
      context={glassContext}
      onClick={onSelect}
      className="cursor-pointer"
    >
      <Card className="p-6 border-0 bg-transparent hover:bg-transparent">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <Avatar className="w-16 h-16 border-2 border-border shadow-lg">
              <AvatarImage src={contractorAvatar} alt={contractorName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {contractorName[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {contractorVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-card flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" weight="fill" />
            </div>
          )}
        </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl font-bold mb-1">{contractorName}</h3>
                <Badge variant={ratingBadge.variant} className="mb-2">
                  {ratingBadge.label}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
              <div className="flex items-center gap-1.5">
                <Star className={`w-4 h-4 ${getRatingColor(rating)}`} weight="fill" />
                <span className="font-bold">{rating}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{contractorCompletedJobs} jobs completed</span>
              </div>
              {contractorHourlyRate && (
                <>
                  <div className="h-4 w-px bg-border"></div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CurrencyDollar className="w-4 h-4" />
                    <span>${contractorHourlyRate}/hr</span>
                  </div>
                </>
              )}
            </div>

            {contractorSpecialties && contractorSpecialties.length > 0 && (
              <div className="flex items-center gap-2 mb-3">
                {contractorSpecialties.slice(0, 3).map((specialty, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {contractorSpecialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{contractorSpecialties.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {contractorLocation && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <MapPin className="w-4 h-4" />
                <span>{contractorLocation}</span>
              </div>
            )}

          {showActions && (
            <Button size="sm" className="mt-2">
              View Profile
            </Button>
          )}
        </div>
      </div>
    </Card>
    </GlassSurface>
  );
}
