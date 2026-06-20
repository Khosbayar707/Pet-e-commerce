"use client";

import { useState } from "react";
import Image from "next/image";
import { StarRating } from "@/components/shop/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { submitReview } from "@/actions/reviews";
import { toast } from "sonner";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  user: { id: string; name?: string | null; image?: string | null };
}

interface ReviewSectionProps {
  product: { id: string; slug: string };
  reviews: Review[];
  avgRating: number;
  userId?: string;
}

export function ReviewSection({ product, reviews, avgRating, userId }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const hasReviewed = userId ? reviews.some((r) => r.user.id === userId) : false;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));
    formData.set("productId", product.id);
    const result = await submitReview(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Review submitted! It will appear after moderation.");
      setShowForm(false);
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={avgRating} size="lg" />
              <span className="text-gray-500">{avgRating.toFixed(1)} out of 5 ({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        {!hasReviewed && userId && !showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline">
            Write a Review
          </Button>
        )}
        {!userId && (
          <Link href="/login">
            <Button variant="outline">Sign in to Review</Button>
          </Link>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Write Your Review</h3>
          <div>
            <Label className="mb-2 block">Your Rating *</Label>
            <StarRating rating={rating} size="lg" interactive onRate={setRating} />
          </div>
          <div>
            <Label htmlFor="title" className="mb-1 block">Title</Label>
            <Input id="title" name="title" placeholder="Sum up your experience" />
          </div>
          <div>
            <Label htmlFor="body" className="mb-1 block">Review *</Label>
            <Textarea id="body" name="body" placeholder="Share your thoughts..." required rows={4} />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-5xl mb-3">⭐</div>
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt={review.user.name ?? "User"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-semibold">
                      {review.user.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-gray-900">{review.user.name ?? "Anonymous"}</span>
                    <StarRating rating={review.rating} size="sm" />
                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                  </div>
                  {review.title && <p className="font-medium text-gray-800 mb-1">{review.title}</p>}
                  <p className="text-gray-600 leading-relaxed">{review.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
