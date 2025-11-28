import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass, Users, Star, MapPin, Wrench, Funnel } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ContractorCard } from './ContractorCard';
import { ContractorProfileModal } from './ContractorProfileModal';
import { ServiceCategoryMegaMenu } from './ServiceCategoryMegaMenu';
import { dataStore } from '@/lib/store';
import type { User } from '@/lib/types';
import type { ServiceSelection } from '@/types/service-categories';
import { matchContractorsToJob, isBestMatch } from '@/lib/contractor-matching';

export function ContractorBrowser() {
  const [contractors, setContractors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContractor, setSelectedContractor] = useState<User | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceSelection | null>(null);
  const [showServiceMenu, setShowServiceMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'match' | 'distance' | 'availability'>('rating');

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    setLoading(true);
    try {
      const allUsers = await dataStore.getUsers();
      const contractorUsers = allUsers.filter(u => u.role === 'contractor' && u.contractorProfile);
      setContractors(contractorUsers);
    } catch (error) {
      console.error('Failed to load contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and match contractors
  const filteredAndMatchedContractors = useMemo(() => {
    let filtered = contractors.filter(contractor =>
      contractor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contractor.contractorProfile?.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contractor.contractorProfile?.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter by service if selected
    if (selectedService) {
      filtered = filtered.filter(contractor => {
        const profile = contractor.contractorProfile;
        if (!profile?.serviceSpecialties) return false;
        
        return profile.serviceSpecialties.some(spec =>
          spec.categoryId === selectedService.categoryId &&
          spec.subcategoryId === selectedService.subcategoryId &&
          spec.services.includes(selectedService.service)
        );
      });
    }

    // Match contractors if service is selected
    if (selectedService) {
      // Create a mock job for matching
      const mockJob = {
        id: 'match-job',
        title: selectedService.service,
        description: '',
        status: 'posted' as const,
        homeownerId: '',
        address: { street: '', city: '', state: '', zip: '', lat: 0, lng: 0 },
        urgency: 'normal' as const,
        estimatedCost: { min: 0, max: 0 },
        laborHours: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        bids: [],
        messages: [],
        milestones: []
      };

      const matches = matchContractorsToJob(filtered, mockJob as any, selectedService);
      return matches.map(m => ({
        contractor: m.contractor,
        match: m
      }));
    }

    return filtered.map(c => ({ contractor: c, match: null }));
  }, [contractors, searchTerm, selectedService]);

  // Sort contractors
  const sortedContractors = useMemo(() => {
    const sorted = [...filteredAndMatchedContractors];
    
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          if (!a.match || !b.match) return 0;
          return b.match.matchScore - a.match.matchScore;
        case 'rating':
          const ratingA = a.contractor.contractorProfile?.rating || 0;
          const ratingB = b.contractor.contractorProfile?.rating || 0;
          return ratingB - ratingA;
        case 'distance':
          if (!a.match || !b.match) return 0;
          return a.match.matchBreakdown.distanceScore - b.match.matchBreakdown.distanceScore;
        case 'availability':
          const availA = a.contractor.contractorProfile?.availability === 'available' ? 1 : 0;
          const availB = b.contractor.contractorProfile?.availability === 'available' ? 1 : 0;
          return availB - availA;
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredAndMatchedContractors, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-sm font-bold">Loading contractors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-8 h-8 text-primary" weight="fill" />
            <div>
              <h1 className="text-3xl font-bold">Find Contractors</h1>
              <p className="text-sm text-muted-foreground">
                Browse verified professionals in your area
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, skill, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>
            <div>
              {selectedService ? (
                <div className="p-3 border rounded-lg bg-card/50 flex items-center justify-between h-12">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Wrench className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate">{selectedService.service}</div>
                      <div className="text-xs text-muted-foreground truncate">{selectedService.subcategory}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowServiceMenu(true)}
                    className="flex-shrink-0"
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => setShowServiceMenu(true)}
                >
                  <Funnel className="w-4 h-4 mr-2" />
                  Filter by Service
                </Button>
              )}
            </div>
            <div>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Sort by Rating</SelectItem>
                  <SelectItem value="match">Sort by Match</SelectItem>
                  <SelectItem value="distance">Sort by Distance</SelectItem>
                  <SelectItem value="availability">Sort by Availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-accent" weight="fill" />
            <h2 className="text-2xl font-bold">
              {selectedService ? `${selectedService.service} Contractors` : searchTerm ? 'Search Results' : 'All Contractors'}
            </h2>
            <Badge variant="secondary">{sortedContractors.length}</Badge>
          </div>
        </div>

        {sortedContractors.length === 0 ? (
          <Card className="p-12 text-center">
            <MagnifyingGlass className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="text-xl font-bold mb-2">No Contractors Found</h4>
            <p className="text-muted-foreground">
              {searchTerm ? 'Try a different search term' : 'No contractors available'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedContractors.map(({ contractor, match }) => (
              <motion.div
                key={contractor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {match && isBestMatch(match) && (
                  <Badge className="absolute top-2 right-2 z-10 bg-accent text-white">
                    Best Match
                  </Badge>
                )}
                {match && (
                  <Badge variant="secondary" className="absolute top-2 left-2 z-10">
                    {Math.round(match.matchScore)}% Match
                  </Badge>
                )}
                <ContractorCard
                  contractor={{
                    id: contractor.id,
                    name: contractor.name,
                    avatar: contractor.avatar,
                    rating: contractor.contractorProfile?.rating || 0,
                    completedJobs: contractor.contractorProfile?.completedJobs || 0,
                    hourlyRate: contractor.contractorProfile?.hourlyRate,
                    specialties: contractor.contractorProfile?.specialties,
                    location: contractor.contractorProfile?.location.address,
                    verified: contractor.contractorProfile?.verified,
                  }}
                  onSelect={() => setSelectedContractor(contractor)}
                  showActions
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedContractor && (
        <ContractorProfileModal
          contractor={selectedContractor}
          open={!!selectedContractor}
          onClose={() => setSelectedContractor(null)}
          onContact={() => {
            console.log('Contact contractor:', selectedContractor.name);
          }}
        />
      )}
    </div>
  );
}
