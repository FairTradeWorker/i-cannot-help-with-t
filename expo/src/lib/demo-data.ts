import { dataStore } from '@/lib/store';
import type { Job, User, Territory, Conversation } from '@/types';

// Demo jobs data
const demoJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Kitchen Sink Repair - Leaking Faucet',
    description: 'The kitchen sink faucet has been leaking for a few days. Need a plumber to fix or replace the faucet.',
    status: 'posted',
    homeownerId: 'demo-homeowner-1',
    address: {
      street: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
    },
    urgency: 'urgent',
    estimatedCost: { min: 150, max: 350 },
    laborHours: 2,
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-2',
    title: 'Roof Inspection and Minor Repairs',
    description: 'Need a roof inspection after the recent storm. Some shingles may need replacement.',
    status: 'bidding',
    homeownerId: 'demo-homeowner-2',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
    },
    urgency: 'normal',
    estimatedCost: { min: 500, max: 1500 },
    laborHours: 4,
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
    bids: [
      {
        id: 'bid-1',
        jobId: 'job-2',
        contractorId: 'demo-contractor-1',
        contractor: {
          name: 'Elite Roofing',
          rating: 4.9,
          completedJobs: 156,
          hourlyRate: 85,
        },
        amount: 800,
        timeline: {
          start: new Date(Date.now() + 86400000 * 3),
          end: new Date(Date.now() + 86400000 * 4),
        },
        message: 'I can inspect and repair your roof. 20 years experience.',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000),
      },
    ],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-3',
    title: 'HVAC System Maintenance',
    description: 'Annual HVAC maintenance and filter replacement. Central air system.',
    status: 'posted',
    homeownerId: 'demo-homeowner-3',
    address: {
      street: '789 Elm St',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    urgency: 'normal',
    estimatedCost: { min: 200, max: 400 },
    laborHours: 2,
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 259200000),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-4',
    title: 'Emergency Water Heater Replacement',
    description: 'Water heater stopped working. Need immediate replacement.',
    status: 'posted',
    homeownerId: 'demo-homeowner-4',
    address: {
      street: '321 Pine Rd',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
    },
    urgency: 'emergency',
    estimatedCost: { min: 1200, max: 2500 },
    laborHours: 6,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 3600000),
    bids: [],
    messages: [],
    milestones: [],
  },
  {
    id: 'job-5',
    title: 'Bathroom Tile Repair',
    description: 'Several tiles in the master bathroom are cracked and need replacement.',
    status: 'posted',
    homeownerId: 'demo-homeowner-5',
    address: {
      street: '555 Broadway',
      city: 'New York',
      state: 'NY',
      zip: '10001',
    },
    urgency: 'normal',
    estimatedCost: { min: 300, max: 600 },
    laborHours: 3,
    createdAt: new Date(Date.now() - 432000000),
    updatedAt: new Date(Date.now() - 432000000),
    bids: [],
    messages: [],
    milestones: [],
  },
];

// Demo territories data
const demoTerritories: Territory[] = [
  {
    id: 'territory-ca-1',
    name: 'San Francisco Bay Area',
    stateCode: 'CA',
    zipCodes: ['94102', '94103', '94104', '94105', '94107'],
    monthlyPrice: 45,
    operatorRevenueShare: 15,
    approvedContractors: [],
    generalContractors: [],
    subcontractors: [],
    stats: {
      totalJobs: 234,
      monthlyJobVolume: 45,
      activeContractors: 12,
      averageRating: 4.7,
      totalRevenue: 125000,
      monthlyRevenue: 28000,
      operatorEarnings: 4200,
    },
    available: true,
  },
  {
    id: 'territory-tx-1',
    name: 'Austin Metro',
    stateCode: 'TX',
    zipCodes: ['78701', '78702', '78703', '78704', '78705'],
    monthlyPrice: 45,
    operatorRevenueShare: 15,
    approvedContractors: [],
    generalContractors: [],
    subcontractors: [],
    stats: {
      totalJobs: 189,
      monthlyJobVolume: 38,
      activeContractors: 9,
      averageRating: 4.6,
      totalRevenue: 98000,
      monthlyRevenue: 22000,
      operatorEarnings: 3300,
    },
    available: true,
  },
];

/**
 * Initialize demo data in the store
 */
export async function initializeDemoData(): Promise<void> {
  // Check if we already have data
  const existingJobs = await dataStore.getJobs();
  if (existingJobs.length > 0) {
    console.log('Demo data already exists');
    return;
  }

  console.log('Initializing demo data...');

  // Save demo jobs
  for (const job of demoJobs) {
    await dataStore.saveJob(job);
  }

  // Save demo territories
  for (const territory of demoTerritories) {
    await dataStore.saveTerritory(territory);
  }

  console.log('Demo data initialized successfully');
}

/**
 * Clear all demo data
 */
export async function clearDemoData(): Promise<void> {
  await dataStore.clearAll();
  console.log('Demo data cleared');
}
