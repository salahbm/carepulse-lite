import { useLocale } from 'next-intl';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { locales } from '../../../i18n.config';

/**
 * A hook for managing translations and locale changes.
 *
 * @return {object} An object containing the available locales, the current locale, and a function to handle locale changes.
 */
const useTranslation = () => {
  const router = useRouter();
  const currentPathname = usePathname();
  const currentLocale = useLocale();

  const handleLocale = useCallback(
    (newLocale: string) => {
      if (newLocale === currentLocale) return;

      // Update the locale in cookies
      Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });

      // Since there's no locale prefix in the URL, just trigger a re-render
      router.push(currentPathname, undefined);

      // Refresh the page to apply the new locale
      router.refresh();
    },
    [currentLocale, currentPathname, router]
  );

  return { locales, currentLocale, handleLocale };
};

export default useTranslation;
