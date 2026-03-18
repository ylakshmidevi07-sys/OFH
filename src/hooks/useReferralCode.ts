// Referral code — stubbed until a NestJS /api/referrals endpoint is created.
// Codes are stored in localStorage per user.
import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const STORAGE_KEY = "ofh_referral_code";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "OFH";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function useReferralCode() {
  const user = useAuthStore((s) => s.user);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setReferralCode(null);
      return;
    }
    setLoading(true);
    const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
    if (stored) {
      setReferralCode(stored);
    } else {
      const code = generateCode();
      localStorage.setItem(`${STORAGE_KEY}_${user.id}`, code);
      setReferralCode(code);
    }
    setLoading(false);
  }, [user]);

  return { referralCode, loading, isLoggedIn: !!user };
}

export async function lookupReferralCode(_code: string): Promise<string | null> {
  // Stub — will call GET /api/referrals/:code once the backend endpoint exists
  return null;
}

export async function logReferralConversion(
  _referrerUserId: string,
  _refereeUserId: string,
  _orderId: string,
  _referralCode: string,
) {
  // Stub — will call POST /api/referrals/convert once the backend endpoint exists
}
