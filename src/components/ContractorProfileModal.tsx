import { useState, useEffect } from 'react';
import { X, Star, CheckCircle, MapPin, CurrencyDollar, Briefcase, ShieldCheck, Certificate, Phone, EnvelopeSimple, Calendar } from '@phosphor-icons/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ReviewSystem } from '@/components/ReviewSystem';
import { dataStore } from '@/lib/store';
import { aggregateContractorRatings } from '@/lib/rating-aggregator';
import type { User, Rating } from '@/lib/types';

interface ContractorProfileModalProps {
  contractor: User;
  open: boolean;
  onClose: () => void;
  onContact?: () => void;
}

export function ContractorProfileModal({ contractor, open, onClose, onContact }: ContractorProfileModalProps) {
  const profile = contractor.contractorProfile;
  const [contractorRatings, setContractorRatings] = useState<{ overallRating: number; categoryRatings: any[] } | null>(null);
  const [loadingRatings, setLoadingRatings] = useState(true);
  
  if (!profile) return null;

  useEffect(() => {
    if (open && contractor.id) {
      loadRatings();
    }
  }, [open, contractor.id]);

  const loadRatings = async () => {
    setLoadingRatings(true);
    try {
      const ratings = await dataStore.getRatings(contractor.id);
      const aggregated = aggregateContractorRatings(contractor.id, ratings);
      setContractorRatings(aggregated);
    } catch (error) {
      console.error('Failed to load ratings:', error);
    } finally {
      setLoadingRatings(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 95) return 'bg-accent';
    if (rating >= 85) return 'bg-secondary';
    if (rating >= 75) return 'bg-primary';
    return 'bg-muted-foreground';
  };

  // Use aggregated ratings if available, otherwise fallback to static data
  const categoryRatings = contractorRatings?.categoryRatings.length 
    ? contractorRatings.categoryRatings.map(cr => ({
        label: cr.categoryName,
        value: cr.rating,
        jobsCompleted: cr.jobsCompleted,
        dimensions: cr.dimensions
      }))
    : [
        { label: 'Quality', value: profile.rating || 95 },
        { label: 'Communication', value: profile.rating || 92 },
        { label: 'Timeliness', value: profile.rating || 98 },
        { label: 'Professionalism', value: profile.rating || 96 },
        { label: 'Cleanliness', value: profile.rating || 90 },
      ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">Contractor Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 border-4 border-border shadow-xl">
                <AvatarImage src={contractor.avatar} alt={contractor.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
                  {contractor.name[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {profile.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-card flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" weight="fill" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h2 className="text-3xl font-bold mb-1">{contractor.name}</h2>
                  {profile.verified && (
                    <Badge className="bg-accent/10 border-accent/30 text-accent mb-2">
                      <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                      Verified Professional
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-6 h-6 text-accent" weight="fill" />
                    <span className="text-3xl font-bold">{profile.rating}</span>
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile.completedJobs} jobs completed</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <CurrencyDollar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                    <p className="font-semibold">${profile.hourlyRate}/hr</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service Area</p>
                    <p className="font-semibold">{profile.serviceRadius} miles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties && profile.specialties.length > 0 ? (
                    profile.specialties.map((specialty, i) => (
                      <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No specialties listed</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Availability</h3>
                <Badge 
                  variant={profile.availability === 'available' ? 'default' : 'secondary'}
                  className="text-sm px-3 py-1"
                >
                  {profile.availability === 'available' ? '✓ Available' : profile.availability === 'busy' ? 'Busy' : 'Unavailable'}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Location</h3>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{profile.location.address}</p>
                    <p className="text-muted-foreground">Serving within {profile.serviceRadius} miles</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ratings" className="space-y-4 mt-4">
              {contractorRatings && contractorRatings.categoryRatings.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Performance by Service Category</h3>
                  <div className="space-y-4">
                    {contractorRatings.categoryRatings.map((category) => (
                      <Card key={category.categoryId} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{category.categoryName}</h4>
                            <p className="text-xs text-muted-foreground">
                              {category.jobsCompleted} job{category.jobsCompleted !== 1 ? 's' : ''} completed
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-accent" weight="fill" />
                            <span className="text-2xl font-bold">{category.rating}</span>
                            <span className="text-sm text-muted-foreground">/100</span>
                          </div>
                        </div>
                        <div className="space-y-2 mt-3">
                          {Object.entries(category.dimensions).map(([dimension, value]) => (
                            <div key={dimension}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium capitalize">{dimension}</span>
                                <span className="text-xs font-bold">{value as number}/100</span>
                              </div>
                              <Progress value={value as number} className="h-1.5" />
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Overall Performance</h3>
                <div className="space-y-4">
                  {categoryRatings.slice(0, 5).map((category, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{category.label}</span>
                        <span className="text-sm font-bold">{category.value}/100</span>
                      </div>
                      <Progress value={category.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <ReviewSystem 
                  contractorId={contractor.id}
                  contractorName={contractor.name}
                />
              </div>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-4 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Licenses</h3>
                {profile.licenses.length > 0 ? (
                  <div className="space-y-3">
                    {profile.licenses.map((license, i) => (
                      <Card key={i} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Certificate className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{license.type}</h4>
                              {license.verified && (
                                <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              License #{license.number} • {license.state}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Expires: {new Date(license.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No licenses listed</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Insurance</h3>
                <Card className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <ShieldCheck className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{profile.insurance.provider}</h4>
                        {profile.insurance.verified && (
                          <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" weight="fill" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Policy #{profile.insurance.policyNumber}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Coverage: ${profile.insurance.coverageAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {new Date(profile.insurance.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <Separator />

          <div className="flex gap-3">
            <Button onClick={onContact} size="lg" className="flex-1">
              <EnvelopeSimple className="w-5 h-5 mr-2" weight="fill" />
              Contact Contractor
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
