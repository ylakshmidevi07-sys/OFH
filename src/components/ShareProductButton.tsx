import { useState } from "react";
import { Share2, Copy, Check, Gift, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useReferralCode } from "@/hooks/useReferralCode";
import { Link } from "react-router-dom";

interface ShareProductButtonProps {
  productId: number;
  productName: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className={className}>
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.1l5.904-1.96A15.878 15.878 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.972-7.824-6.8-8.062-7.114-.228-.314-1.918-2.554-1.918-4.87s1.212-3.454 1.644-3.928c.432-.474.944-.592 1.258-.592.314 0 .628.002.902.016.29.016.678-.11 1.06.81.39.942 1.33 3.24 1.448 3.476.118.236.196.51.04.824-.158.314-.236.51-.472.786-.236.274-.496.612-.71.822-.234.234-.478.488-.206.96.274.47 1.216 2.006 2.612 3.252 1.794 1.6 3.306 2.096 3.778 2.332.472.236.746.196 1.02-.118.274-.314 1.174-1.37 1.488-1.842.314-.472.628-.392 1.06-.236.432.158 2.728 1.288 3.2 1.524.47.236.786.354.904.55.118.196.118 1.13-.272 2.226z" />
  </svg>
);

const REFERRAL_DISCOUNT = "10% off";

const ShareProductButton = ({ productId, productName }: ShareProductButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const { referralCode, loading, isLoggedIn } = useReferralCode();

  const productUrl = referralCode
    ? `${window.location.origin}/products/${productId}?ref=${referralCode}`
    : `${window.location.origin}/products/${productId}`;
  const shareMessage = referralCode
    ? `Check out ${productName} on OFH! Use code ${referralCode} for ${REFERRAL_DISCOUNT} 🌿`
    : `Check out ${productName} on OFH! 🌿`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleCopyCode = async () => {
    if (!referralCode) return;
    try {
      await navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      toast.success("Referral code copied!");
      setTimeout(() => setCodeCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n\n${productUrl}`)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: shareMessage,
          url: productUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full"
          title="Share & earn discount"
        >
          <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Share & Save {REFERRAL_DISCOUNT}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Referral benefit */}
          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <p className="font-body text-sm text-foreground">
              Share this product with friends! They'll get <strong>{REFERRAL_DISCOUNT}</strong> off their first order using your referral code.
            </p>
          </div>

          {!isLoggedIn ? (
            <div className="text-center space-y-3">
              <p className="font-body text-sm text-muted-foreground">
                Sign in to get your unique referral code and earn rewards!
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-4">
              <p className="font-body text-sm text-muted-foreground animate-pulse">
                Generating your referral code...
              </p>
            </div>
          ) : (
            <>
              {/* Referral code */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-foreground">
                  Your Referral Code
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={referralCode || ""}
                    className="font-mono text-lg font-bold tracking-wider text-center bg-card"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {codeCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Share link */}
              <div className="space-y-2">
                <label className="font-body text-sm font-medium text-foreground">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={productUrl}
                    className="text-xs bg-card"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Share buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleWhatsAppShare}
              className="flex-1 gap-2"
              style={{ backgroundColor: "#25D366" }}
            >
              <WhatsAppIcon className="h-5 w-5" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="flex-1 gap-2"
            >
              <Share2 className="h-4 w-4" />
              More Options
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProductButton;
