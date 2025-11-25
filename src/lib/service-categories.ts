export interface ServiceCategory {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const SERVICE_CATEGORIES = {
  'Home Exterior': [
    { id: 'roofing', name: 'Roofing', category: 'Home Exterior' },
    { id: 'siding', name: 'Siding', category: 'Home Exterior' },
    { id: 'gutter', name: 'Gutter Installation & Repair', category: 'Home Exterior' },
    { id: 'window-install', name: 'Window Installation', category: 'Home Exterior' },
    { id: 'door-install', name: 'Door Installation', category: 'Home Exterior' },
    { id: 'deck-patio', name: 'Deck & Patio Construction', category: 'Home Exterior' },
    { id: 'fence', name: 'Fence Installation & Repair', category: 'Home Exterior' },
    { id: 'driveway', name: 'Driveway & Walkway', category: 'Home Exterior' },
    { id: 'exterior-paint', name: 'Exterior Painting', category: 'Home Exterior' },
    { id: 'power-wash', name: 'Power Washing', category: 'Home Exterior' },
  ],
  'Home Interior': [
    { id: 'interior-paint', name: 'Interior Painting', category: 'Home Interior' },
    { id: 'drywall', name: 'Drywall Repair', category: 'Home Interior' },
    { id: 'flooring', name: 'Flooring Installation (Hardwood, Tile, Carpet)', category: 'Home Interior' },
    { id: 'kitchen-remodel', name: 'Kitchen Remodeling', category: 'Home Interior' },
    { id: 'bathroom-remodel', name: 'Bathroom Remodeling', category: 'Home Interior' },
    { id: 'basement-finish', name: 'Basement Finishing', category: 'Home Interior' },
    { id: 'attic-conversion', name: 'Attic Conversion', category: 'Home Interior' },
    { id: 'closet-org', name: 'Closet Organization Systems', category: 'Home Interior' },
    { id: 'crown-molding', name: 'Crown Molding & Trim', category: 'Home Interior' },
    { id: 'cabinet', name: 'Cabinet Installation & Refacing', category: 'Home Interior' },
  ],
  'Plumbing': [
    { id: 'plumbing-repair', name: 'General Plumbing Repair', category: 'Plumbing' },
    { id: 'drain-clean', name: 'Drain Cleaning', category: 'Plumbing' },
    { id: 'water-heater', name: 'Water Heater Installation', category: 'Plumbing' },
    { id: 'sewer-line', name: 'Sewer Line Repair', category: 'Plumbing' },
    { id: 'pipe-replace', name: 'Pipe Replacement', category: 'Plumbing' },
    { id: 'fixture-install', name: 'Fixture Installation (Sinks, Toilets, Faucets)', category: 'Plumbing' },
    { id: 'gas-line', name: 'Gas Line Installation', category: 'Plumbing' },
    { id: 'backflow', name: 'Backflow Prevention', category: 'Plumbing' },
  ],
  'Electrical': [
    { id: 'electrical-repair', name: 'General Electrical Repair', category: 'Electrical' },
    { id: 'panel-upgrade', name: 'Panel Upgrades', category: 'Electrical' },
    { id: 'lighting', name: 'Lighting Installation', category: 'Electrical' },
    { id: 'ceiling-fan', name: 'Ceiling Fan Installation', category: 'Electrical' },
    { id: 'outlet-switch', name: 'Outlet & Switch Installation', category: 'Electrical' },
    { id: 'generator', name: 'Generator Installation', category: 'Electrical' },
    { id: 'ev-charger', name: 'EV Charger Installation', category: 'Electrical' },
    { id: 'smart-home', name: 'Smart Home Wiring', category: 'Electrical' },
  ],
  'HVAC': [
    { id: 'hvac-install', name: 'HVAC Installation', category: 'HVAC' },
    { id: 'hvac-repair', name: 'HVAC Repair', category: 'HVAC' },
    { id: 'ac-maintenance', name: 'AC Maintenance', category: 'HVAC' },
    { id: 'furnace-repair', name: 'Furnace Repair', category: 'HVAC' },
    { id: 'duct-clean', name: 'Duct Cleaning', category: 'HVAC' },
    { id: 'thermostat', name: 'Thermostat Installation', category: 'HVAC' },
  ],
  'Foundation & Structural': [
    { id: 'foundation-repair', name: 'Foundation Repair', category: 'Foundation & Structural' },
    { id: 'basement-waterproof', name: 'Basement Waterproofing', category: 'Foundation & Structural' },
    { id: 'crack-repair', name: 'Crack Repair', category: 'Foundation & Structural' },
    { id: 'structural-eng', name: 'Structural Engineering', category: 'Foundation & Structural' },
    { id: 'crawl-space', name: 'Crawl Space Encapsulation', category: 'Foundation & Structural' },
  ],
  'Specialty Services': [
    { id: 'mold-remediation', name: 'Mold Remediation', category: 'Specialty Services' },
    { id: 'pest-control', name: 'Pest Control', category: 'Specialty Services' },
    { id: 'insulation', name: 'Insulation Installation', category: 'Specialty Services' },
    { id: 'chimney', name: 'Chimney Repair & Cleaning', category: 'Specialty Services' },
    { id: 'septic', name: 'Septic System Repair', category: 'Specialty Services' },
    { id: 'well', name: 'Well Installation & Repair', category: 'Specialty Services' },
    { id: 'pool', name: 'Pool Installation & Repair', category: 'Specialty Services' },
    { id: 'hot-tub', name: 'Hot Tub Installation', category: 'Specialty Services' },
    { id: 'home-automation', name: 'Home Automation & Security', category: 'Specialty Services' },
    { id: 'solar', name: 'Solar Panel Installation', category: 'Specialty Services' },
    { id: 'radon', name: 'Radon Mitigation', category: 'Specialty Services' },
    { id: 'asbestos', name: 'Asbestos Removal', category: 'Specialty Services' },
    { id: 'lead-paint', name: 'Lead Paint Removal', category: 'Specialty Services' },
  ],
};

export const ALL_SERVICES: ServiceCategory[] = Object.values(SERVICE_CATEGORIES).flat();

export const SERVICE_CATEGORY_NAMES = Object.keys(SERVICE_CATEGORIES);

export function getServicesByCategory(category: string): ServiceCategory[] {
  return SERVICE_CATEGORIES[category as keyof typeof SERVICE_CATEGORIES] || [];
}

export function getServiceById(id: string): ServiceCategory | undefined {
  return ALL_SERVICES.find(service => service.id === id);
}
