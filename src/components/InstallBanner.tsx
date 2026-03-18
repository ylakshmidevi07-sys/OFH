import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const DISMISSED_KEY = "ofh-install-banner-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Event tracking is a no-op until a backend analytics endpoint is wired up.
const trackEvent = (_eventType: string) => {};

const InstallBanner = () => {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      trackEvent("impression");
    }, 3000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    trackEvent("dismiss");
  }, []);

  const handleInstall = useCallback(async () => {
    if (deferredPrompt) {
      trackEvent("click_native");
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      trackEvent(outcome === "accepted" ? "installed" : "native_dismissed");
      if (outcome === "accepted") dismiss();
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, dismiss]);

  const handleFallbackClick = useCallback(() => {
    trackEvent("click_fallback");
    dismiss();
  }, [dismiss]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-4 flex items-center gap-3">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Download className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-body font-semibold text-sm text-foreground">Install OFH App</p>
          <p className="font-body text-xs text-muted-foreground truncate">
            Add to home screen for the best experience
          </p>
        </div>
        {deferredPrompt ? (
          <Button size="sm" className="shrink-0" onClick={handleInstall}>
            Install
          </Button>
        ) : (
          <Link to="/install" onClick={handleFallbackClick}>
            <Button size="sm" className="shrink-0">
              Install
            </Button>
          </Link>
        )}
        <button onClick={dismiss} className="shrink-0 p-1 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
