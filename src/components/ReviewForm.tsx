import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/queries/useReviews";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;  // backend UUID (product.backendId)
  onReviewAdded?: () => void;
}

const ReviewForm = ({ productId, onReviewAdded }: ReviewFormProps) => {
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setIsSubmitting(true);

    createReview.mutate(
      { productId, rating, comment: comment.trim() },
      {
        onSuccess: () => {
          toast.success("Thank you for your review!");
          setName("");
          setRating(0);
          setComment("");
          setIsSubmitting(false);
          onReviewAdded?.();
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || "Failed to submit review.";
          toast.error(msg);
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background rounded-xl p-6 border border-border"
    >
      <h4 className="font-display text-lg font-bold text-foreground mb-4">
        Write a Review
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-body text-sm text-muted-foreground mb-2">
            Your Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="bg-card"
          />
        </div>

        <div>
          <label className="block font-body text-sm text-muted-foreground mb-2">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 font-body text-sm text-muted-foreground">
              {rating > 0 ? `${rating} star${rating > 1 ? "s" : ""}` : "Select rating"}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-muted-foreground mb-2">
            Your Review
          </label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="bg-card resize-none"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
