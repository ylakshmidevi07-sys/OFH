import { useLocation } from "react-router-dom";

const WHATSAPP_NUMBER = "917799160272";
const DEFAULT_MESSAGE = "Hi! I need help with my order on OFH - The Organic Foods House.";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
  >
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.1l5.904-1.96A15.878 15.878 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.166 2.28-.846.18-1.95.324-5.668-1.218-4.762-1.972-7.824-6.8-8.062-7.114-.228-.314-1.918-2.554-1.918-4.87s1.212-3.454 1.644-3.928c.432-.474.944-.592 1.258-.592.314 0 .628.002.902.016.29.016.678-.11 1.06.81.39.942 1.33 3.24 1.448 3.476.118.236.196.51.04.824-.158.314-.236.51-.472.786-.236.274-.496.612-.71.822-.234.234-.478.488-.206.96.274.47 1.216 2.006 2.612 3.252 1.794 1.6 3.306 2.096 3.778 2.332.472.236.746.196 1.02-.118.274-.314 1.174-1.37 1.488-1.842.314-.472.628-.392 1.06-.236.432.158 2.728 1.288 3.2 1.524.47.236.786.354.904.55.118.196.118 1.13-.272 2.226z" />
  </svg>
);

const WhatsAppFloatingButton = () => {
  const location = useLocation();

  // Hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  const handleClick = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
      style={{ backgroundColor: "#25D366" }}
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
    </button>
  );
};

export default WhatsAppFloatingButton;
