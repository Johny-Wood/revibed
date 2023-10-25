/** @type {import("next-sitemap").IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_STATIC_SITE_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/personal/'],
      },
    ],
  },
  exclude: [
    '/confirm-email',
    '/unsubscribe',
    '/tg-notification-settings',
    '/cart/*',
    '/payments/*',
    '/marketplace/*',
    '/personal/*',
    '/wantlist',
    '/wantlist/plan',
    '/wantlist/releases-items',
  ],
};
