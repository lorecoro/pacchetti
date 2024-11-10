import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['it-IT', 'en-US'],
  defaultLocale: 'it-IT',
  localePrefix: {
    mode: 'always',
    prefixes: {
      'en-US': '/en',
      'it-IT': '/it'
    }
  },
  pathnames: {
    '/': '/',
    '/organization': {
      'en-US': '/organization',
      'it-IT': '/organisation'
    }
  }
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);