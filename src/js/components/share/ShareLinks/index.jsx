import classNames from 'classnames';
import copy from 'copy-to-clipboard';

import ButtonIcon from '@/components/ui/buttons/ButtonIcon';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import CopyLinkIcon from '@/icons/CopyLinkIcon';
import FacebookLogo from '@/icons/social/FacebookLogo';
import MonoChromeFacebookLogo from '@/icons/social/monochrome/FacebookLogo';
import MonoChromeTelegramLogo from '@/icons/social/monochrome/TelegramLogo';
import MonoChromeTwitterLogo from '@/icons/social/monochrome/TwitterLogo';
import TelegramLogo from '@/icons/social/TelegramLogo';
import TwitterLogo from '@/icons/social/TwitterLogo';

import styles from './styles.module.scss';

const WINDOW_WIDTH = 626;
const WINDOW_HEIGHT = 436;

const SHARE_LINKS = [
  {
    id: 'facebook',
    name: 'Facebook',
    link: ({ href }) =>
      process.env.NEXT_STATIC_SOCIAL_FACEBOOK_APP_ID
        ? `https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&sdk=joey&u=${href}&app_id=${process.env.NEXT_STATIC_SOCIAL_FACEBOOK_APP_ID}`
        : `https://www.facebook.com/sharer/sharer.php?u=${href}`,
    target: 'popup',
    features: `width=${WINDOW_WIDTH}, height=${WINDOW_HEIGHT}`,
    icon: FacebookLogo,
    monoChromeIcon: MonoChromeFacebookLogo,
  },
  {
    id: 'twitter',
    name: 'Twitter',
    link: ({ href }) => `https://www.twitter.com/share?&url=${href}`,
    icon: TwitterLogo,
    monoChromeIcon: MonoChromeTwitterLogo,
  },
  {
    id: 'telegram',
    name: 'Telegram',
    link: ({ href }) => `https://telegram.me/share/url?&url=${href}`,
    icon: TelegramLogo,
    monoChromeIcon: MonoChromeTelegramLogo,
  },
  {
    id: 'copyLink',
    name: 'Copy link',
    onClick: ({ href }) => {
      copy(href);
    },
    icon: CopyLinkIcon,
    type: 'copy',
  },
];

function ShareLinks({
  className,
  linkClassName,
  href = '',
  links = SHARE_LINKS,
  withCopyLink = false,
  withNames = true,
  monoChromeIcons,
}) {
  const { width, height } = ViewportHook();

  return (
    <div className={classNames(styles.socLinks, className)}>
      {links.map(
        ({
          id,
          name,
          link = () => {},
          onClick = () => {},
          disabled,
          icon,
          monoChromeIcon,
          target = '_blank',
          features = '',
          type = 'link',
        }) => {
          const key = `share-link_${id}`;

          if (!withCopyLink && type === 'copy') {
            return null;
          }

          return (
            <ButtonIcon
              type="button_string"
              key={key}
              className={classNames([styles.socLinks__shareLink, linkClassName, `share-link_${id}`])}
              disabled={disabled}
              icon={monoChromeIcons ? monoChromeIcon || icon : icon}
              text={withNames ? name : ''}
              onClick={() => {
                onClick({ href });

                if (type === 'link') {
                  window.open(
                    link({ href }),
                    target,
                    target !== '_blank' ? `${features}, top=${(height / 2) * 0.4}, left=${width / 2 - WINDOW_WIDTH / 2}` : null
                  );
                }
              }}
            />
          );
        }
      )}
    </div>
  );
}

export default ShareLinks;
