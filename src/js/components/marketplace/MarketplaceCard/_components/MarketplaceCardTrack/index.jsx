import { useEffect, useRef } from 'react';

import classNames from 'classnames';

import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import MarketplaceBuyButton from '@/components/marketplace/MarketplaceBuyButton';
import PlayerPlayPauseButton from '@/components/player/control/PlayerPlayPauseButton';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ScrollService from '@/services/scroll/ScrollService';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function MarketplaceCardTrack({
  marketplaceCardId,
  trackId,
  idx,
  title,
  duration,
  inCart,
  copyrightHoldersPresent,
  purchaseAvailable,
  albumAlreadyPurchased,
  alreadyPurchased,
  price,
  isActive,
  preOrder,
  preview,
  playingTrackId,
  playingTime,
  isPlaying,
  activePlayingTrack: { id: activePlayingTrackId } = {},
  onPlay,
  onPause,
}) {
  const trackRef = useRef(null);
  const canBuy = copyrightHoldersPresent && purchaseAvailable;
  const purchased = alreadyPurchased || albumAlreadyPurchased;
  const isOnlyAlbum = !purchased && !purchaseAvailable && !canBuy;

  useEffect(() => {
    if (isActive) {
      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL).addSection(
        `${ScrollBlockIdConstants.MARKETPLACE_TRACK_ID}-${trackId}`,
        RoutePathsConstants.MARKETPLACE_ITEM,
        trackRef
      );

      ScrollService.getInstance(CommonScrollbarLocationsConstants.MAIN_SCROLL)
        .scrollToElement({
          sectionId: `${ScrollBlockIdConstants.MARKETPLACE_TRACK_ID}-${trackId}`,
          inRoute: true,
          secondOffset: 300,
        })
        .then();
    }
  }, [isActive, trackId]);

  return (
    <div
      ref={trackRef}
      className={classNames([
        styles.marketplaceCardTrack,
        isActive && styles.marketplaceCardTrack_active,
        playingTrackId === activePlayingTrackId && styles.marketplaceCardTrack_playing,
      ])}
    >
      <div className={styles.marketplaceCardTrack__content}>
        <div className={classNames(styles.marketplaceCardTrack__info, styles.marketplaceCardTrack__play)}>
          {!!preview && (
            <PlayerPlayPauseButton
              isPlaying={isPlaying && playingTrackId === activePlayingTrackId}
              playingTime={playingTrackId === activePlayingTrackId ? playingTime : 0}
              onClickPlay={() => {
                onPlay({ id: playingTrackId, src: preview });
              }}
              onClickPause={onPause}
              className={styles.startPlayVideo}
            />
          )}
        </div>
        <div className={classNames(styles.marketplaceCardTrack__info, styles.marketplaceCardTrack__name)}>
          <span className={classNames(styles.marketplaceCardTrack__name__name)}>
            {idx + 1}.&nbsp;{title}
            {duration && (
              <DesktopLayout>
                <span className={classNames(styles.marketplaceCardTrack__duration)}>&nbsp;{duration}</span>
              </DesktopLayout>
            )}
          </span>
        </div>
        <DesktopLayout>
          <div className={classNames(styles.marketplaceCardTrack__info, styles.marketplaceCardTrack__quality)}>
            44.1kHz · 16bit
          </div>
        </DesktopLayout>
        <div className={classNames(styles.marketplaceCardTrack__info, styles.marketplaceCardTrack__price)}>
          {!preOrder && price && (!isOnlyAlbum || inCart) && (
            <Coin className="t-medium" afterText={floatWithCommaFixedUtil(price)} />
          )}
        </div>
        <div className={classNames(styles.marketplaceCardTrack__info, styles.marketplaceCardTrack__buy)}>
          {!preOrder && (
            <>
              {isOnlyAlbum && !inCart && <span className="c-red">Only album</span>}
              {purchased && (
                <Button
                  text="Purchased"
                  transparent
                  size={ComponentsCommonConstants.Size.SMALL35}
                  borderColor="gray-4"
                  disabled
                />
              )}
              {!purchased && (purchaseAvailable || inCart) && (inCart || (canBuy && purchaseAvailable)) && (
                <MarketplaceBuyButton
                  inCart={inCart}
                  goodsId={trackId}
                  marketplaceCardId={marketplaceCardId}
                  styleProps={{
                    size: ComponentsCommonConstants.Size.SMALL35,
                    borderColor: 'gray-3',
                    transparent: true,
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketplaceCardTrack;
