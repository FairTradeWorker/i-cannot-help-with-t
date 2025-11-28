// Advanced Contractor Search - Enhanced discovery with filters
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlass,
  Sliders,
  MapPin,
  Star,
  CheckCircle,
  Briefcase,
  Clock,
  CurrencyDollar,
  Heart,
  HeartStraight,
  X,
  ArrowRight,
  Lightning,
  Shield,
  Phone,
  Envelope,
} from '@phosphor-icons/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Contractor {
  id: string;
  name: string;
  companyName: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  hourlyRate: number;
  verified: boolean;
  featured: boolean;
  location: {
    city: string;
    state: string;
    distance?: number; // miles
  };
  specialties: string[];
  availability: 'available' | 'busy' | 'booked';
  responseTime: string; // e.g., "< 1 hour"
  yearsExperience: number;
  insuranceVerified: boolean;
  backgroundChecked: boolean;
  description: string;
}

// Sample contractors
const sampleContractors: Contractor[] = [
  {
    id: 'c1',
    name: 'Mike Johnson',
    companyName: 'Premier Renovations LLC',
    rating: 96,
    reviewCount: 127,
    completedJobs: 234,
    hourlyRate: 85,
    verified: true,
    featured: true,
    location: { city: 'Austin', state: 'TX', distance: 5 },
    specialties: ['Kitchen Remodel', 'Bathroom Remodel', 'General Construction'],
    availability: 'available',
    responseTime: '< 1 hour',
    yearsExperience: 15,
    insuranceVerified: true,
    backgroundChecked: true,
    description: 'Family-owned renovation company specializing in kitchen and bathroom transformations. Licensed, bonded, and insured with over 15 years of experience.',
  },
  {
    id: 'c2',
    name: 'Sarah Chen',
    companyName: 'BuildRight Construction',
    rating: 94,
    reviewCount: 89,
    completedJobs: 156,
    hourlyRate: 95,
    verified: true,
    featured: false,
    location: { city: 'Austin', state: 'TX', distance: 8 },
    specialties: ['Commercial', 'Roofing', 'General Construction'],
    availability: 'busy',
    responseTime: '< 4 hours',
    yearsExperience: 12,
    insuranceVerified: true,
    backgroundChecked: true,
    description: 'Commercial and residential construction specialists. Known for on-time delivery and exceptional quality craftsmanship.',
  },
  {
    id: 'c3',
    name: 'Robert Williams',
    companyName: 'Elite HVAC Services',
    rating: 98,
    reviewCount: 203,
    completedJobs: 412,
    hourlyRate: 75,
    verified: true,
    featured: true,
    location: { city: 'Round Rock', state: 'TX', distance: 12 },
    specialties: ['HVAC', 'Heating', 'Air Conditioning'],
    availability: 'available',
    responseTime: '< 30 min',
    yearsExperience: 20,
    insuranceVerified: true,
    backgroundChecked: true,
    description: 'Factory-trained HVAC technicians providing emergency repairs and installations. 24/7 service available.',
  },
  {
    id: 'c4',
    name: 'James Martinez',
    companyName: 'Precision Plumbing',
    rating: 92,
    reviewCount: 156,
    completedJobs: 287,
    hourlyRate: 80,
    verified: true,
    featured: false,
    location: { city: 'Cedar Park', state: 'TX', distance: 15 },
    specialties: ['Plumbing', 'Water Heater', 'Drain Cleaning'],
    availability: 'available',
    responseTime: '< 2 hours',
    yearsExperience: 18,
    insuranceVerified: true,
    backgroundChecked: true,
    description: 'Full-service plumbing company offering residential and commercial services. Emergency repairs available.',
  },
  {
    id: 'c5',
    name: 'Emily Parker',
    companyName: 'Spark Electric',
    rating: 95,
    reviewCount: 98,
    completedJobs: 178,
    hourlyRate: 90,
    verified: true,
    featured: false,
    location: { city: 'Austin', state: 'TX', distance: 3 },
    specialties: ['Electrical', 'Panel Upgrade', 'Smart Home'],
    availability: 'busy',
    responseTime: '< 1 hour',
    yearsExperience: 10,
    insuranceVerified: true,
    backgroundChecked: true,
    description: 'Licensed master electrician specializing in residential and commercial electrical work. Smart home installation experts.',
  },
  {
    id: 'c6',
    name: 'David Thompson',
    companyName: 'Thompson Landscaping',
    rating: 88,
    reviewCount: 67,
    completedJobs: 134,
    hourlyRate: 55,
    verified: false,
    featured: false,
    location: { city: 'Pflugerville', state: 'TX', distance: 18 },
    specialties: ['Landscaping', 'Hardscaping', 'Irrigation'],
    availability: 'available',
    responseTime: '< 4 hours',
    yearsExperience: 8,
    insuranceVerified: true,
    backgroundChecked: false,
    description: 'Transform your outdoor space with our professional landscaping services. Specializing in native Texas plants.',
  },
];

const specialtyOptions = [
  'All Specialties',
  'Kitchen Remodel',
  'Bathroom Remodel',
  'Roofing',
  'HVAC',
  'Plumbing',
  'Electrical',
  'Landscaping',
  'General Construction',
  'Commercial',
];

interface AdvancedContractorSearchProps {
  onSelectContractor?: (contractor: Contractor) => void;
}

export function AdvancedContractorSearch({ onSelectContractor }: AdvancedContractorSearchProps) {
  const [contractors, setContractors] = useState<Contractor[]>(sampleContractors);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    specialty: 'All Specialties',
    maxRate: 150,
    minRating: 0,
    maxDistance: 50,
    verifiedOnly: false,
    availableNow: false,
    backgroundChecked: false,
  });

  // Apply filters
  const filteredContractors = contractors.filter(c => {
    const matchesSearch = searchTerm === '' || 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = filters.specialty === 'All Specialties' || 
      c.specialties.includes(filters.specialty);
    
    const matchesRate = c.hourlyRate <= filters.maxRate;
    const matchesRating = c.rating >= filters.minRating;
    const matchesDistance = !c.location.distance || c.location.distance <= filters.maxDistance;
    const matchesVerified = !filters.verifiedOnly || c.verified;
    const matchesAvailable = !filters.availableNow || c.availability === 'available';
    const matchesBackground = !filters.backgroundChecked || c.backgroundChecked;

    return matchesSearch && matchesSpecialty && matchesRate && matchesRating && 
           matchesDistance && matchesVerified && matchesAvailable && matchesBackground;
  });

  // Sort: featured first, then by rating
  const sortedContractors = [...filteredContractors].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.rating - a.rating;
  });

  const toggleFavorite = (contractorId: string) => {
    setFavorites(prev => 
      prev.includes(contractorId) 
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    );
  };

  const getAvailabilityBadge = (availability: Contractor['availability']) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-green-500">Available Now</Badge>;
      case 'busy':
        return <Badge variant="secondary">Busy</Badge>;
      case 'booked':
        return <Badge variant="outline">Fully Booked</Badge>;
    }
  };

  const resetFilters = () => {
    setFilters({
      specialty: 'All Specialties',
      maxRate: 150,
      minRating: 0,
      maxDistance: 50,
      verifiedOnly: false,
      availableNow: false,
      backgroundChecked: false,
    });
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Find Contractors</h1>
            <p className="text-muted-foreground">
              {sortedContractors.length} contractors match your criteria
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Sliders className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </motion.div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-shrink-0"
            >
              <Card className="sticky top-4">
                <CardContent className="p-4 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Specialty</Label>
                    <Select 
                      value={filters.specialty} 
                      onValueChange={(v) => setFilters({ ...filters, specialty: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {specialtyOptions.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Max Hourly Rate: ${filters.maxRate}/hr</Label>
                    <Slider
                      value={[filters.maxRate]}
                      onValueChange={([v]) => setFilters({ ...filters, maxRate: v })}
                      min={25}
                      max={200}
                      step={5}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>$25</span>
                      <span>$200</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Min Rating: {filters.minRating}/100</Label>
                    <Slider
                      value={[filters.minRating]}
                      onValueChange={([v]) => setFilters({ ...filters, minRating: v })}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Distance: {filters.maxDistance} miles</Label>
                    <Slider
                      value={[filters.maxDistance]}
                      onValueChange={([v]) => setFilters({ ...filters, maxDistance: v })}
                      min={5}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="cursor-pointer">Verified Only</Label>
                      <Switch
                        checked={filters.verifiedOnly}
                        onCheckedChange={(v) => setFilters({ ...filters, verifiedOnly: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="cursor-pointer">Available Now</Label>
                      <Switch
                        checked={filters.availableNow}
                        onCheckedChange={(v) => setFilters({ ...filters, availableNow: v })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="cursor-pointer">Background Checked</Label>
                      <Switch
                        checked={filters.backgroundChecked}
                        onCheckedChange={(v) => setFilters({ ...filters, backgroundChecked: v })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, or specialty..."
              className="pl-12 h-12"
            />
          </div>

          {/* Results */}
          <div className="space-y-4">
            {sortedContractors.map((contractor, index) => (
              <motion.div
                key={contractor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card 
                  className={`overflow-hidden cursor-pointer transition-all hover:border-primary/50 ${
                    contractor.featured ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10' : ''
                  }`}
                  onClick={() => setSelectedContractor(contractor)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={contractor.avatar} />
                          <AvatarFallback className="text-xl">
                            {contractor.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {contractor.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                            <CheckCircle className="w-4 h-4 text-white" weight="fill" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{contractor.companyName}</h3>
                              {contractor.featured && (
                                <Badge className="bg-amber-500">
                                  <Lightning className="w-3 h-3 mr-1" weight="fill" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{contractor.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(contractor.id);
                            }}
                          >
                            <HeartStraight 
                              className={`w-5 h-5 ${
                                favorites.includes(contractor.id) ? 'text-red-500' : ''
                              }`}
                              weight={favorites.includes(contractor.id) ? 'fill' : 'regular'}
                            />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-500" weight="fill" />
                            <span className="font-semibold">{contractor.rating}</span>
                            <span className="text-muted-foreground">({contractor.reviewCount} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {contractor.location.city}, {contractor.location.state}
                            {contractor.location.distance && ` • ${contractor.location.distance} mi`}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Briefcase className="w-4 h-4" />
                            {contractor.completedJobs} jobs
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {contractor.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {contractor.specialties.slice(0, 3).map(s => (
                            <Badge key={s} variant="secondary">{s}</Badge>
                          ))}
                          {contractor.specialties.length > 3 && (
                            <Badge variant="outline">+{contractor.specialties.length - 3}</Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getAvailabilityBadge(contractor.availability)}
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Responds {contractor.responseTime}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${contractor.hourlyRate}</p>
                            <p className="text-xs text-muted-foreground">per hour</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {sortedContractors.length === 0 && (
              <Card className="p-12 text-center">
                <MagnifyingGlass className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Contractors Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Contractor Detail Modal */}
      <AnimatePresence>
        {selectedContractor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContractor(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedContractor.avatar} />
                    <AvatarFallback className="text-2xl">{selectedContractor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedContractor.companyName}</h2>
                    <p className="text-muted-foreground">{selectedContractor.name}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedContractor(null)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  {getAvailabilityBadge(selectedContractor.availability)}
                  {selectedContractor.verified && (
                    <Badge variant="secondary">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {selectedContractor.backgroundChecked && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      Background Checked
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground">{selectedContractor.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{selectedContractor.rating}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{selectedContractor.completedJobs}</p>
                    <p className="text-sm text-muted-foreground">Jobs Done</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{selectedContractor.yearsExperience}</p>
                    <p className="text-sm text-muted-foreground">Years Exp.</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">${selectedContractor.hourlyRate}</p>
                    <p className="text-sm text-muted-foreground">Per Hour</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedContractor.specialties.map(s => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => {
                    onSelectContractor?.(selectedContractor);
                    setSelectedContractor(null);
                    toast.success('Request sent to contractor!');
                  }}>
                    Request Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline">
                    <Envelope className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
