import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center space-y-8">
          <div className="space-y-3">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Install Organic Farm Hub
            </h1>
            <p className="text-muted-foreground">
              Add OFH to your home screen for quick access, offline support, and a native app experience.
            </p>
          </div>

          {isInstalled ? (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="pt-6 flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-primary" />
                <p className="text-lg font-semibold text-foreground">Already installed!</p>
                <p className="text-sm text-muted-foreground">
                  You're using OFH as an installed app.
                </p>
              </CardContent>
            </Card>
          ) : isIOS ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="font-semibold text-foreground">Install on iPhone / iPad</p>
                <ol className="text-left text-sm text-muted-foreground space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Tap the <Share className="inline w-4 h-4 -mt-0.5" /> <strong>Share</strong> button in Safari's toolbar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Tap <strong>"Add"</strong> to confirm</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          ) : deferredPrompt ? (
            <Button size="xl" onClick={handleInstall} className="w-full gap-3">
              <Download className="w-5 h-5" />
              Install App
            </Button>
          ) : (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <p className="font-semibold text-foreground">Install on Android</p>
                <ol className="text-left text-sm text-muted-foreground space-y-3">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                    <span>Tap the <strong>⋮ menu</strong> in Chrome</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                    <span>Tap <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                    <span>Tap <strong>"Install"</strong> to confirm</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
            <div className="space-y-1">
              <div className="w-10 h-10 mx-auto bg-muted rounded-lg flex items-center justify-center">⚡</div>
              <p>Fast & Smooth</p>
            </div>
            <div className="space-y-1">
              <div className="w-10 h-10 mx-auto bg-muted rounded-lg flex items-center justify-center">📴</div>
              <p>Works Offline</p>
            </div>
            <div className="space-y-1">
              <div className="w-10 h-10 mx-auto bg-muted rounded-lg flex items-center justify-center">🔒</div>
              <p>Secure</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default Install;
