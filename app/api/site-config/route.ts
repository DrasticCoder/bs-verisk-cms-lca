import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  DEFAULT_SITE_CONFIG,
  SITE_CONFIG_ID,
  TEXT_COLOR_OPTIONS,
  siteConfigSchema,
} from '@/lib/site-config';

const siteConfigModel = prisma.siteConfig;

const corsHeaders = {
  'Access-Control-Allow-Origin':
    process.env.SITE_CONFIG_ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

function withCors<T>(response: NextResponse<T>) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

function normalizeConfig(config: unknown) {
  const source =
    config && typeof config === 'object'
      ? (config as Record<string, unknown>)
      : {};
  const allowedTextColors = new Set<string>(
    TEXT_COLOR_OPTIONS.map((option) => option.value),
  );

  return {
    enableMobileCarousel:
      typeof source.enableMobileCarousel === 'boolean'
        ? source.enableMobileCarousel
        : DEFAULT_SITE_CONFIG.enableMobileCarousel,
    stopMobileCarouselAnimation:
      typeof source.stopMobileCarouselAnimation === 'boolean'
        ? source.stopMobileCarouselAnimation
        : DEFAULT_SITE_CONFIG.stopMobileCarouselAnimation,
    textColor:
      typeof source.textColor === 'string' &&
      allowedTextColors.has(source.textColor)
        ? source.textColor
        : DEFAULT_SITE_CONFIG.textColor,
  };
}

async function sanitizeConfig(config: unknown) {
  const parsedConfig = siteConfigSchema.safeParse(normalizeConfig(config));

  if (parsedConfig.success) {
    return parsedConfig.data;
  }

  return siteConfigModel.update({
    where: { id: SITE_CONFIG_ID },
    data: DEFAULT_SITE_CONFIG,
    select: {
      enableMobileCarousel: true,
      stopMobileCarouselAnimation: true,
      textColor: true,
    },
  });
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  try {
    const config = await siteConfigModel.upsert({
      where: { id: SITE_CONFIG_ID },
      update: {},
      create: {
        id: SITE_CONFIG_ID,
        ...DEFAULT_SITE_CONFIG,
      },
      select: {
        enableMobileCarousel: true,
        stopMobileCarouselAnimation: true,
        textColor: true,
      },
    });

    return withCors(NextResponse.json(await sanitizeConfig(config)));
  } catch (error) {
    console.error('Error fetching site config:', error);
    return withCors(NextResponse.json(DEFAULT_SITE_CONFIG));
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = siteConfigSchema.parse(normalizeConfig(body));

    const config = await siteConfigModel.upsert({
      where: { id: SITE_CONFIG_ID },
      update: validatedData,
      create: {
        id: SITE_CONFIG_ID,
        ...validatedData,
      },
      select: {
        enableMobileCarousel: true,
        stopMobileCarouselAnimation: true,
        textColor: true,
      },
    });

    return withCors(NextResponse.json(config));
  } catch (error) {
    console.error('Error updating site config:', error);
    return withCors(
      NextResponse.json({ error: 'Invalid site config' }, { status: 400 }),
    );
  }
}
