const PERSONAL_GROUP = '/personal';
const WANTLIST_GROUP = '/wantlist';
const USERS_GROUP = '/users';
const PERSONAL_SETTINGS = `${PERSONAL_GROUP}/settings`;
const PERSONAL_NOTIFICATIONS_SETTINGS = `${PERSONAL_SETTINGS}/notifications`;

export const RoutePathsConstants = {
  MAIN: '/',
  MAIN_MARKETPLACE_NEW_RELEASES: '/?tab=new-releases',
  MAIN_MARKETPLACE_COMING_SOON: '/?tab=coming-soon',
  FEED: '/feed',
  NEWS: '/news',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  REFERRAL: '/signup/invite',
  RESET_PASSWORD: '/reset-password',
  CONFIRM_EMAIL: '/confirm-email',
  UNSUBSCRIBE: '/unsubscribe',

  CART: '/cart',

  MARKETPLACE: '/marketplace',
  MARKETPLACE_ITEM: '/marketplace/%X',

  HOT_OFFERS: '/hot-offers',

  PROJECTS: '/music-legacy-pre-orders',
  PROJECT: '/music-legacy-pre-orders/%X',

  WANTLIST: WANTLIST_GROUP,
  WANTLIST_ADD: `${WANTLIST_GROUP}/add`,
  WANTLIST_PLAN: `${WANTLIST_GROUP}/plan`,
  WANTLIST_RELEASES_ITEMS: `${WANTLIST_GROUP}/releases-items`,

  PERSONAL: PERSONAL_GROUP,

  RIPPER: `${PERSONAL_GROUP}/ripper`,

  DRAFTS_ADD: `${PERSONAL_GROUP}/drafts/add`,

  MY_PROJECTS: `${PERSONAL_GROUP}/pre-orders`,
  MY_PROJECTS_EDIT: `${PERSONAL_GROUP}/drafts/edit`,

  STATISTICS: `${PERSONAL_GROUP}/statistics`,
  PERSONAL_SETTINGS,
  PERSONAL_PURCHASES: `${PERSONAL_GROUP}/purchases`,
  PERSONAL_PURCHASE: `${PERSONAL_GROUP}/purchases/%X`,
  PERSONAL_TELEGRAM_SETTINGS: `${PERSONAL_SETTINGS}/telegram-bot`,
  PERSONAL_WANTLIST_SETTINGS: `${PERSONAL_SETTINGS}/wantlist`,
  PERSONAL_NOTIFICATIONS_SETTINGS,
  PERSONAL_NOTIFICATIONS_EMAIL_SETTINGS: `${PERSONAL_NOTIFICATIONS_SETTINGS}/email`,
  PERSONAL_NOTIFICATIONS_TELEGRAM_SETTINGS: `${PERSONAL_NOTIFICATIONS_SETTINGS}/telegram-bot`,
  CONTACT_ADMIN: `${PERSONAL_GROUP}/contact-admin`,
  FOLLOWERS: `${PERSONAL_GROUP}/followers`,
  FOLLOWING: `${PERSONAL_GROUP}/following`,

  BALANCE_MAIN: `${PERSONAL_GROUP}/balance`,
  BALANCE: `${PERSONAL_GROUP}/balance/history`,
  INVITES: `${PERSONAL_GROUP}/invites`,
  USER_NOTIFICATIONS: `${PERSONAL_GROUP}/notifications`,
  WITHDRAW: `${PERSONAL_GROUP}/balance/withdraw`,
  CASHBACK: `${PERSONAL_GROUP}/balance/cashback`,
  TOP_UP_BALANCE: `${PERSONAL_GROUP}/balance/top-up`,

  USER_PROJECTS: `${USERS_GROUP}/%X/pre-orders`,
  USER_FOLLOWING: `${USERS_GROUP}/%X/following`,
  USER_FOLLOWERS: `${USERS_GROUP}/%X/followers`,

  RELEASE: '/release/%X',
  RELEASE_AVAILABLE: '/release/%X/available',

  FAQ: '/faq',
  FAQ_PROJECT_ARTIST_FUND: '/faq/pre-order-artist-fund',
  GOLDEN_COIN_DETAILS: '/faq/what-is-the-golden-koin',
  FAQ_CROWDFUNDING_PROJECTS: '/faq/crowdfunding-pre-orders',
  CONTACT_US: '/contact-us',
  RIGHTSHOLDERS: '/rightsholders',
  RIGHTSHOLDERS_FORM: '/rightsholders/form',
  HOW_IT_WORKS: '/how-it-works-music-digitisation-crowdfunding',
  ABOUT_US: '/about-revibed',
  WANTLIST_TOOL: '/wantlist-tool-for-records-wanted',

  COOKIES_POLICY: '/cookies-policy',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_USE: '/terms-of-use',

  PROMO_BLACK_CAT_CARD: '/blackcatpromo',
  COMMON_TELEGRAM_NOTIFICATIONS_SETTINGS: '/tg-notification-settings',

  BLOG: '/blog',
  BLOG_ITEM: '/blog/%X',
};
