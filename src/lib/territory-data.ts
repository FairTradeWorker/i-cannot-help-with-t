export interface TerritoryZip {
  zip: string;
  city: string;
  state: string;
  county: string;
  latitude: number;
  longitude: number;
  population: number;
  medianIncome: number;
  timezone: string;
  countyFIPS: string;
  available: boolean;
  monthlyPrice: number;
}

export const territoryZips: TerritoryZip[] = [
  { zip: '78701', city: 'Austin', state: 'TX', county: 'Travis', latitude: 30.2711, longitude: -97.7437, population: 12000, medianIncome: 85000, timezone: 'America/Chicago', countyFIPS: '48453', available: true, monthlyPrice: 45 },
  { zip: '78704', city: 'Austin', state: 'TX', county: 'Travis', latitude: 30.2486, longitude: -97.7789, population: 35000, medianIncome: 95000, timezone: 'America/Chicago', countyFIPS: '48453', available: true, monthlyPrice: 45 },
  { zip: '78759', city: 'Austin', state: 'TX', county: 'Travis', latitude: 30.3965, longitude: -97.7601, population: 28000, medianIncome: 110000, timezone: 'America/Chicago', countyFIPS: '48453', available: true, monthlyPrice: 45 },
  { zip: '78702', city: 'Austin', state: 'TX', county: 'Travis', latitude: 30.2630, longitude: -97.7156, population: 22000, medianIncome: 78000, timezone: 'America/Chicago', countyFIPS: '48453', available: true, monthlyPrice: 45 },
  { zip: '78703', city: 'Austin', state: 'TX', county: 'Travis', latitude: 30.2970, longitude: -97.7638, population: 18000, medianIncome: 125000, timezone: 'America/Chicago', countyFIPS: '48453', available: true, monthlyPrice: 45 },
  
  { zip: '85001', city: 'Phoenix', state: 'AZ', county: 'Maricopa', latitude: 33.4484, longitude: -112.0740, population: 5000, medianIncome: 42000, timezone: 'America/Phoenix', countyFIPS: '04013', available: true, monthlyPrice: 45 },
  { zip: '85004', city: 'Phoenix', state: 'AZ', county: 'Maricopa', latitude: 33.4509, longitude: -112.0712, population: 8000, medianIncome: 55000, timezone: 'America/Phoenix', countyFIPS: '04013', available: true, monthlyPrice: 45 },
  { zip: '85012', city: 'Phoenix', state: 'AZ', county: 'Maricopa', latitude: 33.5013, longitude: -112.0673, population: 25000, medianIncome: 82000, timezone: 'America/Phoenix', countyFIPS: '04013', available: true, monthlyPrice: 45 },
  { zip: '85016', city: 'Phoenix', state: 'AZ', county: 'Maricopa', latitude: 33.5056, longitude: -112.0498, population: 32000, medianIncome: 95000, timezone: 'America/Phoenix', countyFIPS: '04013', available: true, monthlyPrice: 45 },
  { zip: '85018', city: 'Phoenix', state: 'AZ', county: 'Maricopa', latitude: 33.4948, longitude: -111.9937, population: 42000, medianIncome: 87000, timezone: 'America/Phoenix', countyFIPS: '04013', available: true, monthlyPrice: 45 },
  
  { zip: '75201', city: 'Dallas', state: 'TX', county: 'Dallas', latitude: 32.7840, longitude: -96.7973, population: 8000, medianIncome: 65000, timezone: 'America/Chicago', countyFIPS: '48113', available: true, monthlyPrice: 45 },
  { zip: '75204', city: 'Dallas', state: 'TX', county: 'Dallas', latitude: 32.8020, longitude: -96.7908, population: 15000, medianIncome: 95000, timezone: 'America/Chicago', countyFIPS: '48113', available: true, monthlyPrice: 45 },
  { zip: '75205', city: 'Dallas', state: 'TX', county: 'Dallas', latitude: 32.8203, longitude: -96.8011, population: 18000, medianIncome: 115000, timezone: 'America/Chicago', countyFIPS: '48113', available: true, monthlyPrice: 45 },
  { zip: '75206', city: 'Dallas', state: 'TX', county: 'Dallas', latitude: 32.8312, longitude: -96.7750, population: 22000, medianIncome: 88000, timezone: 'America/Chicago', countyFIPS: '48113', available: true, monthlyPrice: 45 },
  { zip: '75209', city: 'Dallas', state: 'TX', county: 'Dallas', latitude: 32.8429, longitude: -96.8217, population: 25000, medianIncome: 105000, timezone: 'America/Chicago', countyFIPS: '48113', available: true, monthlyPrice: 45 },
  
  { zip: '30301', city: 'Atlanta', state: 'GA', county: 'Fulton', latitude: 33.7490, longitude: -84.3880, population: 5000, medianIncome: 48000, timezone: 'America/New_York', countyFIPS: '13121', available: true, monthlyPrice: 45 },
  { zip: '30303', city: 'Atlanta', state: 'GA', county: 'Fulton', latitude: 33.7517, longitude: -84.3901, population: 12000, medianIncome: 62000, timezone: 'America/New_York', countyFIPS: '13121', available: true, monthlyPrice: 45 },
  { zip: '30305', city: 'Atlanta', state: 'GA', county: 'Fulton', latitude: 33.8415, longitude: -84.3849, population: 28000, medianIncome: 98000, timezone: 'America/New_York', countyFIPS: '13121', available: true, monthlyPrice: 45 },
  { zip: '30306', city: 'Atlanta', state: 'GA', county: 'Fulton', latitude: 33.7862, longitude: -84.3527, population: 32000, medianIncome: 105000, timezone: 'America/New_York', countyFIPS: '13121', available: true, monthlyPrice: 45 },
  { zip: '30309', city: 'Atlanta', state: 'GA', county: 'Fulton', latitude: 33.7838, longitude: -84.3835, population: 18000, medianIncome: 92000, timezone: 'America/New_York', countyFIPS: '13121', available: true, monthlyPrice: 45 },
  
  { zip: '80202', city: 'Denver', state: 'CO', county: 'Denver', latitude: 39.7508, longitude: -104.9914, population: 8000, medianIncome: 72000, timezone: 'America/Denver', countyFIPS: '08031', available: true, monthlyPrice: 45 },
  { zip: '80203', city: 'Denver', state: 'CO', county: 'Denver', latitude: 39.7323, longitude: -104.9789, population: 15000, medianIncome: 85000, timezone: 'America/Denver', countyFIPS: '08031', available: true, monthlyPrice: 45 },
  { zip: '80204', city: 'Denver', state: 'CO', county: 'Denver', latitude: 39.7402, longitude: -105.0011, population: 12000, medianIncome: 68000, timezone: 'America/Denver', countyFIPS: '08031', available: true, monthlyPrice: 45 },
  { zip: '80206', city: 'Denver', state: 'CO', county: 'Denver', latitude: 39.7290, longitude: -104.9543, population: 22000, medianIncome: 95000, timezone: 'America/Denver', countyFIPS: '08031', available: true, monthlyPrice: 45 },
  { zip: '80209', city: 'Denver', state: 'CO', county: 'Denver', latitude: 39.7089, longitude: -104.9637, population: 28000, medianIncome: 102000, timezone: 'America/Denver', countyFIPS: '08031', available: true, monthlyPrice: 45 },
  
  { zip: '37201', city: 'Nashville', state: 'TN', county: 'Davidson', latitude: 36.1627, longitude: -86.7816, population: 8000, medianIncome: 58000, timezone: 'America/Chicago', countyFIPS: '47037', available: true, monthlyPrice: 45 },
  { zip: '37203', city: 'Nashville', state: 'TN', county: 'Davidson', latitude: 36.1409, longitude: -86.7892, population: 15000, medianIncome: 75000, timezone: 'America/Chicago', countyFIPS: '47037', available: true, monthlyPrice: 45 },
  { zip: '37204', city: 'Nashville', state: 'TN', county: 'Davidson', latitude: 36.1138, longitude: -86.7658, population: 22000, medianIncome: 68000, timezone: 'America/Chicago', countyFIPS: '47037', available: true, monthlyPrice: 45 },
  { zip: '37205', city: 'Nashville', state: 'TN', county: 'Davidson', latitude: 36.1046, longitude: -86.8439, population: 28000, medianIncome: 98000, timezone: 'America/Chicago', countyFIPS: '47037', available: true, monthlyPrice: 45 },
  { zip: '37206', city: 'Nashville', state: 'TN', county: 'Davidson', latitude: 36.1803, longitude: -86.7385, population: 25000, medianIncome: 72000, timezone: 'America/Chicago', countyFIPS: '47037', available: true, monthlyPrice: 45 },
  
  { zip: '10002', city: 'New York', state: 'NY', county: 'Manhattan', latitude: 40.7150, longitude: -73.9352, population: 85000, medianIncome: 75000, timezone: 'America/New_York', countyFIPS: '36061', available: false, monthlyPrice: 45 },
  { zip: '90210', city: 'Beverly Hills', state: 'CA', county: 'Los Angeles', latitude: 34.0995, longitude: -118.4064, population: 32000, medianIncome: 125000, timezone: 'America/Los_Angeles', countyFIPS: '06037', available: false, monthlyPrice: 45 },
  { zip: '33139', city: 'Miami Beach', state: 'FL', county: 'Miami-Dade', latitude: 25.7907, longitude: -80.1300, population: 45000, medianIncome: 65000, timezone: 'America/New_York', countyFIPS: '12086', available: false, monthlyPrice: 45 },
];

export function getTerritoryByZip(zip: string): TerritoryZip | undefined {
  return territoryZips.find(t => t.zip === zip);
}

export function getAvailableTerritories(): TerritoryZip[] {
  return territoryZips.filter(t => t.available);
}

export function getTerritoriesByState(state: string): TerritoryZip[] {
  return territoryZips.filter(t => t.state === state);
}
