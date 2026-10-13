import React from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedDishes } from './components/FeaturedDishes';
import { RestaurantHighlights } from './components/RestaurantHighlights';
import { CustomSushiSection } from './components/CustomSushiSection';
import { MenuPage } from './components/MenuPage';
import { CartPage } from './components/CartPage';
import { AboutPage } from './components/AboutPage';
import { ContactLocationPage } from './components/ContactLocationPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { DishDetailModal } from './components/DishDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomOrderBar } from './components/BottomOrderBar';
import { FloatingCartButton } from './components/FloatingCartButton';
import { OwnerSettingsModal } from './components/OwnerSettingsModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { currentView } = useRestaurant();

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1013] text-[#FAF8F5] font-sans antialiased selection:bg-[#FF5B26] selection:text-white pb-16">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <FeaturedDishes />
            <RestaurantHighlights />
            <CustomSushiSection />
            <ContactLocationPage />
          </>
        )}

        {currentView === 'menu' && <MenuPage />}
        {currentView === 'cart' && <CartPage />}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactLocationPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {currentView === 'confirmation' && <OrderConfirmationPage />}
      </main>

      <Footer />

      {/* Fixed Sticky 'Order Now' Bottom Bar */}
      <BottomOrderBar />

      {/* Floating Cart Button */}
      <FloatingCartButton />

      {/* Global Overlays & Modals */}
      <DishDetailModal />
      <CartDrawer />
      <OwnerSettingsModal />
      <UserSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <AppContent />
    </RestaurantProvider>
  );
}
