/**
 * Review vote tracking hook — manages up/down votes in localStorage.
 * This is a UI-only feature with no backend endpoint.
 */
import { useState, useEffect, useCallback } from 'react';

type VoteType = 'up' | 'down' | null;
interface ReviewVotes { [key: string]: { up: number; down: number } }
interface UserVotes { [key: string]: VoteType }

const VOTES_KEY = 'ofh_review_votes';
const USER_VOTES_KEY = 'ofh_user_votes';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useReviewVotes() {
  const [reviewVotes, setReviewVotes] = useState<ReviewVotes>(() => loadJSON(VOTES_KEY, {}));
  const [userVotes, setUserVotes] = useState<UserVotes>(() => loadJSON(USER_VOTES_KEY, {}));

  useEffect(() => {
    localStorage.setItem(VOTES_KEY, JSON.stringify(reviewVotes));
  }, [reviewVotes]);

  useEffect(() => {
    localStorage.setItem(USER_VOTES_KEY, JSON.stringify(userVotes));
  }, [userVotes]);

  const reviewKey = (productId: number, reviewId: number) => `${productId}-${reviewId}`;

  const getVotes = useCallback(
    (productId: number, reviewId: number) =>
      reviewVotes[reviewKey(productId, reviewId)] ?? { up: 0, down: 0 },
    [reviewVotes],
  );

  const getUserVote = useCallback(
    (productId: number, reviewId: number): VoteType =>
      userVotes[reviewKey(productId, reviewId)] ?? null,
    [userVotes],
  );

  const vote = useCallback(
    (productId: number, reviewId: number, type: 'up' | 'down') => {
      const key = reviewKey(productId, reviewId);
      const current = reviewVotes[key] ?? { up: 0, down: 0 };
      const userVote = userVotes[key] ?? null;

      const newVotes = { ...current };
      let newUserVote: VoteType;

      if (userVote === type) {
        newVotes[type] = Math.max(0, newVotes[type] - 1);
        newUserVote = null;
      } else {
        if (userVote !== null) newVotes[userVote] = Math.max(0, newVotes[userVote] - 1);
        newVotes[type]++;
        newUserVote = type;
      }

      setReviewVotes((prev) => ({ ...prev, [key]: newVotes }));
      setUserVotes((prev) => ({ ...prev, [key]: newUserVote }));
    },
    [reviewVotes, userVotes],
  );

  return { getVotes, getUserVote, vote };
}

