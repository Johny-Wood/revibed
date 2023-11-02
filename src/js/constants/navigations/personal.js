import { PersonalNotificationsSectionsConstants } from '@/constants/personal/notifications/sections';
import { RoutePathsConstants } from '@/constants/routes/routes';

import LogoutIcon from '../../icons/LogoutIcon';
import MessageIcon from '../../icons/MessageIcon';
import NotificationsIcon from '../../icons/NotificationsIcon';
import SettingsIcon from '../../icons/SettingsIcon';

const PROJECTS_GROUP_LINKS = [
  {
    tKey: 'ripper',
    href: RoutePathsConstants.RIPPER,
    shown: ({ isRipper } = {}) => isRipper,
  },
  {
    tKey: 'myPreOrders',
    keyMenuNotification: PersonalNotificationsSectionsConstants.MY_PROJECTS,
    href: RoutePathsConstants.MY_PROJECTS,
    asPath: RoutePathsConstants.MY_PROJECTS_EDIT,
  },
];

const PURCHASES_GROUP_LINKS = [
  {
    tKey: 'myPurchases',
    href: RoutePathsConstants.PERSONAL_PURCHASES,
    shown: ({ DIGITAL_MARKETPLACE_ENABLED } = {}) => DIGITAL_MARKETPLACE_ENABLED,
    inheritanceActive: true,
  },
];

const BALANCE_LINK = {
  tKey: 'balance',
  keyMenuNotification: PersonalNotificationsSectionsConstants.BALANCE,
  href: RoutePathsConstants.BALANCE,
  asPath: RoutePathsConstants.BALANCE_MAIN,
  inheritanceActive: true,
};

const BALANCE_GROUP_LINKS = [BALANCE_LINK];

const USER_NOTIFICATIONS_LINK = {
  tKey: 'notifications',
  href: RoutePathsConstants.USER_NOTIFICATIONS,
  keyMenuNotification: PersonalNotificationsSectionsConstants.PERSONAL_EVENTS_FEED,
};

const INVITES_GROUP_LINKS = [
  {
    tKey: 'invites',
    href: RoutePathsConstants.INVITES,
  },
];

const CONTACT_ADMIN_GROUP_LINK = {
  tKey: 'contactAdmin',
  href: RoutePathsConstants.CONTACT_ADMIN,
  keyMenuNotification: PersonalNotificationsSectionsConstants.CONTACT_ADMIN,
};

const FOLLOWING_LINK = {
  tKey: 'following',
  href: RoutePathsConstants.FOLLOWING,
};

const FOLLOWERS_LINK = {
  tKey: 'followers',
  href: RoutePathsConstants.FOLLOWERS,
};

const SETTINGS_ADMIN_GROUP_LINK = {
  tKey: 'settings',
  href: RoutePathsConstants.PERSONAL_SETTINGS,
  icon: SettingsIcon,
};

export const PersonalNavigationConstants = [
  {
    group: 'purchases',
    links: [...PURCHASES_GROUP_LINKS],
  },
  {
    group: 'myPreOrders',
    links: [...PROJECTS_GROUP_LINKS],
  },
  {
    group: 'following',
    links: [FOLLOWING_LINK],
  },
  {
    group: 'followers',
    links: [FOLLOWERS_LINK],
  },
  {
    group: 'notifications',
    links: [USER_NOTIFICATIONS_LINK],
  },
  {
    group: 'invites',
    links: [...INVITES_GROUP_LINKS],
  },
  {
    group: 'balance',
    links: [...BALANCE_GROUP_LINKS],
  },
  {
    group: 'contactAdmin',
    links: [CONTACT_ADMIN_GROUP_LINK],
  },
];

export const PersonalAccountNavigationConstants = [
  {
    group: 'settingsAccount',
    links: [
      {
        tKey: 'account',
        href: RoutePathsConstants.PERSONAL_SETTINGS,
        inheritanceActive: false,
      },
      {
        tKey: 'telegramBot',
        href: RoutePathsConstants.PERSONAL_TELEGRAM_SETTINGS,
      },
      {
        tKey: 'wantlistSettings',
        href: RoutePathsConstants.PERSONAL_WANTLIST_SETTINGS,
      },
      {
        tKey: 'settingsNotifications',
        href: RoutePathsConstants.PERSONAL_NOTIFICATIONS_EMAIL_SETTINGS,
        asPath: RoutePathsConstants.PERSONAL_NOTIFICATIONS_SETTINGS,
      },
    ],
  },
];

export const PersonalUserControlNavigationConstants = [
  ...PURCHASES_GROUP_LINKS,
  ...PROJECTS_GROUP_LINKS,
  ...BALANCE_GROUP_LINKS,
  {
    ...USER_NOTIFICATIONS_LINK,
    shown: ({ isNotDesktop } = {}) => isNotDesktop,
    icon: NotificationsIcon,
  },
  {
    ...CONTACT_ADMIN_GROUP_LINK,
    icon: MessageIcon,
  },
  {
    ...SETTINGS_ADMIN_GROUP_LINK,
  },
  {
    tKey: 'logout',
    type: 'button',
    action: 'signOut',
    icon: LogoutIcon,
  },
];
