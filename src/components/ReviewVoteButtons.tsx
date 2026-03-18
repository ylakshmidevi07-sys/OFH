import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewVotes } from "@/hooks/useReviewVotes";
import { cn } from "@/lib/utils";

interface ReviewVoteButtonsProps {
  productId: number;
  reviewId: number;
}

const ReviewVoteButtons = ({ productId, reviewId }: ReviewVoteButtonsProps) => {
  const { getVotes, getUserVote, vote } = useReviewVotes();
  const votes = getVotes(productId, reviewId);
  const userVote = getUserVote(productId, reviewId);

  return (
    <div className="flex items-center gap-2 mt-3">
      <span className="text-xs text-muted-foreground mr-1">Helpful?</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => vote(productId, reviewId, "up")}
        className={cn(
          "h-8 px-2 gap-1.5",
          userVote === "up" && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        <ThumbsUp className={cn("h-4 w-4", userVote === "up" && "fill-current")} />
        <span className="text-xs font-medium">{votes.up}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => vote(productId, reviewId, "down")}
        className={cn(
          "h-8 px-2 gap-1.5",
          userVote === "down" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
        )}
      >
        <ThumbsDown className={cn("h-4 w-4", userVote === "down" && "fill-current")} />
        <span className="text-xs font-medium">{votes.down}</span>
      </Button>
    </div>
  );
};

export default ReviewVoteButtons;
