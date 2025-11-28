import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  UserCircle,
  ShieldCheck,
  Certificate,
  Briefcase,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Star,
  Upload,
  FileText,
  Phone,
  EnvelopeSimple,
  Buildings,
  IdentificationCard,
  Sparkle,
  Trophy,
  Lightning,
  Target,
  Hammer,
  HardHat,
  Wrench,
  PaintBrush,
  Lightning as LightningBolt,
  Drop,
  Thermometer,
  House,
} from '@phosphor-icons/react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface ContractorProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: 'sole-proprietor' | 'llc' | 'corporation' | 'partnership';
  };
  licenses: {
    state: string;
    licenseNumber: string;
    expirationDate: string;
    licenseType: string;
    verified: boolean;
  }[];
  insurance: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expirationDate: string;
    verified: boolean;
  };
  specialties: string[];
  serviceAreas: string[];
  experience: {
    yearsInBusiness: number;
    completedProjects: number;
    certifications: string[];
  };
}

const serviceCategories = [
  { id: 'roofing', name: 'Roofing', icon: House },
  { id: 'plumbing', name: 'Plumbing', icon: Drop },
  { id: 'electrical', name: 'Electrical', icon: LightningBolt },
  { id: 'hvac', name: 'HVAC', icon: Thermometer },
  { id: 'painting', name: 'Painting', icon: PaintBrush },
  { id: 'general', name: 'General Contracting', icon: Hammer },
  { id: 'carpentry', name: 'Carpentry', icon: Wrench },
  { id: 'flooring', name: 'Flooring', icon: House },
];

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CO', 'CT', 'DE', 'GA', 'HI', 'ID',
  'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
  'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NC',
  'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
  'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
];

export function ContractorOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<ContractorProfile>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      businessType: 'sole-proprietor',
    },
    licenses: [],
    insurance: {
      provider: '',
      policyNumber: '',
      coverageAmount: 1000000,
      expirationDate: '',
      verified: false,
    },
    specialties: [],
    serviceAreas: [],
    experience: {
      yearsInBusiness: 0,
      completedProjects: 0,
      certifications: [],
    },
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself and your business',
      icon: <UserCircle className="w-6 h-6" />,
      completed: !!(profile.personalInfo.firstName && profile.personalInfo.lastName && profile.personalInfo.email),
    },
    {
      id: 'licensing',
      title: 'Licensing & Insurance',
      description: 'Verify your professional credentials',
      icon: <Certificate className="w-6 h-6" />,
      completed: profile.licenses.length > 0 && !!profile.insurance.provider,
    },
    {
      id: 'specialties',
      title: 'Services & Specialties',
      description: 'Select your areas of expertise',
      icon: <Briefcase className="w-6 h-6" />,
      completed: profile.specialties.length > 0,
    },
    {
      id: 'service-areas',
      title: 'Service Areas',
      description: 'Define where you work',
      icon: <MapPin className="w-6 h-6" />,
      completed: profile.serviceAreas.length > 0,
    },
    {
      id: 'experience',
      title: 'Experience & Portfolio',
      description: 'Showcase your work history',
      icon: <Trophy className="w-6 h-6" />,
      completed: profile.experience.yearsInBusiness > 0,
    },
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
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const toggleServiceArea = (state: string) => {
    setProfile(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(state)
        ? prev.serviceAreas.filter(s => s !== state)
        : [...prev.serviceAreas, state],
    }));
  };

  const addLicense = () => {
    setProfile(prev => ({
      ...prev,
      licenses: [
        ...prev.licenses,
        {
          state: '',
          licenseNumber: '',
          expirationDate: '',
          licenseType: '',
          verified: false,
        },
      ],
    }));
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" weight="fill" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to FairTradeWorker! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your profile is complete. You're ready to start receiving job opportunities
              and keep 100% of your earnings.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4">
                <Lightning className="w-8 h-8 text-blue-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">Zero Platform Fees</p>
                <p className="text-xs text-gray-500">Keep 100% earnings</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">Matched Jobs</p>
                <p className="text-xs text-gray-500">Based on your skills</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <Sparkle className="w-8 h-8 text-purple-600 mx-auto mb-2" weight="fill" />
                <p className="text-sm font-medium text-gray-900">AI Assistance</p>
                <p className="text-xs text-gray-500">Smart quote generation</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button size="lg">
                Browse Available Jobs
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Complete Your Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Contractor Onboarding</h1>
              <p className="text-sm text-gray-500">Complete your profile to start receiving jobs</p>
            </div>
            <Badge variant="outline" className="text-blue-600">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Navigation */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                index === currentStep
                  ? 'bg-blue-600 text-white'
                  : step.completed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {step.completed && index !== currentStep ? (
                <CheckCircle className="w-5 h-5" weight="fill" />
              ) : (
                step.icon
              )}
              <span className="text-sm font-medium">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {steps[currentStep].icon}
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Personal Information Step */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      placeholder="John"
                      value={profile.personalInfo.firstName}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, firstName: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      placeholder="Smith"
                      value={profile.personalInfo.lastName}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, lastName: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <EnvelopeSimple className="w-4 h-4 inline mr-1" />
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      value={profile.personalInfo.email}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={profile.personalInfo.phone}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Buildings className="w-4 h-4 inline mr-1" />
                    Business Name
                  </label>
                  <Input
                    placeholder="Smith Contracting LLC"
                    value={profile.personalInfo.businessName}
                    onChange={(e) =>
                      setProfile(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, businessName: e.target.value },
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'sole-proprietor', label: 'Sole Proprietor' },
                      { value: 'llc', label: 'LLC' },
                      { value: 'corporation', label: 'Corporation' },
                      { value: 'partnership', label: 'Partnership' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() =>
                          setProfile(prev => ({
                            ...prev,
                            personalInfo: {
                              ...prev.personalInfo,
                              businessType: type.value as ContractorProfile['personalInfo']['businessType'],
                            },
                          }))
                        }
                        className={`p-3 rounded-lg border-2 transition-all ${
                          profile.personalInfo.businessType === type.value
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Licensing & Insurance Step */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Contractor Licenses</h3>
                    <Button variant="outline" size="sm" onClick={addLicense}>
                      + Add License
                    </Button>
                  </div>

                  {profile.licenses.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                      <Certificate className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">No licenses added yet</p>
                      <Button variant="outline" onClick={addLicense}>
                        Add Your First License
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.licenses.map((license, index) => (
                        <div key={index} className="border rounded-xl p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">State</label>
                              <select
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                                value={license.state}
                                onChange={(e) => {
                                  const newLicenses = [...profile.licenses];
                                  newLicenses[index].state = e.target.value;
                                  setProfile(prev => ({ ...prev, licenses: newLicenses }));
                                }}
                              >
                                <option value="">Select State</option>
                                {usStates.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">License #</label>
                              <Input
                                placeholder="ABC123456"
                                value={license.licenseNumber}
                                onChange={(e) => {
                                  const newLicenses = [...profile.licenses];
                                  newLicenses[index].licenseNumber = e.target.value;
                                  setProfile(prev => ({ ...prev, licenses: newLicenses }));
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Type</label>
                              <Input
                                placeholder="General Contractor"
                                value={license.licenseType}
                                onChange={(e) => {
                                  const newLicenses = [...profile.licenses];
                                  newLicenses[index].licenseType = e.target.value;
                                  setProfile(prev => ({ ...prev, licenses: newLicenses }));
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Expires</label>
                              <Input
                                type="date"
                                value={license.expirationDate}
                                onChange={(e) => {
                                  const newLicenses = [...profile.licenses];
                                  newLicenses[index].expirationDate = e.target.value;
                                  setProfile(prev => ({ ...prev, licenses: newLicenses }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insurance Provider
                      </label>
                      <Input
                        placeholder="State Farm, Allstate, etc."
                        value={profile.insurance.provider}
                        onChange={(e) =>
                          setProfile(prev => ({
                            ...prev,
                            insurance: { ...prev.insurance, provider: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Policy Number
                      </label>
                      <Input
                        placeholder="POL-123456789"
                        value={profile.insurance.policyNumber}
                        onChange={(e) =>
                          setProfile(prev => ({
                            ...prev,
                            insurance: { ...prev.insurance, policyNumber: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coverage Amount
                      </label>
                      <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={profile.insurance.coverageAmount}
                        onChange={(e) =>
                          setProfile(prev => ({
                            ...prev,
                            insurance: { ...prev.insurance, coverageAmount: Number(e.target.value) },
                          }))
                        }
                      >
                        <option value={500000}>$500,000</option>
                        <option value={1000000}>$1,000,000 (Recommended)</option>
                        <option value={2000000}>$2,000,000</option>
                        <option value={5000000}>$5,000,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <Input
                        type="date"
                        value={profile.insurance.expirationDate}
                        onChange={(e) =>
                          setProfile(prev => ({
                            ...prev,
                            insurance: { ...prev.insurance, expirationDate: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="w-6 h-6 text-blue-600 flex-shrink-0" weight="fill" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Minimum $1M Coverage Required
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Contractors must maintain at least $1,000,000 in general liability coverage to bid on jobs through FairTradeWorker.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Specialties Step */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Select all services you're qualified to provide. This helps match you with relevant job opportunities.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = profile.specialties.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        onClick={() => toggleSpecialty(category.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} weight={isSelected ? 'fill' : 'regular'} />
                        <p className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                          {category.name}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {profile.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    {profile.specialties.map((specialty) => {
                      const category = serviceCategories.find(c => c.id === specialty);
                      return (
                        <Badge key={specialty} variant="secondary" className="px-3 py-1">
                          {category?.name}
                          <button
                            onClick={() => toggleSpecialty(specialty)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                          >
                            ×
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Service Areas Step */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Select the states where you're licensed and willing to work.
                </p>

                <div className="grid grid-cols-6 md:grid-cols-8 gap-2">
                  {usStates.map((state) => {
                    const isSelected = profile.serviceAreas.includes(state);
                    return (
                      <button
                        key={state}
                        onClick={() => toggleServiceArea(state)}
                        className={`p-3 rounded-lg border-2 transition-all font-medium ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {state}
                      </button>
                    );
                  })}
                </div>

                {profile.serviceAreas.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm font-medium text-green-800">
                      {profile.serviceAreas.length} state{profile.serviceAreas.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You'll receive job notifications from these areas
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Experience Step */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years in Business
                    </label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="10"
                      value={profile.experience.yearsInBusiness || ''}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          experience: { ...prev.experience, yearsInBusiness: Number(e.target.value) },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completed Projects (Estimate)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="500"
                      value={profile.experience.completedProjects || ''}
                      onChange={(e) =>
                        setProfile(prev => ({
                          ...prev,
                          experience: { ...prev.experience, completedProjects: Number(e.target.value) },
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Images
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">Drag and drop images or click to upload</p>
                    <p className="text-xs text-gray-400">
                      Show off your best work to attract more clients
                    </p>
                    <Button variant="outline" className="mt-4">
                      Upload Photos
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications & Awards
                  </label>
                  <div className="space-y-2">
                    {['EPA Lead-Safe Certified', 'OSHA Safety Certified', 'BBB Accredited', 'Home Advisor Screened'].map((cert) => (
                      <label key={cert} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded"
                          checked={profile.experience.certifications.includes(cert)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setProfile(prev => ({
                                ...prev,
                                experience: {
                                  ...prev.experience,
                                  certifications: [...prev.experience.certifications, cert],
                                },
                              }));
                            } else {
                              setProfile(prev => ({
                                ...prev,
                                experience: {
                                  ...prev.experience,
                                  certifications: prev.experience.certifications.filter(c => c !== cert),
                                },
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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

export default ContractorOnboarding;
