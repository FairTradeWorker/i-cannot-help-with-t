import { Star, CheckCircle, MapPin, CurrencyDollar, Briefcase } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { ContractorProfile } from '@/lib/types';

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
  };
  onSelect?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function ContractorCard({ contractor, onSelect, showActions = true, compact = false }: ContractorCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'text-accent';
    if (rating >= 85) return 'text-secondary';
    if (rating >= 75) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 95) return { label: 'Exceptional', variant: 'default' as const };
    if (rating >= 85) return { label: 'Excellent', variant: 'secondary' as const };
    if (rating >= 75) return { label: 'Good', variant: 'outline' as const };
    return { label: 'Average', variant: 'outline' as const };
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <Avatar className="w-12 h-12 border-2 border-border">
            <AvatarImage src={contractor.avatar} alt={contractor.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {contractor.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {contractor.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-card flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" weight="fill" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-base truncate">{contractor.name}</h4>
            {contractor.verified && (
              <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" weight="fill" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className={`w-3 h-3 ${getRatingColor(contractor.rating)}`} weight="fill" />
              <span className="font-semibold">{contractor.rating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{contractor.completedJobs} jobs</span>
          </div>
        </div>
      </div>
    );
  }

  const ratingBadge = getRatingBadge(contractor.rating);

  return (
    <Card className="p-6 hover:border-primary/50 transition-all glass-card glass-hover cursor-pointer" onClick={onSelect}>
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <Avatar className="w-16 h-16 border-2 border-border shadow-lg">
            <AvatarImage src={contractor.avatar} alt={contractor.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
              {contractor.name[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {contractor.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full border-2 border-card flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" weight="fill" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-xl font-bold mb-1">{contractor.name}</h3>
              <Badge variant={ratingBadge.variant} className="mb-2">
                {ratingBadge.label}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className={`w-4 h-4 ${getRatingColor(contractor.rating)}`} weight="fill" />
              <span className="font-bold">{contractor.rating}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span>{contractor.completedJobs} jobs completed</span>
            </div>
            {contractor.hourlyRate && (
              <>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <CurrencyDollar className="w-4 h-4" />
                  <span>${contractor.hourlyRate}/hr</span>
                </div>
              </>
            )}
          </div>

          {contractor.specialties && contractor.specialties.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              {contractor.specialties.slice(0, 3).map((specialty, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {contractor.specialties.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{contractor.specialties.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {contractor.location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              <span>{contractor.location}</span>
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
  );
}
