import type { User, Job, ContractorProfile } from '@/lib/types';
import type { ServiceSelection } from '@/types/service-categories';
import { getServiceInfo, getRequiredLicensesForService } from '@/types/service-categories';

export interface ContractorMatch {
  contractor: User;
  matchScore: number;
  matchBreakdown: {
    exactServiceMatch: number;
    subcategoryMatch: number;
    categoryMatch: number;
    licenseMatch: number;
    experienceScore: number;
    portfolioScore: number;
    ratingScore: number;
    distanceScore: number;
    territoryScore: number;
  };
  reasons: string[];
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if contractor has required license for service
 */
function hasRequiredLicense(
  contractor: User,
  service: string
): boolean {
  if (!contractor.contractorProfile?.licenses) return false;

  const requiredLicenses = getRequiredLicensesForService(service);
  const contractorLicenses = contractor.contractorProfile.licenses.map(
    (l) => l.type
  );

  return requiredLicenses.some((required) =>
    contractorLicenses.some(
      (contractorLicense) =>
        contractorLicense.toLowerCase().includes(required.toLowerCase()) ||
        required.toLowerCase().includes(contractorLicense.toLowerCase())
    )
  );
}

/**
 * Get years of experience for a specific service
 */
function getServiceExperience(
  contractor: User,
  service: string,
  categoryId: string,
  subcategoryId: string
): number {
  if (!contractor.contractorProfile?.serviceSpecialties) return 0;

  const specialty = contractor.contractorProfile.serviceSpecialties.find(
    (s) =>
      s.categoryId === categoryId &&
      s.subcategoryId === subcategoryId &&
      s.services.includes(service)
  );

  return specialty?.yearsExperience || 0;
}

/**
 * Check if contractor has portfolio items for service category
 */
function getPortfolioScore(
  contractor: User,
  categoryId: string,
  subcategoryId: string
): number {
  if (!contractor.contractorProfile?.portfolio) return 0;

  const portfolioItems = contractor.contractorProfile.portfolio.filter(
    (p) => p.serviceCategory === categoryId && p.subcategory === subcategoryId
  );

  // Score based on number of portfolio items (max 10 items = 100 points)
  return Math.min(portfolioItems.length * 10, 100);
}

/**
 * Get category-specific rating for contractor
 */
function getCategoryRating(
  contractor: User,
  categoryId: string
): number {
  // This would typically come from aggregated ratings
  // For now, use overall rating as fallback
  return contractor.contractorProfile?.rating || 0;
}

/**
 * Match contractors to a job based on service selection
 */
export function matchContractorsToJob(
  contractors: User[],
  job: Job,
  serviceSelection: ServiceSelection
): ContractorMatch[] {
  const jobLocation = job.address;
  if (!jobLocation.lat || !jobLocation.lng) {
    return [];
  }

  const matches: ContractorMatch[] = [];

  for (const contractor of contractors) {
    if (!contractor.contractorProfile) continue;

    const profile = contractor.contractorProfile;
    const contractorLocation = profile.location;

    // Calculate distance
    const distance = calculateDistance(
      jobLocation.lat!,
      jobLocation.lng!,
      contractorLocation.lat,
      contractorLocation.lng
    );

    // Skip if outside service radius
    if (distance > profile.serviceRadius) continue;

    // Calculate match scores
    const breakdown = {
      exactServiceMatch: 0,
      subcategoryMatch: 0,
      categoryMatch: 0,
      licenseMatch: 0,
      experienceScore: 0,
      portfolioScore: 0,
      ratingScore: 0,
      distanceScore: 0,
      territoryScore: 0,
    };

    const reasons: string[] = [];

    // 1. Exact service match (highest priority - 40 points)
    if (profile.serviceSpecialties) {
      const hasExactService = profile.serviceSpecialties.some(
        (s) =>
          s.categoryId === serviceSelection.categoryId &&
          s.subcategoryId === serviceSelection.subcategoryId &&
          s.services.includes(serviceSelection.service)
      );

      if (hasExactService) {
        breakdown.exactServiceMatch = 40;
        reasons.push('Exact service match');
      }
    }

    // 2. Subcategory match (medium priority - 20 points)
    if (breakdown.exactServiceMatch === 0) {
      const hasSubcategory = profile.serviceSpecialties?.some(
        (s) =>
          s.categoryId === serviceSelection.categoryId &&
          s.subcategoryId === serviceSelection.subcategoryId
      );

      if (hasSubcategory) {
        breakdown.subcategoryMatch = 20;
        reasons.push('Subcategory match');
      }
    }

    // 3. Category match (low priority - 10 points)
    if (breakdown.exactServiceMatch === 0 && breakdown.subcategoryMatch === 0) {
      const hasCategory = profile.serviceSpecialties?.some(
        (s) => s.categoryId === serviceSelection.categoryId
      );

      if (hasCategory) {
        breakdown.categoryMatch = 10;
        reasons.push('Category match');
      }
    }

    // 4. License validation (15 points)
    if (hasRequiredLicense(contractor, serviceSelection.service)) {
      breakdown.licenseMatch = 15;
      reasons.push('Has required license');
    }

    // 5. Years of experience (15 points max)
    const experience = getServiceExperience(
      contractor,
      serviceSelection.service,
      serviceSelection.categoryId,
      serviceSelection.subcategoryId
    );
    breakdown.experienceScore = Math.min(experience * 3, 15); // 5 years = 15 points
    if (experience > 0) {
      reasons.push(`${experience} years experience`);
    }

    // 6. Portfolio items (10 points max)
    breakdown.portfolioScore = getPortfolioScore(
      contractor,
      serviceSelection.categoryId,
      serviceSelection.subcategoryId
    );
    if (breakdown.portfolioScore > 0) {
      reasons.push('Has portfolio items');
    }

    // 7. Rating in similar jobs (10 points)
    const categoryRating = getCategoryRating(
      contractor,
      serviceSelection.categoryId
    );
    breakdown.ratingScore = (categoryRating / 100) * 10;
    if (categoryRating >= 90) {
      reasons.push('High rating in this category');
    }

    // 8. Distance from job site (10 points max, closer = higher)
    const maxDistance = 50; // miles
    breakdown.distanceScore = Math.max(0, 10 - (distance / maxDistance) * 10);
    if (distance < 10) {
      reasons.push('Very close to job site');
    }

    // 9. Territory ownership (5 points)
    if (profile.territoryId) {
      breakdown.territoryScore = 5;
      reasons.push('Territory owner');
    }

    // Calculate total match score
    const matchScore =
      breakdown.exactServiceMatch +
      breakdown.subcategoryMatch +
      breakdown.categoryMatch +
      breakdown.licenseMatch +
      breakdown.experienceScore +
      breakdown.portfolioScore +
      breakdown.ratingScore +
      breakdown.distanceScore +
      breakdown.territoryScore;

    matches.push({
      contractor,
      matchScore,
      matchBreakdown: breakdown,
      reasons,
    });
  }

  // Sort by match score (descending)
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}

/**
 * Get "Best Match" badge threshold
 */
export function isBestMatch(match: ContractorMatch): boolean {
  return (
    match.matchBreakdown.exactServiceMatch > 0 &&
    match.matchBreakdown.licenseMatch > 0 &&
    match.matchBreakdown.experienceScore >= 9 &&
    match.matchScore >= 70
  );
}

