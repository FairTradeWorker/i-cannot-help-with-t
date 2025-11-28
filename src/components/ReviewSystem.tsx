// Review and Rating System - Leave and view detailed reviews
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  ChatCircle,
  Camera,
  User,
  CheckCircle,
  Flag,
  ArrowRight,
  SortAscending,
  FunnelSimple,
} from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  jobTitle: string;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  response?: {
    content: string;
    date: Date;
  };
  photos?: string[];
  categories: {
    quality: number;
    communication: number;
    timeliness: number;
    value: number;
  };
}

// Sample reviews
const sampleReviews: Review[] = [
  {
    id: 'r1',
    reviewerName: 'Sarah M.',
    rating: 98,
    title: 'Exceptional roof repair work!',
    content: 'Mike and his team did an amazing job on our roof repair. They arrived on time, were professional throughout, and the work quality exceeded our expectations. Would definitely recommend!',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    jobTitle: 'Complete Roof Repair',
    verified: true,
    helpful: 24,
    notHelpful: 1,
    categories: { quality: 100, communication: 98, timeliness: 95, value: 96 },
    response: {
      content: 'Thank you so much for the kind words, Sarah! It was a pleasure working with you. We take pride in every project and are glad you\'re satisfied with the results.',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  },
  {
    id: 'r2',
    reviewerName: 'John D.',
    rating: 92,
    title: 'Great communication and fair pricing',
    content: 'Had my HVAC system replaced and the whole process was smooth. Got detailed quotes, regular updates, and the installation was done quickly. Minor cleanup issues but overall very satisfied.',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    jobTitle: 'HVAC System Replacement',
    verified: true,
    helpful: 18,
    notHelpful: 2,
    categories: { quality: 94, communication: 96, timeliness: 90, value: 88 },
  },
  {
    id: 'r3',
    reviewerName: 'Emily R.',
    rating: 100,
    title: 'Perfect kitchen remodel!',
    content: 'Absolutely thrilled with our new kitchen! The team was meticulous about every detail. They listened to all our requests and even suggested improvements we hadn\'t thought of. Worth every penny.',
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    jobTitle: 'Kitchen Renovation',
    verified: true,
    helpful: 31,
    notHelpful: 0,
    categories: { quality: 100, communication: 100, timeliness: 100, value: 100 },
  },
  {
    id: 'r4',
    reviewerName: 'Robert K.',
    rating: 78,
    title: 'Good work, but took longer than expected',
    content: 'The plumbing work itself was high quality, but the project took about a week longer than the initial estimate. Communication could have been better regarding the delays.',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    jobTitle: 'Bathroom Plumbing Overhaul',
    verified: true,
    helpful: 12,
    notHelpful: 3,
    categories: { quality: 88, communication: 70, timeliness: 65, value: 80 },
  },
];

interface ReviewSystemProps {
  contractorId?: string;
  contractorName?: string;
  onSubmitReview?: (review: Partial<Review>) => void;
}

export function ReviewSystem({ 
  contractorId, 
  contractorName = 'Mike Johnson',
  onSubmitReview 
}: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState('all');
  
  // Review form state
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({
    quality: 0,
    communication: 0,
    timeliness: 0,
    value: 0,
  });

  // Calculate stats
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => Math.floor(r.rating / 20) === stars).length,
    percentage: (reviews.filter(r => Math.floor(r.rating / 20) === stars).length / reviews.length) * 100,
  }));

  const avgCategories = {
    quality: reviews.reduce((sum, r) => sum + r.categories.quality, 0) / reviews.length,
    communication: reviews.reduce((sum, r) => sum + r.categories.communication, 0) / reviews.length,
    timeliness: reviews.reduce((sum, r) => sum + r.categories.timeliness, 0) / reviews.length,
    value: reviews.reduce((sum, r) => sum + r.categories.value, 0) / reviews.length,
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter(r => filterRating === 'all' || Math.floor(r.rating / 20) === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === 'recent') return b.date.getTime() - a.date.getTime();
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      if (sortBy === 'helpful') return b.helpful - a.helpful;
      return 0;
    });

  const handleSubmitReview = () => {
    if (newRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!reviewContent.trim()) {
      toast.error('Please write a review');
      return;
    }

    const review: Review = {
      id: `r-${Date.now()}`,
      reviewerName: 'You',
      rating: newRating * 20,
      title: reviewTitle || 'Great experience!',
      content: reviewContent,
      date: new Date(),
      jobTitle: 'Recent Project',
      verified: false,
      helpful: 0,
      notHelpful: 0,
      categories: categoryRatings.quality > 0 ? {
        quality: categoryRatings.quality * 20,
        communication: categoryRatings.communication * 20,
        timeliness: categoryRatings.timeliness * 20,
        value: categoryRatings.value * 20,
      } : { quality: newRating * 20, communication: newRating * 20, timeliness: newRating * 20, value: newRating * 20 },
    };

    setReviews([review, ...reviews]);
    setShowWriteReview(false);
    setNewRating(0);
    setReviewTitle('');
    setReviewContent('');
    setCategoryRatings({ quality: 0, communication: 0, timeliness: 0, value: 0 });
    toast.success('Review submitted successfully!');
  };

  const handleHelpful = (reviewId: string, helpful: boolean) => {
    setReviews(reviews.map(r => {
      if (r.id === reviewId) {
        return {
          ...r,
          helpful: helpful ? r.helpful + 1 : r.helpful,
          notHelpful: !helpful ? r.notHelpful + 1 : r.notHelpful,
        };
      }
      return r;
    }));
    toast.success('Thanks for your feedback!');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void): React.ReactElement => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = interactive ? i <= (hoverRating || rating) : i <= rating / 20;
      stars.push(
        <Star
          key={i}
          className={`w-6 h-6 ${interactive ? 'cursor-pointer' : ''} ${
            isFilled ? 'text-amber-500' : 'text-muted-foreground/30'
          } transition-colors`}
          weight={isFilled ? 'fill' : 'regular'}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate?.(i)}
        />
      );
    }
    return <div className="flex gap-1">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
                  <span className="text-4xl font-bold text-primary">{avgRating.toFixed(0)}</span>
                </div>
                {renderStars(avgRating)}
                <p className="text-sm text-muted-foreground mt-2">Based on {reviews.length} reviews</p>
                <Button className="mt-4" onClick={() => setShowWriteReview(true)}>
                  <Star className="w-4 h-4 mr-2" weight="fill" />
                  Write a Review
                </Button>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                <h4 className="font-semibold mb-4">Rating Distribution</h4>
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-8">{stars}★</span>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>

              {/* Category Averages */}
              <div className="space-y-3">
                <h4 className="font-semibold mb-4">Category Ratings</h4>
                {Object.entries(avgCategories).map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={value} className="w-24 h-2" />
                      <span className="text-sm font-medium w-8">{value.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Write Your Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">How would you rate {contractorName}?</p>
                  {renderStars(newRating, true, setNewRating)}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['quality', 'communication', 'timeliness', 'value'] as const).map(category => (
                    <div key={category} className="space-y-2">
                      <label className="text-sm capitalize">{category}</label>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-5 h-5 cursor-pointer ${
                              star <= categoryRatings[category] ? 'text-amber-500' : 'text-muted-foreground/30'
                            }`}
                            weight={star <= categoryRatings[category] ? 'fill' : 'regular'}
                            onClick={() => setCategoryRatings({ ...categoryRatings, [category]: star })}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium">Review Title (optional)</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    placeholder="Sum up your experience"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Your Review *</label>
                  <Textarea
                    className="mt-1"
                    placeholder="Share your experience with this contractor..."
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleSubmitReview}>Submit Review</Button>
                  <Button variant="outline" onClick={() => setShowWriteReview(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SortAscending className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-40">
            <FunnelSimple className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={review.reviewerAvatar} />
                    <AvatarFallback>{review.reviewerName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.reviewerName}</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                    </div>

                    <Badge variant="outline" className="mb-3">{review.jobTitle}</Badge>

                    {review.title && <h4 className="font-semibold mb-2">{review.title}</h4>}
                    <p className="text-muted-foreground">{review.content}</p>

                    {/* Category ratings */}
                    <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t">
                      {Object.entries(review.categories).map(([cat, val]) => (
                        <div key={cat} className="text-center">
                          <p className="text-xs text-muted-foreground capitalize">{cat}</p>
                          <p className="font-semibold">{val}</p>
                        </div>
                      ))}
                    </div>

                    {/* Contractor Response */}
                    {review.response && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm font-semibold mb-1">Response from {contractorName}</p>
                        <p className="text-sm text-muted-foreground">{review.response.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{formatDate(review.response.date)}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, true)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Helpful ({review.helpful})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleHelpful(review.id, false)}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        ({review.notHelpful})
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
