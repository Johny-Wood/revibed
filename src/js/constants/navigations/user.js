import { RoutePathsConstants } from '@/constants/routes/routes';

export const UserNavigationConstants = (userId) => [
  {
    group: 'project',
    links: [
      {
        tKey: 'projects',
        href: RoutePathsConstants.USER_PROJECTS.replace(/%X/, userId),
        hrefPath: RoutePathsConstants.USER_PROJECTS.replace(/%X/, '[userId]'),
      },
    ],
  },
  {
    group: 'follow',
    links: [
      {
        tKey: 'following',
        href: RoutePathsConstants.USER_FOLLOWING.replace(/%X/, userId),
        hrefPath: RoutePathsConstants.USER_FOLLOWING.replace(/%X/, '[userId]'),
      },
      {
        tKey: 'followers',
        href: RoutePathsConstants.USER_FOLLOWERS.replace(/%X/, userId),
        hrefPath: RoutePathsConstants.USER_FOLLOWERS.replace(/%X/, '[userId]'),
      },
    ],
  },
];
