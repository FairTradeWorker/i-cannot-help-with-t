export interface ServiceSubcategory {
  id: string;
  title: string;
  services: string[];
  requiredLicenses: string[];
  avgJobValue: number;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSelection {
  service: string;
  category: string;
  subcategory: string;
  categoryId: string;
  subcategoryId: string;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'interior-finishing',
    title: 'Interior & Finishing',
    icon: 'House',
    description: 'Everything inside the four walls (non-utility)',
    subcategories: [
      {
        id: 'walls-ceilings',
        title: 'Walls & Ceilings',
        services: ['Drywall', 'Painting', 'Wallpaper', 'Popcorn Removal', 'Soundproofing', 'Insulation'],
        requiredLicenses: ['General Contractor', 'Handyman'],
        avgJobValue: 2500
      },
      {
        id: 'flooring',
        title: 'Flooring',
        services: ['Hardwood Refinishing', 'Hardwood Install', 'Carpet Clean', 'Carpet Install', 'Tile', 'Laminate', 'Epoxy'],
        requiredLicenses: ['General Contractor', 'Flooring Specialist'],
        avgJobValue: 4500
      },
      {
        id: 'furniture-decor',
        title: 'Furniture & Decor',
        services: ['Assembly', 'Upholstery', 'Window Treatments', 'Interior Design', 'Home Staging'],
        requiredLicenses: ['General Contractor'],
        avgJobValue: 1200
      },
      {
        id: 'storage',
        title: 'Storage',
        services: ['Closet Systems', 'Cabinet Refacing', 'Shelving Installation'],
        requiredLicenses: ['General Contractor', 'Carpenter'],
        avgJobValue: 1800
      }
    ]
  },
  {
    id: 'kitchen-bath-plumbing',
    title: 'Kitchen, Bath & Plumbing',
    icon: 'Wrench',
    description: 'The "Wet" rooms and systems',
    subcategories: [
      {
        id: 'plumbing',
        title: 'Plumbing',
        services: ['Leaks', 'Drains', 'Toilets', 'Faucets', 'Water Heaters', 'Sump Pumps', 'Septic'],
        requiredLicenses: ['Licensed Plumber', 'Master Plumber'],
        avgJobValue: 850
      },
      {
        id: 'kitchen-projects',
        title: 'Kitchen Projects',
        services: ['Cabinets', 'Granite Countertops', 'Quartz Countertops', 'Backsplash', 'Appliance Install'],
        requiredLicenses: ['General Contractor', 'Kitchen Specialist'],
        avgJobValue: 8500
      },
      {
        id: 'bathroom-projects',
        title: 'Bathroom Projects',
        services: ['Shower Install', 'Tub Install', 'Tile Regrouting', 'Vanity Install', 'Accessibility Mods'],
        requiredLicenses: ['General Contractor', 'Plumber'],
        avgJobValue: 5200
      },
      {
        id: 'appliances',
        title: 'Appliances',
        services: ['Fridge Repair', 'Oven Repair', 'Dishwasher Repair', 'Installation', 'Dryer Vent Cleaning'],
        requiredLicenses: ['Appliance Repair', 'General Contractor'],
        avgJobValue: 350
      }
    ]
  },
  {
    id: 'electrical-hvac-tech',
    title: 'Electrical, HVAC & Tech',
    icon: 'Lightning',
    description: 'Power, Air, and Smarts',
    subcategories: [
      {
        id: 'electrical',
        title: 'Electrical',
        services: ['Wiring', 'Outlets', 'Panels', 'Generators', 'Ceiling Fans', 'Lighting Install'],
        requiredLicenses: ['Licensed Electrician', 'Master Electrician'],
        avgJobValue: 1200
      },
      {
        id: 'heating-cooling',
        title: 'Heating & Cooling',
        services: ['AC Repair', 'AC Install', 'Furnace', 'Duct Cleaning', 'Thermostats', 'Fireplaces'],
        requiredLicenses: ['HVAC License', 'EPA Certified'],
        avgJobValue: 3500
      },
      {
        id: 'smart-home',
        title: 'Smart Home',
        services: ['Security Cameras', 'TV Mounting', 'Home Theater', 'Smart Locks', 'Wifi Setup'],
        requiredLicenses: ['Low Voltage License', 'General Contractor'],
        avgJobValue: 800
      }
    ]
  },
  {
    id: 'exterior-garden',
    title: 'Exterior & Garden',
    icon: 'Tree',
    description: 'Curb appeal and yard work',
    subcategories: [
      {
        id: 'lawn-care',
        title: 'Lawn Care',
        services: ['Mowing', 'Fertilizing', 'Sod', 'Artificial Turf', 'Leaf Removal', 'Snow Removal'],
        requiredLicenses: ['Landscaping License', 'Pesticide Applicator'],
        avgJobValue: 450
      },
      {
        id: 'landscaping',
        title: 'Landscaping',
        services: ['Tree Trimming', 'Stump Removal', 'Sprinklers', 'Outdoor Lighting', 'Hardscaping'],
        requiredLicenses: ['Landscaping License', 'Arborist'],
        avgJobValue: 2800
      },
      {
        id: 'structures',
        title: 'Structures',
        services: ['Decks', 'Porches', 'Fences', 'Gates', 'Patios', 'Gazebos', 'Sheds'],
        requiredLicenses: ['General Contractor', 'Carpenter'],
        avgJobValue: 6500
      },
      {
        id: 'pool-spa',
        title: 'Pool & Spa',
        services: ['Pool Cleaning', 'Hot Tub Repair', 'Opening Services', 'Closing Services'],
        requiredLicenses: ['Pool Service License'],
        avgJobValue: 650
      }
    ]
  },
  {
    id: 'construction-heavy',
    title: 'Construction & Heavy Lifting',
    icon: 'Hammer',
    description: 'Major structural work and renovations',
    subcategories: [
      {
        id: 'exterior-shell',
        title: 'Exterior Shell',
        services: ['Roofing', 'Siding', 'Gutters', 'Windows', 'Doors', 'Garage Doors'],
        requiredLicenses: ['General Contractor', 'Roofing License'],
        avgJobValue: 12500
      },
      {
        id: 'masonry',
        title: 'Masonry',
        services: ['Brick', 'Stone', 'Concrete Driveways', 'Concrete Walkways', 'Foundation Repair', 'Stucco'],
        requiredLicenses: ['General Contractor', 'Masonry License'],
        avgJobValue: 8200
      },
      {
        id: 'major-reno',
        title: 'Major Reno',
        services: ['Additions', 'Basement Finishing', 'Demolition', 'Excavation', 'New Home Build'],
        requiredLicenses: ['General Contractor', 'Builder License'],
        avgJobValue: 45000
      },
      {
        id: 'general',
        title: 'General',
        services: ['Handyman Services', 'Carpentry Framing', 'Carpentry Trim', 'Exterior Painting'],
        requiredLicenses: ['General Contractor', 'Handyman'],
        avgJobValue: 950
      }
    ]
  },
  {
    id: 'cleaning-lifestyle',
    title: 'Cleaning & Lifestyle',
    icon: 'Broom',
    description: 'Maintenance and daily tasks',
    subcategories: [
      {
        id: 'cleaning',
        title: 'Cleaning',
        services: ['House Cleaning', 'Deep Clean', 'Move-in Clean', 'Move-out Clean', 'Pressure Washing', 'Window Washing'],
        requiredLicenses: ['Business License'],
        avgJobValue: 280
      },
      {
        id: 'specialty-cleaning',
        title: 'Specialty Cleaning',
        services: ['Carpet Cleaning', 'Air Ducts', 'Chimney Sweep', 'Mold Removal', 'Water Damage'],
        requiredLicenses: ['Mold Remediation', 'Chimney Sweep'],
        avgJobValue: 650
      },
      {
        id: 'pests',
        title: 'Pests',
        services: ['Pest Control', 'Termites', 'Bed Bugs', 'Rodent Removal', 'Wildlife Control'],
        requiredLicenses: ['Pest Control License', 'Pesticide Applicator'],
        avgJobValue: 450
      },
      {
        id: 'misc-services',
        title: 'Misc Services',
        services: ['Junk Removal', 'Moving Help', 'Packing', 'Unpacking', 'Asbestos Removal'],
        requiredLicenses: ['Business License', 'Asbestos Abatement'],
        avgJobValue: 550
      }
    ]
  }
];

// Helper functions
export function getCategoryById(id: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(cat => cat.id === id);
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): ServiceSubcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
}

export function getServiceInfo(service: string): {
  category: ServiceCategory;
  subcategory: ServiceSubcategory;
  serviceName: string;
} | null {
  for (const category of SERVICE_CATEGORIES) {
    for (const subcategory of category.subcategories) {
      if (subcategory.services.includes(service)) {
        return {
          category,
          subcategory,
          serviceName: service
        };
      }
    }
  }
  return null;
}

export function getAllServices(): string[] {
  const services: string[] = [];
  SERVICE_CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcategory => {
      services.push(...subcategory.services);
    });
  });
  return services;
}

export function getRequiredLicensesForService(service: string): string[] {
  const info = getServiceInfo(service);
  return info?.subcategory.requiredLicenses || [];
}

