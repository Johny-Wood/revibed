import { memo, useMemo } from 'react';

import classNames from 'classnames';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import TransitionSwitchLayout from '@/components/layouts/TransitionLayouts/TransitionSwitchLayout';
import MarketplaceBuyButton from '@/components/marketplace/MarketplaceBuyButton';
import PlayerPlayPauseButton from '@/components/player/control/PlayerPlayPauseButton';
import ProjectCutSize from '@/components/projects/Project/_components/ProjectCutSize';
import { CommonMessagesConstants } from '@/constants/common/message';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { MarketplaceCardStatusHook } from '@/hooks/marketplace/MarketplaceCardStatusHook';
import { parseReplaceTextUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const MarketplaceGoods = memo(
  ({
    item,
    item: {
      inCart,
      id,
      price,
      name,
      target: { tracksGoods = [] } = {},
      release: { covers: releaseCovers, artists, tracks = [] } = {},
      covers = releaseCovers,
    } = {},
    itemRestProps: { playList: itemPlaylist = () => [] } = {},
    itemInnerProps: {
      playButton: { activePlayingItemId, isPlaying, playingTime, playList, onClickPlay, ...playButtonProps } = {},
    } = {},

    coverSize = 165,

    className,
    coverClassName,
    coverContainerClassName,
    namesClassName,
    titleClassName,
    albumTitleClassName,
    footerClassName,
    cutSizeClassName,
  }) => {
    const href = useMemo(() => parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, id), [id]);

    const { isPreOrder, isPurchased, isCanBuy, isOnlyTracks } = MarketplaceCardStatusHook(item);

    const buttonConfig = useMemo(
      () => ({
        type: 'button_string',
        className: styles.marketplaceGoods__button,
      }),
      []
    );

    const labelConfig = useMemo(
      () => ({
        className: styles.marketplaceGoods__label,
      }),
      []
    );

    const renderControlButton = useMemo(() => {
      if (isPurchased) {
        return <span {...labelConfig}>Purchased</span>;
      }

      if (isCanBuy || inCart) {
        return (
          <MarketplaceBuyButton
            goodsId={id}
            marketplaceCardId={id}
            inCart={inCart}
            tracksGoods={tracksGoods}
            tracks={tracks}
            styleProps={buttonConfig}
            targetType="ALBUM"
          />
        );
      }

      if (isPreOrder && !inCart) {
        return <span {...labelConfig}>{CommonMessagesConstants.COMING_SOON}</span>;
      }

      if (isOnlyTracks && !inCart) {
        return <span {...labelConfig}>Only tracks</span>;
      }

      return null;
    }, [buttonConfig, id, inCart, isCanBuy, isOnlyTracks, isPreOrder, isPurchased, labelConfig, tracks, tracksGoods]);

    return (
      <div className={classNames(styles.marketplaceGoods, className)}>
        <Cover
          covers={covers}
          projectId={id}
          href={href}
          withPlayVideo
          playButton={{
            component: PlayerPlayPauseButton,
            playList,
            isPlaying: isPlaying && id === activePlayingItemId,
            playingTime: id === activePlayingItemId ? playingTime : 0,
            onClickPlay: () => {
              if (itemPlaylist(id).length === 0) {
                return;
              }

              const { id: itemPlaylistId, src: itemPlaylistSrc } = itemPlaylist(id)[0];

              onClickPlay({ id: itemPlaylistId, src: itemPlaylistSrc }, id);
            },
            ...playButtonProps,
          }}
          withPlayDisabled={tracksGoods.length === 0}
          className={classNames(styles.projectCover, coverClassName)}
          containerClassName={classNames(styles.projectCoverContainer, coverContainerClassName)}
          size={coverSize}
        />
        <Names
          className={classNames(styles.projectNames, namesClassName)}
          titleClassName={classNames(styles.projectNames__title, titleClassName)}
          albumClassName={classNames(styles.projectNames__album__title, albumTitleClassName)}
          projectId={id}
          artists={artists}
          albumTitle={name}
          href={href}
          isRoute
        />
        <div className={classNames(styles.marketplaceGoods__footer, footerClassName)}>
          {renderControlButton}
          <TransitionSwitchLayout isShown={!isPreOrder && !isOnlyTracks && !isPurchased}>
            <ProjectCutSize className={classNames(styles.projectCutSize, cutSizeClassName)} size={price} />
          </TransitionSwitchLayout>
        </div>
      </div>
    );
  }
);

export default MarketplaceGoods;
