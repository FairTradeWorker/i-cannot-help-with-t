import type { User, Job, ContractorProfile, HomeownerProfile } from './types';
import { dataStore } from './store';

export async function initializeDemoData(): Promise<void> {
  const users = await dataStore.getUsers();
  
  if (users.length > 0) {
    return;
  }

  const demoContractor: User = {
    id: 'contractor-1',
    role: 'contractor',
    email: 'mike@construction.com',
    name: 'Mike Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike&backgroundColor=b6e3f4',
    phone: '(555) 123-4567',
    createdAt: new Date('2023-01-15'),
    contractorProfile: {
      userId: 'contractor-1',
      contractorType: 'general_contractor',
      rating: 92,
      completedJobs: 47,
      skills: ['Roofing', 'Siding', 'Gutters', 'Waterproofing'],
      specialties: ['Residential Roofing', 'Commercial Roofing'],
      serviceRadius: 25,
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'New York, NY'
      },
      hourlyRate: 85,
      availability: 'available',
      verified: true,
      licenses: [
        {
          type: 'General Contractor',
          number: 'GC-123456',
          state: 'NY',
          expiryDate: new Date('2025-12-31'),
          verified: true
        }
      ],
      insurance: {
        provider: 'State Farm',
        policyNumber: 'SF-789012',
        expiryDate: new Date('2025-06-30'),
        coverageAmount: 2000000,
        verified: true
      }
    }
  };

  const demoContractor2: User = {
    id: 'contractor-2',
    role: 'contractor',
    email: 'sarah@renovations.com',
    name: 'Sarah Martinez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffd5dc',
    phone: '(555) 234-5678',
    createdAt: new Date('2023-03-20'),
    contractorProfile: {
      userId: 'contractor-2',
      contractorType: 'subcontractor',
      rating: 88,
      completedJobs: 32,
      skills: ['Roofing', 'Painting', 'General Repairs'],
      specialties: ['Roof Repair', 'Exterior Painting'],
      serviceRadius: 20,
      location: {
        lat: 40.7300,
        lng: -74.0100,
        address: 'New York, NY'
      },
      hourlyRate: 75,
      availability: 'available',
      verified: true,
      licenses: [
        {
          type: 'Home Improvement',
          number: 'HI-654321',
          state: 'NY',
          expiryDate: new Date('2025-09-30'),
          verified: true
        }
      ],
      insurance: {
        provider: 'Allstate',
        policyNumber: 'AS-345678',
        expiryDate: new Date('2025-03-31'),
        coverageAmount: 1000000,
        verified: true
      }
    }
  };

  const demoHomeowner: User = {
    id: 'homeowner-1',
    role: 'homeowner',
    email: 'john@email.com',
    name: 'John Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=c0aede',
    phone: '(555) 987-6543',
    createdAt: new Date('2023-06-10'),
    homeownerProfile: {
      userId: 'homeowner-1',
      savedAddresses: [
        {
          street: '123 Main Street',
          city: 'Brooklyn',
          state: 'NY',
          zip: '11201',
          lat: 40.6782,
          lng: -73.9442
        }
      ],
      completedProjects: 3,
      loyaltyPoints: 150
    }
  };

  const demoContractor3: User = {
    id: 'contractor-3',
    role: 'contractor',
    email: 'david@roofpros.com',
    name: 'David Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffdfbf',
    phone: '(555) 345-6789',
    createdAt: new Date('2022-11-05'),
    contractorProfile: {
      userId: 'contractor-3',
      contractorType: 'general_contractor',
      rating: 96,
      completedJobs: 89,
      skills: ['Roofing', 'Waterproofing', 'Structural Repair', 'Storm Damage'],
      specialties: ['Emergency Repairs', 'Storm Damage'],
      serviceRadius: 30,
      location: {
        lat: 40.7589,
        lng: -73.9851,
        address: 'Manhattan, NY'
      },
      hourlyRate: 95,
      availability: 'available',
      verified: true,
      licenses: [
        {
          type: 'Master Roofer',
          number: 'MR-987654',
          state: 'NY',
          expiryDate: new Date('2026-03-31'),
          verified: true
        }
      ],
      insurance: {
        provider: 'Liberty Mutual',
        policyNumber: 'LM-123789',
        expiryDate: new Date('2025-08-31'),
        coverageAmount: 3000000,
        verified: true
      }
    }
  };

  const demoContractor4: User = {
    id: 'contractor-4',
    role: 'contractor',
    email: 'emma@homefixers.com',
    name: 'Emma Rodriguez',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=d1d4f9',
    phone: '(555) 456-7890',
    createdAt: new Date('2023-05-12'),
    contractorProfile: {
      userId: 'contractor-4',
      contractorType: 'subcontractor',
      rating: 78,
      completedJobs: 23,
      skills: ['Roofing', 'Gutter Installation', 'Minor Repairs'],
      specialties: ['Gutter Systems'],
      serviceRadius: 15,
      location: {
        lat: 40.7489,
        lng: -73.9680,
        address: 'Queens, NY'
      },
      hourlyRate: 65,
      availability: 'busy',
      verified: false,
      licenses: [
        {
          type: 'Home Improvement',
          number: 'HI-567890',
          state: 'NY',
          expiryDate: new Date('2025-04-30'),
          verified: true
        }
      ],
      insurance: {
        provider: 'Progressive',
        policyNumber: 'PR-789456',
        expiryDate: new Date('2025-02-28'),
        coverageAmount: 500000,
        verified: true
      }
    }
  };

  await dataStore.saveUser(demoContractor);
  await dataStore.saveUser(demoContractor2);
  await dataStore.saveUser(demoHomeowner);
  await dataStore.saveUser(demoContractor3);
  await dataStore.saveUser(demoContractor4);

  const demoJob: Job = {
    id: 'job-' + Date.now(),
    title: 'Roof Leak Repair Needed',
    description: 'Water stains appearing on ceiling after recent storms. Need professional assessment and repair.',
    status: 'posted',
    homeownerId: 'homeowner-1',
    address: {
      street: '123 Main Street',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      lat: 40.6782,
      lng: -73.9442
    },
    urgency: 'urgent',
    estimatedCost: { min: 800, max: 1500 },
    laborHours: 8,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    bids: [],
    messages: [],
    milestones: []
  };

  await dataStore.saveJob(demoJob);

  console.log('✅ Demo data initialized');
}

export async function switchUserRole(role: 'contractor' | 'homeowner'): Promise<User> {
  const users = await dataStore.getUsers();
  const user = users.find(u => u.role === role);
  
  if (!user) {
    throw new Error(`No ${role} user found`);
  }
  
  await dataStore.setCurrentUser(user);
  return user;
}
