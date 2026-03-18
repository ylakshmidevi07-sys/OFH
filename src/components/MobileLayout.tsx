import { ReactNode } from "react";
import MobileBottomNav from "./MobileBottomNav";
import MobileSideMenu from "./MobileSideMenu";
import InstallBanner from "./InstallBanner";
import { useUIStore } from "@/stores/uiStore";

interface MobileLayoutProps {
  children: ReactNode;
}

const MobileLayout = ({ children }: MobileLayoutProps) => {
  const isOpen = useUIStore((s) => s.isSideMenuOpen);
  const closeSideMenu = useUIStore((s) => s.closeSideMenu);

  return (
    <>
      {children}
      <MobileBottomNav />
      <MobileSideMenu
        isOpen={isOpen}
        onClose={() => closeSideMenu()}
      />
      <InstallBanner />
    </>
  );
};

export default MobileLayout;
