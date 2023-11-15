import { RoutePathsConstants } from '@/constants/routes/routes';

export const FooterNavigationConstants = [
  {
    categoryName: 'title',
    links: [
      // {
      //   tKey: 'aboutUs',
      //   href: RoutePathsConstants.ABOUT_US,
      // },
      {
        tKey: 'news',
        href: RoutePathsConstants.NEWS,
        disabled: true,
      },
      {
        tKey: 'blog',
        href: RoutePathsConstants.BLOG,
      },
    ],
  },
  {
    categoryName: 'explore&Join',
    links: [
      {
        tKey: 'liveFeed',
        href: RoutePathsConstants.FEED,
        notNotAuthorized: true,
      },
      {
        tKey: 'projects',
        href: RoutePathsConstants.PROJECTS,
      },
      {
        tKey: 'signUp',
        href: RoutePathsConstants.SIGN_UP,
        notAuthorized: true,
      },
    ],
  },
  {
    categoryName: 'help&Support',
    links: [
      {
        tKey: 'contactUs',
        href: RoutePathsConstants.CONTACT_US,
      },
      {
        tKey: 'faq',
        href: RoutePathsConstants.FAQ,
      },
      {
        tKey: 'support',
        href: RoutePathsConstants.CONTACT_ADMIN,
      },
    ],
  },
  // {
  //   categoryName: 'follow',
  //   links: [
  //     {
  //       tKey: 'facebook',
  //       href: 'https://www.facebook.com/kollektivx',
  //       external: true,
  //     },
  //     {
  //       tKey: 'instagram',
  //       href: 'https://www.instagram.com/kollektiv_x/',
  //       external: true,
  //     },
  //     {
  //       tKey: 'soundcloud',
  //       href: 'https://soundcloud.com/kollektiv_x',
  //       external: true,
  //     },
  //   ],
  // },
];
