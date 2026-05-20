'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_SITE_CONFIG,
  SiteConfig,
  TEXT_COLOR_OPTIONS,
} from '@/lib/site-config';
import { useToast } from '@/hooks/use-toast';

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE;

const configOptions: Array<{
  key: 'enableMobileCarousel' | 'stopMobileCarouselAnimation';
  title: string;
  description: string;
}> = [
  {
    key: 'enableMobileCarousel',
    title: 'Mobile Carousel',
    description: 'Show card blocks as a carousel on mobile screens.',
  },
  {
    key: 'stopMobileCarouselAnimation',
    title: 'Stop Mobile Carousel Animation',
    description:
      'Remove hover animation only when the mobile carousel view is active.',
  },
];

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch('/api/site-config', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to load site config');
        }
        setConfig(await response.json());
      } catch (error) {
        toast({
          title: 'Using defaults',
          description:
            error instanceof Error ? error.message : 'Failed to load config',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadConfig();
  }, [toast]);

  async function saveConfig() {
    setIsSaving(true);

    try {
      const response = await fetch('/api/site-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error('Failed to save site config');
      }

      setConfig(await response.json());
      toast({
        title: 'Saved',
        description: 'Site config has been published.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save config',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Site Config</h1>
          <p className="mt-2 text-sm text-gray-600">
            These settings are exposed through the public config API and apply
            the next time the site loads.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white">
          {configOptions.map((option) => (
            <label
              key={option.key}
              className="flex cursor-pointer items-center gap-4 border-b border-gray-100 p-5 last:border-b-0"
            >
              <input
                type="checkbox"
                checked={config[option.key]}
                disabled={isLoading || isSaving}
                onChange={(event) =>
                  setConfig((current) => ({
                    ...current,
                    [option.key]: event.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-gray-300"
              />
              <span className="flex-1">
                <span className="block font-semibold text-gray-900">
                  {option.title}
                </span>
                <span className="block text-sm text-gray-500">
                  {option.description}
                </span>
              </span>
            </label>
          ))}

          <div className="p-5">
            <div>
              <p className="font-semibold text-gray-900">Website Text Color</p>
              <p className="text-sm text-gray-500">
                Choose one approved color. The exact hex code is published to
                the site.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {TEXT_COLOR_OPTIONS.map((option) => {
                const isSelected = config.textColor === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isLoading || isSaving}
                    onClick={() =>
                      setConfig((current) => ({
                        ...current,
                        textColor: option.value,
                      }))
                    }
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      isSelected
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-200 bg-white hover:border-gray-400'
                    }`}
                  >
                    <span
                      className="h-7 w-7 rounded-full border border-gray-300"
                      style={{ backgroundColor: option.value }}
                    />
                    <span>
                      <span className="block text-sm font-semibold text-gray-900">
                        {option.label}
                      </span>
                      <span className="block text-xs uppercase text-gray-500">
                        {option.value}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={saveConfig} disabled={isLoading || isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save config'}
          </Button>

          {publicSiteUrl && (
            <Button variant="outline" asChild>
              <a href={publicSiteUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View site
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
