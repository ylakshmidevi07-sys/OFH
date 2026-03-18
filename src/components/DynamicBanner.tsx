import { usePublicBanners } from '../hooks/queries/useBanners';
import type { Banner } from '../types';

interface DynamicBannerProps {
  placement?: string;
  className?: string;
}

const DynamicBanner = ({ placement = 'HOMEPAGE', className = '' }: DynamicBannerProps) => {
  const { data: banners, isLoading } = usePublicBanners(placement);

  if (isLoading || !banners || banners.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      {banners.map((banner: Banner) => (
        <div key={banner.id} className="relative overflow-hidden">
          {banner.linkUrl ? (
            <a href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
              <BannerContent banner={banner} />
            </a>
          ) : (
            <BannerContent banner={banner} />
          )}
        </div>
      ))}
    </div>
  );
};

const BannerContent = ({ banner }: { banner: Banner }) => (
  <div className="relative">
    <img
      src={banner.imageUrl}
      alt={banner.title}
      className="w-full h-48 md:h-64 object-cover"
    />
    <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center">
      <div>
        <h3 className="text-white text-2xl md:text-3xl font-bold">{banner.title}</h3>
        {banner.subtitle && (
          <p className="text-white/90 text-sm md:text-base mt-2">{banner.subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

export default DynamicBanner;

