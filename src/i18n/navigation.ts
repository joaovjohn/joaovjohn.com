import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Navigation APIs from next-intl.
 * These are lightweight wrappers around Next.js navigation that handle locale automatically.
 * 
 * @see https://next-intl.dev/docs/routing/navigation
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
    createNavigation(routing);
