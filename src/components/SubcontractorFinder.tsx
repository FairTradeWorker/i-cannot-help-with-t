import { useState, useEffect } from 'react';
import { MagnifyingGlass, MapPin, Star, CheckCircle, UserPlus, Phone, EnvelopeSimple } from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ServiceCategoryMegaMenu } from '@/components/ServiceCategoryMegaMenu';
import { dataStore } from '@/lib/store';
import type { User } from '@/lib/types';
import type { ServiceSelection } from '@/types/service-categories';
import { getServiceInfo, getRequiredLicensesForService } from '@/types/service-categories';

interface SubcontractorFinderProps {
  contractorId?: string;
  onInvite?: (subcontractor: User) => void;
}

interface SubcontractorMatch {
  subcontractor: User;
  matchScore: number;
  reasons: string[];
}

export function SubcontractorFinder({ contractorId, onInvite }: SubcontractorFinderProps) {
  const [subcontractors, setSubcontractors] = useState<User[]>([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<SubcontractorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<ServiceSelection | null>(null);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'busy'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'distance' | 'rate'>('match');

  useEffect(() => {
    loadSubcontractors();
  }, []);

  useEffect(() => {
    filterAndMatchSubcontractors();
  }, [subcontractors, selectedService, searchTerm, locationFilter, availabilityFilter, sortBy]);

  const loadSubcontractors = async () => {
    setLoading(true);
    try {
      const allUsers = await dataStore.getUsers();
      const subs = allUsers.filter(u => 
        u.role === 'subcontractor' && 
        u.contractorProfile &&
        u.id !== contractorId
      );
      setSubcontractors(subs);
    } catch (error) {
      console.error('Failed to load subcontractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndMatchSubcontractors = () => {
    let filtered = subcontractors;

    // Filter by availability
    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(sub => 
        sub.contractorProfile?.availability === availabilityFilter
      );
    }

    // Filter by location
    if (locationFilter) {
      filtered = filtered.filter(sub => 
        sub.contractorProfile?.location.address.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.contractorProfile?.skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Match by service if selected
    const matched: SubcontractorMatch[] = filtered.map(sub => {
      if (!selectedService || !sub.contractorProfile) {
        return {
          subcontractor: sub,
          matchScore: 0,
          reasons: []
        };
      }

      const profile = sub.contractorProfile;
      let matchScore = 0;
      const reasons: string[] = [];

      // Check for exact service match
      const hasExactService = profile.serviceSpecialties?.some(spec =>
        spec.categoryId === selectedService.categoryId &&
        spec.subcategoryId === selectedService.subcategoryId &&
        spec.services.includes(selectedService.service)
      );

      if (hasExactService) {
        matchScore += 50;
        reasons.push('Exact service match');
      } else {
        // Check for subcategory match
        const hasSubcategory = profile.serviceSpecialties?.some(spec =>
          spec.categoryId === selectedService.categoryId &&
          spec.subcategoryId === selectedService.subcategoryId
        );
        if (hasSubcategory) {
          matchScore += 30;
          reasons.push('Subcategory match');
        } else {
          // Check for category match
          const hasCategory = profile.serviceSpecialties?.some(spec =>
            spec.categoryId === selectedService.categoryId
          );
          if (hasCategory) {
            matchScore += 15;
            reasons.push('Category match');
          }
        }
      }

      // Check for required license
      const requiredLicenses = getRequiredLicensesForService(selectedService.service);
      const hasLicense = profile.licenses.some(license =>
        requiredLicenses.some(req => 
          license.type.toLowerCase().includes(req.toLowerCase())
        )
      );
      if (hasLicense) {
        matchScore += 20;
        reasons.push('Has required license');
      }

      // Add rating score
      matchScore += (profile.rating / 100) * 20;
      if (profile.rating >= 90) {
        reasons.push('High rating');
      }

      // Add experience score
      const experience = profile.serviceSpecialties?.find(spec =>
        spec.categoryId === selectedService.categoryId &&
        spec.subcategoryId === selectedService.subcategoryId
      )?.yearsExperience || 0;
      matchScore += Math.min(experience * 2, 10);
      if (experience > 5) {
        reasons.push(`${experience} years experience`);
      }

      return {
        subcontractor: sub,
        matchScore,
        reasons
      };
    });

    // Sort by selected criteria
    matched.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'rating':
          return (b.subcontractor.contractorProfile?.rating || 0) - 
                 (a.subcontractor.contractorProfile?.rating || 0);
        case 'rate':
          return (a.subcontractor.contractorProfile?.hourlyRate || 0) - 
                 (b.subcontractor.contractorProfile?.hourlyRate || 0);
        default:
          return 0;
      }
    });

    setFilteredSubcontractors(matched);
  };

  const handleServiceSelect = (selection: ServiceSelection) => {
    setSelectedService(selection);
    setShowServiceMenu(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading subcontractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label>Service Type</Label>
            {selectedService ? (
              <div className="mt-2 p-3 border rounded-lg bg-card/50 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{selectedService.service}</div>
                  <div className="text-xs text-muted-foreground">
                    {selectedService.subcategory}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowServiceMenu(true)}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => setShowServiceMenu(true)}
              >
                Select Service
              </Button>
            )}
          </div>

          <div>
            <Label>Search</Label>
            <div className="relative mt-2">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Name or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <Input
              placeholder="City, State"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label>Availability</Label>
            <Select value={availabilityFilter} onValueChange={(v: any) => setAvailabilityFilter(v)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match Quality</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="rate">Hourly Rate</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredSubcontractors.length} subcontractors found
          </div>
        </div>
      </Card>

      {/* Results */}
      {filteredSubcontractors.length === 0 ? (
        <Card className="p-12 text-center">
          <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" weight="duotone" />
          <h4 className="text-lg font-semibold mb-2">No Subcontractors Found</h4>
          <p className="text-muted-foreground mb-4">
            {selectedService 
              ? 'Try adjusting your filters or selecting a different service'
              : 'Select a service type to find matching subcontractors'}
          </p>
          {!selectedService && (
            <Button onClick={() => setShowServiceMenu(true)}>
              Select Service
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubcontractors.map(({ subcontractor, matchScore, reasons }) => {
            const profile = subcontractor.contractorProfile!;
            return (
              <Card key={subcontractor.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-border">
                    <AvatarImage src={subcontractor.avatar} alt={subcontractor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {subcontractor.name[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg">{subcontractor.name}</h3>
                      {profile.verified && (
                        <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-accent" weight="fill" />
                      <span className="font-semibold">{profile.rating}</span>
                      <span className="text-sm text-muted-foreground">/100</span>
                      <span className="text-sm text-muted-foreground">
                        • {profile.completedJobs} jobs
                      </span>
                    </div>
                    {matchScore > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {Math.round(matchScore)}% Match
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profile.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">${profile.hourlyRate}/hr</span>
                    <Badge variant={profile.availability === 'available' ? 'default' : 'secondary'}>
                      {profile.availability}
                    </Badge>
                  </div>
                  {reasons.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {reasons.slice(0, 2).join(' • ')}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onInvite?.(subcontractor)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add to Team
                  </Button>
                  <Button variant="ghost" size="sm" sizeIcon>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" sizeIcon>
                    <EnvelopeSimple className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <ServiceCategoryMegaMenu
        open={showServiceMenu}
        onClose={() => setShowServiceMenu(false)}
        onSelect={handleServiceSelect}
        title="Find Subcontractors by Service"
      />
    </div>
  );
}

