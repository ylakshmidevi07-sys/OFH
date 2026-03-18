import { useState, useRef, useCallback, ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh?: () => Promise<void>;
}

const PULL_THRESHOLD = 80;

const PullToRefresh = ({ children, onRefresh }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pullDistance = useMotionValue(0);

  const spinnerOpacity = useTransform(pullDistance, [0, PULL_THRESHOLD / 2, PULL_THRESHOLD], [0, 0.5, 1]);
  const spinnerScale = useTransform(pullDistance, [0, PULL_THRESHOLD], [0.5, 1]);
  const spinnerRotation = useTransform(pullDistance, [0, PULL_THRESHOLD], [0, 180]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      // Apply resistance to the pull
      const resistance = 0.4;
      const adjustedDiff = Math.min(diff * resistance, PULL_THRESHOLD * 1.5);
      pullDistance.set(adjustedDiff);
    }
  }, [isPulling, isRefreshing, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;
    setIsPulling(false);

    const currentPull = pullDistance.get();

    if (currentPull >= PULL_THRESHOLD && onRefresh) {
      setIsRefreshing(true);
      await animate(pullDistance, PULL_THRESHOLD, { duration: 0.2 });
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        await animate(pullDistance, 0, { duration: 0.3 });
      }
    } else {
      await animate(pullDistance, 0, { duration: 0.3 });
    }
  }, [isPulling, pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      className="relative h-full overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        style={{
          top: useTransform(pullDistance, (v) => v - 50),
          opacity: spinnerOpacity,
          scale: spinnerScale,
        }}
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20"
          style={{ rotate: isRefreshing ? undefined : spinnerRotation }}
          animate={isRefreshing ? { rotate: 360 } : undefined}
          transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : undefined}
        >
          <RefreshCw className="h-5 w-5 text-primary" />
        </motion.div>
      </motion.div>

      {/* Content with pull transform */}
      <motion.div style={{ y: pullDistance }}>
        {children}
      </motion.div>
    </div>
  );
};

export default PullToRefresh;
