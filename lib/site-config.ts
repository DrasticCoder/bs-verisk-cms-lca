import { z } from 'zod';

export const SITE_CONFIG_ID = 'landing-page';

export const TEXT_COLOR_OPTIONS = [
  { label: 'White', value: '#ffffff' },
  { label: 'Charcoal', value: '#111827' },
  { label: 'Blue', value: '#1d4ed8' },
  { label: 'Emerald', value: '#047857' },
  { label: 'Purple', value: '#6d28d9' },
  { label: 'Rose', value: '#be123c' },
] as const;

const textColorValues = TEXT_COLOR_OPTIONS.map((option) => option.value) as [
  string,
  ...string[],
];

export const DEFAULT_SITE_CONFIG = {
  enableMobileCarousel: true,
  stopMobileCarouselAnimation: true,
  textColor: '#ffffff',
};

export const siteConfigSchema = z.object({
  enableMobileCarousel: z.boolean(),
  stopMobileCarouselAnimation: z.boolean(),
  textColor: z.enum(textColorValues),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
