import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { 
  UserCircle, 
  MapPin, 
  House, 
  Envelope,
  Phone,
  CheckCircle,
  User,
} from '@phosphor-icons/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface HomeownerProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  notes: string;
}

export function HomeownerProfileForm() {
  const [profile, setProfile] = useKV<HomeownerProfile>('homeowner-profile', {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'Single Family',
    notes: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (!profile?.fullName || !profile?.email || !profile?.phone) {
      toast.error('Please fill in all required fields');
      setIsSaving(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Profile saved successfully!');
    setIsSaving(false);
  };

  const updateField = (field: keyof HomeownerProfile, value: string) => {
    setProfile((current) => {
      const currentProfile = current || {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        propertyType: 'Single Family',
        notes: '',
      };
      return {
        ...currentProfile,
        [field]: value,
      };
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-xl bg-primary">
            <UserCircle className="w-8 h-8 text-white" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Homeowner Profile</h1>
            <p className="text-muted-foreground">Complete your profile to get better service</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="p-8 glass-card">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" weight="bold" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={profile?.fullName || ''}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profile?.email || ''}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profile?.phone || ''}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <select
                    id="propertyType"
                    value={profile?.propertyType || 'Single Family'}
                    onChange={(e) => updateField('propertyType', e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="Single Family">Single Family Home</option>
                    <option value="Multi Family">Multi-Family Home</option>
                    <option value="Condo">Condominium</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial Property</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" weight="bold" />
                Property Address
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <House className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profile?.address || ''}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="123 Main Street"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={profile?.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="San Francisco"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={profile?.state || ''}
                      onChange={(e) => updateField('state', e.target.value)}
                      placeholder="CA"
                      maxLength={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={profile?.zipCode || ''}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                      placeholder="94102"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Tell us about your property (optional)</Label>
                <Textarea
                  id="notes"
                  value={profile?.notes || ''}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Any special requirements or information about your property..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </p>
              <Button
                size="lg"
                onClick={handleSave}
                disabled={isSaving}
                className="px-8"
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" weight="bold" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
