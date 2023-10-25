import { useMemo } from 'react';

import classNames from 'classnames';
import Image from 'next/image';

import Coin from '@/components/ui/currency/Coin';
import MyAvatar from '@/components/user/MyAvatar';
import UserAvatar from '@/components/user/UserAvatar';
import ViewportHook from '@/hooks/viewport/ViewportHook';

import referralAvatar1 from './_media/referral_avatar_1.png';
import referralAvatar2 from './_media/referral_avatar_2.png';
import referralAvatar3 from './_media/referral_avatar_3.png';
import worldMapIcon from './_media/worldMapIcon.png';
import WorldPath from './_media/WorldPath';
import styles from './styles.module.scss';

function ReferralBanner() {
  const { isNotDesktop } = ViewportHook();

  const myAvatarSize = useMemo(() => (!isNotDesktop ? 80 : 60), [isNotDesktop]);
  const avatarSize = useMemo(() => (!isNotDesktop ? 50 : 40), [isNotDesktop]);
  const coinSize = useMemo(() => (!isNotDesktop ? 18 : 15), [isNotDesktop]);
  const pathSize = useMemo(() => (!isNotDesktop ? 50 : 40), [isNotDesktop]);

  return (
    <div className={styles.referralMap}>
      <div className={styles.referralMap__img}>
        <Image
          src={worldMapIcon.src}
          blurDataURL={worldMapIcon.blurDataURL}
          placeholder="blur"
          alt="worldMapIcon"
          fill
          priority
          sizes="471"
        />
      </div>
      <div className={styles.referralMap__pathes}>
        <WorldPath size={pathSize} className={classNames(styles.referralMap__path, styles.referralMap__path_1)} />
        <WorldPath size={pathSize} className={classNames(styles.referralMap__path, styles.referralMap__path_2)} />
        <WorldPath size={pathSize} className={classNames(styles.referralMap__path, styles.referralMap__path_3)} />
        <MyAvatar size={myAvatarSize} className={classNames(styles.referralMap__avatar, styles.referralMap__avatar_my)} />
        <UserAvatar
          size={avatarSize}
          localSrc={referralAvatar1}
          className={classNames(styles.referralMap__avatar, styles.referralMap__avatar_1)}
        />
        <UserAvatar
          size={avatarSize}
          localSrc={referralAvatar2}
          className={classNames(styles.referralMap__avatar, styles.referralMap__avatar_2)}
        />
        <UserAvatar
          size={avatarSize}
          localSrc={referralAvatar3}
          className={classNames(styles.referralMap__avatar, styles.referralMap__avatar_3)}
        />
        <Coin size={coinSize} className={classNames(styles.referralMap__coin, styles.referralMap__coin_1)} />
        <Coin size={coinSize} className={classNames(styles.referralMap__coin, styles.referralMap__coin_2)} />
        <Coin size={coinSize} className={classNames(styles.referralMap__coin, styles.referralMap__coin_3)} />
      </div>
    </div>
  );
}

export default ReferralBanner;
