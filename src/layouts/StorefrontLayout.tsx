import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import CartDrawer from '../components/CartDrawer';
import WishlistDrawer from '../components/WishlistDrawer';
import WhatsAppFloatingButton from '../components/WhatsAppFloatingButton';

const StorefrontLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-mobile-nav">
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
      <CartDrawer />
      <WishlistDrawer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default StorefrontLayout;

