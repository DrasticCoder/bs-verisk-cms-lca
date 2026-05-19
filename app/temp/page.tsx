'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Globe,
  Package,
  Shield,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DEFAULT_SITE_CONFIG, SiteConfig } from '@/lib/site-config';

type CMSConfig = SiteConfig;

interface CardBlock {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const cardBlocks: CardBlock[] = [
  {
    id: '1',
    title: 'General Insurance Solutions',
    description: 'Streamline your general insurance claims and underwriting decision-making through our ecosystem of innovative solutions',
    icon: <Shield className="w-12 h-12" />,
    link: '#general',
  },
  {
    id: '2',
    title: 'Reinsurance & Specialty',
    description: 'Experience the future of insurance technology and data for (re)insurers, Lloyd\'s syndicates, and brokers',
    icon: <TrendingUp className="w-12 h-12" />,
    link: '#reinsurance',
  },
  {
    id: '3',
    title: 'Life, Health & Travel',
    description: 'Transform insurance underwriting when you automate the assessment of medical conditions and health risks',
    icon: <Globe className="w-12 h-12" />,
    link: '#life',
  },
  {
    id: '4',
    title: 'Sustainability & Resilience',
    description: 'Understand interconnected risks across environment and social change with our advanced analytics',
    icon: <Zap className="w-12 h-12" />,
    link: '#sustainability',
  },
];

const CONFIG_URL =
  process.env.NEXT_PUBLIC_SITE_CONFIG_URL || '/api/site-config';
const ADMIN_SITE_URL = process.env.NEXT_PUBLIC_ADMIN_SITE;
const PRODUCTS_URL = ADMIN_SITE_URL
  ? `${ADMIN_SITE_URL}/api/products?perPage=20`
  : '/api/products?perPage=20';

interface Product {
  id: string;
  name: string;
  img_url?: string | null;
}

function isLightColor(hexColor: string) {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 180;
}

function getSitePalette(textColor: string) {
  if (isLightColor(textColor)) {
    return {
      background: '#111827',
      surface: '#1f2937',
      border: '#374151',
      buttonSurface: '#0f172a',
    };
  }

  return {
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#dbe3ee',
    buttonSurface: '#eef2f7',
  };
}

// Mobile carousel component
function CardCarousel({ cards, cmsConfig }: { cards: CardBlock[]; cmsConfig: CMSConfig }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Feature 2: Stop animation when switching to mobile carousel view
  const shouldShowCarousel = isMobile && cmsConfig.enableMobileCarousel;

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (shouldShowCarousel) {
    // Mobile Carousel View
    const card = cards[currentIndex];
    const carouselAnimation = cmsConfig.stopMobileCarouselAnimation
      ? 'transition-colors duration-300'
      : 'hover:shadow-2xl hover:scale-105 transition-all duration-300';

    return (
      <div className="space-y-4">
        <div
          className={`rounded-xl border border-[var(--site-border-color)] bg-[var(--site-surface-color)] p-8 min-h-[320px] flex flex-col justify-between ${carouselAnimation}`}
        >
          <div className="flex items-start justify-between">
            <div className="opacity-80">{card.icon}</div>
            <span className="text-sm opacity-60">
              {currentIndex + 1} / {cards.length}
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
            <p className="mb-6 opacity-90">{card.description}</p>
            <a href={card.link} className="inline-flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
              Learn more <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex gap-3 justify-between items-center">
          <button
            onClick={prevCard}
            className="flex-1 rounded-lg border border-[var(--site-border-color)] bg-[var(--site-surface-color)] py-2 transition hover:opacity-80"
          >
            Previous
          </button>
          <div className="flex gap-1 justify-center flex-1">
            {cards.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition ${
                  idx === currentIndex
                    ? 'w-6 bg-[var(--site-text-color)]'
                    : 'bg-[var(--site-border-color)]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextCard}
            className="flex-1 rounded-lg border border-[var(--site-border-color)] bg-[var(--site-surface-color)] py-2 transition hover:opacity-80"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Desktop Grid View - with animations
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        return (
          <div
            key={card.id}
            className={`
              rounded-xl border border-[var(--site-border-color)] bg-[var(--site-surface-color)] p-6 min-h-[280px] flex flex-col justify-between
              hover:shadow-2xl hover:scale-105 transition-all duration-300
              cursor-pointer group
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="opacity-80 group-hover:opacity-100 transition-opacity">
                {card.icon}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-sm mb-6 line-clamp-3 opacity-90">{card.description}</p>
              <a href={card.link} className="inline-flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity">
                Learn more <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ProductShowcase({
  enableMobileCarousel,
}: {
  enableMobileCarousel: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        setProducts(Array.isArray(data.items) ? data.items : []);
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const visibleProducts =
    products.length > 0
      ? products
      : [
          { id: 'sample-1', name: 'Claims Analytics' },
          { id: 'sample-2', name: 'Risk Intelligence' },
          { id: 'sample-3', name: 'Policy Insights' },
        ];
  const shouldUseHorizontalScroll = isMobile && enableMobileCarousel;

  return (
    <div
      className={
        shouldUseHorizontalScroll
          ? 'flex snap-x gap-5 overflow-x-auto pb-4'
          : 'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'
      }
    >
      {visibleProducts.map((product) => (
        <article
          key={product.id}
          className={`rounded-xl border border-[var(--site-border-color)] bg-[var(--site-surface-color)] p-5 transition hover:shadow-lg ${
            shouldUseHorizontalScroll
              ? 'min-w-[260px] snap-start sm:min-w-[300px]'
              : ''
          }`}
        >
          <div className="mb-5 flex h-28 items-center justify-center rounded-lg border border-[var(--site-border-color)] bg-[var(--site-button-surface-color)]">
            {product.img_url ? (
              <div
                aria-label={product.name}
                className="h-full w-full rounded-lg bg-cover bg-center"
                role="img"
                style={{ backgroundImage: `url(${product.img_url})` }}
              />
            ) : (
              <Package className="h-10 w-10 opacity-70" />
            )}
          </div>
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="mt-2 text-sm opacity-75">
            Product managed from the admin panel.
          </p>
        </article>
      ))}
    </div>
  );
}

export default function TempLandingPage() {
  const [cmsConfig, setCmsConfig] = useState<CMSConfig>(DEFAULT_SITE_CONFIG);
  const sitePalette = getSitePalette(cmsConfig.textColor);

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(CONFIG_URL, { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        setCmsConfig(await response.json());
      } catch (error) {
        console.error('Failed to load site config:', error);
      }
    }

    loadConfig();
  }, []);

  return (
    <div
      className="w-full overflow-hidden bg-[var(--site-background-color)] [&_*]:!text-[var(--site-text-color)]"
      style={
        {
          '--site-text-color': cmsConfig.textColor,
          '--site-background-color': sitePalette.background,
          '--site-surface-color': sitePalette.surface,
          '--site-border-color': sitePalette.border,
          '--site-button-surface-color': sitePalette.buttonSurface,
        } as React.CSSProperties
      }
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-[var(--site-border-color)] bg-[var(--site-surface-color)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg" />
            <span className="text-xl font-bold text-gray-900">Verisk</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative border-b border-[var(--site-border-color)] bg-[var(--site-background-color)] py-20 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6">
            Powering Better Insurance Decisions
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-80">
            Industry-leading insurance solutions powered by AI, deep data sets, and advanced analytics to support insurers navigating today&apos;s challenges
          </p>
          <Button className="bg-[var(--site-button-surface-color)] hover:opacity-80 text-lg px-8 py-6 rounded-lg font-bold">
            Explore Solutions <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Main Solutions Section */}
      <section className="py-16 sm:py-24 bg-[var(--site-background-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Solutions</h2>
            <p className="text-xl opacity-75">
              Comprehensive solutions designed for every stage of the insurance workflow
            </p>
          </div>

          {/* Feature 2: Carousel with animation control */}
          <CardCarousel cards={cardBlocks} cmsConfig={cmsConfig} />
        </div>
      </section>

      {/* Product Scroll Section */}
      <section className="py-16 sm:py-24 bg-[var(--site-background-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-4">Products</h2>
            <p className="text-xl opacity-75">
              Products published from the admin panel.
            </p>
          </div>

          <ProductShowcase
            enableMobileCarousel={cmsConfig.enableMobileCarousel}
          />
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 sm:py-24 bg-[var(--site-background-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Verisk?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Advanced Analytics',
                description: 'Leverage AI and machine learning for deeper insights',
                icon: '📊',
              },
              {
                title: 'Global Data Sets',
                description: 'Access comprehensive data from sources worldwide',
                icon: '🌍',
              },
              {
                title: '24/7 Support',
                description: 'Dedicated support team ready to help you succeed',
                icon: '💬',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border border-[var(--site-border-color)] bg-[var(--site-surface-color)] rounded-xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="opacity-75">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-[var(--site-surface-color)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Insurance Operations?</h2>
          <p className="text-xl mb-8 opacity-80">
            Join leading insurers who trust Verisk for their critical decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[var(--site-button-surface-color)] hover:opacity-80 text-lg px-8 py-6 rounded-lg font-bold">
              Get Started
            </Button>
            <Button className="bg-transparent border border-[var(--site-border-color)] hover:bg-[var(--site-button-surface-color)] text-lg px-8 py-6 rounded-lg font-bold">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--site-surface-color)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80">General Insurance</a></li>
                <li><a href="#" className="hover:opacity-80">Reinsurance</a></li>
                <li><a href="#" className="hover:opacity-80">Life & Health</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80">About Us</a></li>
                <li><a href="#" className="hover:opacity-80">Careers</a></li>
                <li><a href="#" className="hover:opacity-80">Newsroom</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80">Blog</a></li>
                <li><a href="#" className="hover:opacity-80">Events</a></li>
                <li><a href="#" className="hover:opacity-80">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:opacity-80">Privacy</a></li>
                <li><a href="#" className="hover:opacity-80">Terms</a></li>
                <li><a href="#" className="hover:opacity-80">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--site-border-color)] pt-8 text-center text-sm">
            <p>© 2026 Verisk Analytics. All rights reserved.</p>
            {ADMIN_SITE_URL && (
              <a
                href={ADMIN_SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex hover:opacity-80"
              >
                Admin site
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
