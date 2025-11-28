import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  House,
  User,
  MapPin,
  Phone,
  EnvelopeSimple,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lightning,
  Star,
  Briefcase,
  CurrencyDollar,
  Bell,
  VideoCamera,
  Camera,
  TextAlignLeft,
  Sparkle,
  Heart,
} from '@phosphor-icons/react';

interface HomeownerProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  propertyInfo: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    propertyType: 'single-family' | 'condo' | 'townhouse' | 'multi-family' | 'commercial';
    yearBuilt: string;
    squareFootage: string;
  };
  preferences: {
    preferredContact: 'email' | 'phone' | 'text';
    notificationPrefs: string[];
    budgetRange: string;
  };
}

const propertyTypes = [
  { value: 'single-family', label: 'Single Family Home', icon: House },
  { value: 'condo', label: 'Condo/Apartment', icon: House },
  { value: 'townhouse', label: 'Townhouse', icon: House },
  { value: 'multi-family', label: 'Multi-Family', icon: House },
  { value: 'commercial', label: 'Commercial', icon: House },
];

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CO', 'CT', 'DE', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
  'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NC',
  'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
  'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

export function HomeownerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<HomeownerProfile>({
    personalInfo: { firstName: '', lastName: '', email: '', phone: '' },
    propertyInfo: { address: '', city: '', state: '', zipCode: '', propertyType: 'single-family', yearBuilt: '', squareFootage: '' },
    preferences: { preferredContact: 'email', notificationPrefs: [], budgetRange: '' },
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    { id: 'personal', title: 'Personal Info', icon: <User className="w-6 h-6" />, completed: !!(profile.personalInfo.firstName && profile.personalInfo.email) },
    { id: 'property', title: 'Property Details', icon: <House className="w-6 h-6" />, completed: !!(profile.propertyInfo.address && profile.propertyInfo.zipCode) },
    { id: 'preferences', title: 'Preferences', icon: <Bell className="w-6 h-6" />, completed: !!profile.preferences.preferredContact },
  ];

  const progress = (steps.filter(s => s.completed).length / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" weight="fill" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FairTradeWorker! 🏠</h1>
            <p className="text-lg text-gray-600 mb-8">Your profile is set up. You're ready to post your first job and get connected with verified contractors.</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <VideoCamera className="w-8 h-8 text-blue-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">Video Jobs</p>
                <p className="text-xs text-gray-500">60-second AI analysis</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <ShieldCheck className="w-8 h-8 text-green-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">Verified Pros</p>
                <p className="text-xs text-gray-500">Licensed & insured</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <CurrencyDollar className="w-8 h-8 text-purple-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">$20 Flat Fee</p>
                <p className="text-xs text-gray-500">No hidden costs</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button size="lg">
                <Briefcase className="w-5 h-5 mr-2" />
                Post Your First Job
              </Button>
              <Button size="lg" variant="outline">Browse Contractors</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Homeowner Setup</h1>
              <p className="text-sm text-gray-500">Complete your profile to get started</p>
            </div>
            <Badge variant="outline" className="text-blue-600">Step {currentStep + 1} of {steps.length}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                index === currentStep ? 'bg-blue-600 text-white' :
                step.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step.completed && index !== currentStep ? <CheckCircle className="w-5 h-5" weight="fill" /> : step.icon}
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">{steps[currentStep].icon}{steps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                    <Input placeholder="John" value={profile.personalInfo.firstName} onChange={(e) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, firstName: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                    <Input placeholder="Smith" value={profile.personalInfo.lastName} onChange={(e) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, lastName: e.target.value } }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><EnvelopeSimple className="w-4 h-4 inline mr-1" />Email *</label>
                  <Input type="email" placeholder="john@example.com" value={profile.personalInfo.email} onChange={(e) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><Phone className="w-4 h-4 inline mr-1" />Phone</label>
                  <Input type="tel" placeholder="(555) 123-4567" value={profile.personalInfo.phone} onChange={(e) => setProfile(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))} />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1"><MapPin className="w-4 h-4 inline mr-1" />Street Address *</label>
                  <Input placeholder="123 Main Street" value={profile.propertyInfo.address} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, address: e.target.value } }))} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <Input placeholder="Dallas" value={profile.propertyInfo.city} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, city: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={profile.propertyInfo.state} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, state: e.target.value } }))}>
                      <option value="">Select</option>
                      {usStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <Input placeholder="75001" value={profile.propertyInfo.zipCode} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, zipCode: e.target.value } }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {propertyTypes.slice(0, 3).map((type) => {
                      const isSelected = profile.propertyInfo.propertyType === type.value;
                      return (
                        <button key={type.value} onClick={() => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, propertyType: type.value as any } }))} className={`p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <House className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{type.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                    <Input placeholder="1990" value={profile.propertyInfo.yearBuilt} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, yearBuilt: e.target.value } }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Square Footage</label>
                    <Input placeholder="2,500" value={profile.propertyInfo.squareFootage} onChange={(e) => setProfile(prev => ({ ...prev, propertyInfo: { ...prev.propertyInfo, squareFootage: e.target.value } }))} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'email', label: 'Email', icon: EnvelopeSimple },
                      { value: 'phone', label: 'Phone Call', icon: Phone },
                      { value: 'text', label: 'Text Message', icon: ChatCircle },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = profile.preferences.preferredContact === method.value;
                      return (
                        <button key={method.value} onClick={() => setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, preferredContact: method.value as any } }))} className={`p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>{method.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (Optional)</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={profile.preferences.budgetRange} onChange={(e) => setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, budgetRange: e.target.value } }))}>
                    <option value="">Select a range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkle className="w-6 h-6 text-blue-600 flex-shrink-0" weight="fill" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">How it works</p>
                      <p className="text-xs text-blue-700 mt-1">Post a job using video, photo, or text. Our AI analyzes your project and matches you with qualified, verified contractors in your area. You only pay a $20 platform fee per job - contractors keep 100% of their earnings.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Fix missing import
const ChatCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 256 256" fill="currentColor">
    <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"/>
  </svg>
);

export default HomeownerOnboarding;
