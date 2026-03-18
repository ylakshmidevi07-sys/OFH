import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import PullToRefresh from "@/components/PullToRefresh";
import DynamicBanner from "@/components/DynamicBanner";
import { usePublicHomepage } from "@/hooks/queries/useHomepage";
import type { HomepageSection } from "@/types";

const SECTION_MAP: Record<string, React.FC> = {
  HERO: Hero,
  FEATURED_PRODUCTS: FeaturedProducts,
  CATEGORIES: Categories,
  NEWSLETTER: Newsletter,
};

const RenderSection = ({ section }: { section: HomepageSection }) => {
  if (section.type === 'BANNER') {
    return <DynamicBanner placement="HOMEPAGE" />;
  }
  const Component = SECTION_MAP[section.type];
  if (!Component) return null;
  return <Component />;
};

const Index = () => {
  const { data: sections } = usePublicHomepage();

  const handleRefresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  // If sections are configured via API, render dynamically; else fallback to static layout
  const hasDynamicLayout = sections && sections.length > 0;

  return (
    <PageTransition>
      <Helmet>
        <title>OFH | The Organic Foods House - Fresh Organic Food Delivered</title>
        <meta 
          name="description" 
          content="The Organic Foods House (OFH) - Shop fresh organic fruits, vegetables, dairy, and pantry essentials. Farm-to-table quality with sustainable sourcing. Free delivery on orders over $50." 
        />
        <meta name="keywords" content="OFH, organic foods house, organic food, fresh produce, organic vegetables, organic fruits, farm fresh, sustainable food, healthy eating" />
        <link rel="canonical" href="https://theorganicfoodshouse.com" />
      </Helmet>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="min-h-screen bg-background pb-mobile-nav">
          <Navbar />
          <main>
            {hasDynamicLayout ? (
              sections.map((section: HomepageSection) => (
                <RenderSection key={section.id} section={section} />
              ))
            ) : (
              <>
                <Hero />
                <FeaturedProducts />
                <Categories />
                <Newsletter />
              </>
            )}
          </main>
          <Footer />
        </div>
      </PullToRefresh>
    </PageTransition>
  );
};

export default Index;