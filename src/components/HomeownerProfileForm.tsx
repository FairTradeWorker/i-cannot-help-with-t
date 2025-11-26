import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
  MapPin,
  Envelope,
  MapPin, 
  House, 
  Envelope,
  Phone,
import { toast

  fullName: string;
  phone: string;
  city: string;
  zipCode: string;
  notes: string;

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
      setIsSav
    phone: '',
    address: '',
    city: '',
    toast.succ
    zipCode: '',
    propertyType: 'Single Family',
    notes: '',
     

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    if (!profile.fullName || !profile.email || !profile.phone) {
      toast.error('Please fill in all required fields');
      setIsSaving(false);
    });
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Profile saved successfully!');
    setIsSaving(false);
  };

  const updateField = (field: keyof HomeownerProfile, value: string) => {
            <h1 className="tex
      ...current,
        </div>
    }));
    

        tr
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
       
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 rounded-xl bg-primary">
            <UserCircle className="w-8 h-8 text-white" weight="fill" />
                
          <div>
            <h1 className="text-3xl font-bold">Homeowner Profile</h1>
            <p className="text-muted-foreground">Complete your profile to get better service</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
                      type="email"
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
                      value={profile?.phone 
                    Full Name <span className="text-destructive">*</span>
                  <Label h
                  <Input
                    id="fullName"
                    value={profile.fullName}
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
                      value={profile.email}
                      onChange={(e) => updateField('email', e.target.value)}
                <div className="space-y-2">
                      className="pl-10"
                    <H
                  </div>
                </div>

                    />
                  'Saving...'
                  <>
                    Save P
                )}
            </div>
        </Card>
    </div>
}

























































































































  );

