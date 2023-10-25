import classNames from 'classnames';
import Image from 'next/image';

import DiscogsLogoImg from './discogs-logo.png';
import styles from './styles.module.scss';

function DiscogsLogoIcon() {
  return (
    <span className={classNames(['icon', styles.discogsLogo])}>
      <Image
        src={DiscogsLogoImg.src}
        blurDataURL={DiscogsLogoImg.blurDataURL}
        placeholder="blur"
        width={65}
        height={24}
        alt="discogs"
      />
    </span>
  );
}

export default DiscogsLogoIcon;
