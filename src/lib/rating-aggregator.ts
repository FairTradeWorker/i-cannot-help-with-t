import type { Rating, ContractorRating } from '@/lib/types';
import { SERVICE_CATEGORIES, getCategoryById } from '@/types/service-categories';

/**
 * Aggregate contractor ratings by service category
 */
export function aggregateContractorRatings(
  contractorId: string,
  ratings: Rating[]
): ContractorRating {
  // Filter ratings for this contractor
  const contractorRatings = ratings.filter(r => r.contractorId === contractorId);

  if (contractorRatings.length === 0) {
    return {
      overallRating: 0,
      categoryRatings: []
    };
  }

  // Calculate overall rating
  const overallRating = contractorRatings.reduce((sum, r) => sum + r.overallScore, 0) / contractorRatings.length;

  // Group ratings by service category
  const categoryMap = new Map<string, {
    ratings: Rating[];
    categoryId: string;
    categoryName: string;
  }>();

  contractorRatings.forEach(rating => {
    const categoryId = rating.serviceCategory || 'unknown';
    const category = getCategoryById(categoryId);
    
    if (!categoryMap.has(categoryId)) {
      categoryMap.set(categoryId, {
        ratings: [],
        categoryId,
        categoryName: category?.title || 'Unknown Category'
      });
    }

    categoryMap.get(categoryId)!.ratings.push(rating);
  });

  // Calculate category ratings
  const categoryRatings = Array.from(categoryMap.values()).map(({ ratings: catRatings, categoryId, categoryName }) => {
    const jobsCompleted = catRatings.length;
    
    // Calculate average rating
    const rating = catRatings.reduce((sum, r) => sum + r.overallScore, 0) / jobsCompleted;

    // Calculate dimension averages
    const dimensions = {
      quality: catRatings.reduce((sum, r) => sum + r.quality, 0) / jobsCompleted,
      timeliness: catRatings.reduce((sum, r) => sum + r.timeliness, 0) / jobsCompleted,
      communication: catRatings.reduce((sum, r) => sum + r.communication, 0) / jobsCompleted,
      pricing: catRatings.reduce((sum, r) => {
        // Pricing is derived from value perception (inverse of cost complaints)
        // For now, use quality as proxy
        return sum + r.quality;
      }, 0) / jobsCompleted,
      professionalism: catRatings.reduce((sum, r) => sum + r.professionalism, 0) / jobsCompleted
    };

    return {
      categoryId,
      categoryName,
      rating: Math.round(rating),
      jobsCompleted,
      dimensions: {
        quality: Math.round(dimensions.quality),
        timeliness: Math.round(dimensions.timeliness),
        communication: Math.round(dimensions.communication),
        pricing: Math.round(dimensions.pricing),
        professionalism: Math.round(dimensions.professionalism)
      }
    };
  });

  return {
    overallRating: Math.round(overallRating),
    categoryRatings
  };
}

/**
 * Get category-specific rating for a contractor
 */
export function getCategoryRating(
  contractorRatings: ContractorRating,
  categoryId: string
): number {
  const categoryRating = contractorRatings.categoryRatings.find(cr => cr.categoryId === categoryId);
  return categoryRating?.rating || 0;
}

