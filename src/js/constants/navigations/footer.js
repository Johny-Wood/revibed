import { RoutePathsConstants } from '@/constants/routes/routes';

import BlackCatCardImg from '../../../assets/images/promo/black-cat-card/black-cat-card_small.png';

export const FooterNavigationConstants = ({ variablesList: { INTERNAL_BLOG_LINK_ENABLED } = {} }) => [
  {
    categoryName: 'title',
    links: [
      {
        tKey: 'aboutUs',
        href: RoutePathsConstants.ABOUT_US,
      },
      {
        tKey: 'news',
        href: RoutePathsConstants.NEWS,
        disabled: true,
      },
      {
        tKey: 'blog',
        href: INTERNAL_BLOG_LINK_ENABLED ? RoutePathsConstants.BLOG : 'https://kollektivx.medium.com/',
        external: !INTERNAL_BLOG_LINK_ENABLED,
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
  {
    categoryName: 'follow',
    links: [
      {
        tKey: 'facebook',
        href: 'https://www.facebook.com/kollektivx',
        external: true,
      },
      {
        tKey: 'instagram',
        href: 'https://www.instagram.com/kollektiv_x/',
        external: true,
      },
      {
        tKey: 'soundcloud',
        href: 'https://soundcloud.com/kollektiv_x',
        external: true,
      },
    ],
  },
];

export const FooterBlackCatCardCategoryNavigationConstants = {
  categoryName: 'getFreeKoins',
  width: 'auto',
  align: 'right',
  toggle: false,
  links: [
    {
      image: BlackCatCardImg,
      href: RoutePathsConstants.PROMO_BLACK_CAT_CARD,
      alt: 'getFreeKoins',
    },
  ],
};
