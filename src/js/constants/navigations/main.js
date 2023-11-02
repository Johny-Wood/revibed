import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';

const HELP_LINKS = [
  {
    tKey: 'contactUs',
    href: RoutePathsConstants.CONTACT_US,
  },
  {
    tKey: 'faq',
    href: RoutePathsConstants.FAQ,
  },
];

const HELP_GROUP = {
  tKey: 'help',
  href: '',
  items: HELP_LINKS,
};

const COMMON = [
  {
    tKey: 'marketplace',
    href: RoutePathsConstants.MARKETPLACE,
    shown: ({ DIGITAL_MARKETPLACE_ENABLED }) => DIGITAL_MARKETPLACE_ENABLED,
    inheritanceActive: true,
  },
  {
    tKey: 'projects',
    href: RoutePathsConstants.PROJECTS,
  },
  {
    tKey: 'feed',
    href: RoutePathsConstants.FEED,
    keyMenuNotification: PersonalNotificationsSectionsConstants.CUSTOM_FEED,
    notNotAuthorized: true,
  },
  HELP_GROUP,
  {
    tKey: 'rightsholders',
    href: RoutePathsConstants.RIGHTSHOLDERS,
  },
];

export const MobileMenuNavigationConstants = [
  {
    tKey: 'login',
    href: RoutePathsConstants.SIGN_IN,
    notAuthorized: true,
  },
  {
    tKey: 'signUp',
    href: RoutePathsConstants.SIGN_UP,
    notAuthorized: true,
  },
  ...COMMON,
];

export const HeaderNavigationConstants = COMMON;
