import { useMemo } from 'react';

import classNames from 'classnames';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import MarketplaceAddToWantButton from '@/components/marketplace/MarketplaceAddToWantButton';
import MarketplaceBuyButton from '@/components/marketplace/MarketplaceBuyButton';
import MarketplaceCardInfoStatus from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardInfo/_components/MarketplaceCardInfoStatus';
import ProjectFormats from '@/components/projects/Project/_components/ProjectFormats';
import ProjectTags from '@/components/projects/Project/_components/ProjectTags';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { MarketplaceCardStatusHook } from '@/hooks/marketplace/MarketplaceCardStatusHook';
import { createProjectUrlUtil } from '@/utils/project/projectUrlUtil';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function MarketplaceCardInfo({
  marketplaceCardId,
  info,
  info: {
    id,
    purchaseAvailable,
    inWishlist,
    wantCount,
    inCart,
    projectId,
    title,
    name,
    target: { tracksGoods = [] } = {},
    release: { tracks = [], covers: releaseCovers, artists, tags = [], formats = [] } = {},
    covers = releaseCovers,
    mediaCondition,
    price,
  },
}) {
  const { isPreOrder, isPurchased, isOnlyTracks, isGoodsInCart, isCanBuy } = MarketplaceCardStatusHook(info);

  const renderControlButton = useMemo(() => {
    if (isPurchased) {
      return <Button className={styles.marketplaceCardInfo__purchasedButton} text="Purchased" disabled />;
    }

    if (isCanBuy || inCart) {
      return (
        <MarketplaceBuyButton
          inCart={isGoodsInCart}
          goodsId={id}
          targetType="ALBUM"
          marketplaceCardId={marketplaceCardId}
          tracksGoods={tracksGoods}
          tracks={tracks}
          disabled={!purchaseAvailable && !isGoodsInCart}
          styleProps={{
            className: styles.marketplaceCardInfo__buyButton,
          }}
        >
          {(purchaseAvailable || isGoodsInCart) && (
            <span className={classNames(styles.marketplaceCardInfo__buyPrice, 'not-hide')}>
              <Coin size={14} color="white">
                {floatWithCommaFixedUtil(price)}
              </Coin>
            </span>
          )}
        </MarketplaceBuyButton>
      );
    }

    if (isPreOrder && !inCart) {
      return null;
    }

    if (isOnlyTracks && !inCart) {
      return <Button className={styles.marketplaceCardInfo__buyButton} text="Only tracks" disabled={!purchaseAvailable} />;
    }

    return null;
  }, [
    id,
    inCart,
    isCanBuy,
    isGoodsInCart,
    isOnlyTracks,
    isPreOrder,
    isPurchased,
    marketplaceCardId,
    price,
    purchaseAvailable,
    tracks,
    tracksGoods,
  ]);

  return (
    <div className={classNames([styles.marketplaceCardInfo, isPreOrder && styles.marketplaceCardInfo_preorder])}>
      <div className={styles.marketplaceCardInfo__main}>
        <MobileLayout>
          <MarketplaceCardInfoStatus isPreOrder={isPreOrder} />
        </MobileLayout>
        <Cover
          covers={covers}
          withImageLiteBox={covers && covers.length > 0}
          isDefault={!covers || !covers.length > 0}
          className={styles.projectCover}
          size={207}
        />
        <div className={styles.marketplaceCardInfo__details}>
          <DesktopLayout>
            <MarketplaceCardInfoStatus isPreOrder={isPreOrder} />
          </DesktopLayout>
          <Names
            className={styles.projectNames}
            titlesClassName={styles.projectNames__titles}
            artists={artists}
            albumTitle={name}
            isRoute={false}
          />
          {tags.length > 0 && <ProjectTags className={styles.projectTags} tags={tags} widthTooltip={450} />}
          <div className={classNames(styles.marketplaceCardInfo__buyButtons, 'f-y-center')}>
            {!isPreOrder ? (
              <div className="f-y-center">{renderControlButton}</div>
            ) : (
              <div className="f-y-center">
                <MarketplaceAddToWantButton id={id} inWishlist={inWishlist} />
              </div>
            )}
          </div>
        </div>
      </div>
      {isPreOrder && (
        <>
          <div className={styles.marketplaceCardInfo__wanted}>
            <b>Wanted:</b> {wantCount}
          </div>
          <div className={styles.marketplaceCardInfo__wait__owner}>
            We&nbsp;are currently locating the copyright owner of&nbsp;this wonderful piece of&nbsp;music before we&nbsp;can add
            it&nbsp;to&nbsp;our marketplace. Click <b>Notify me</b> to&nbsp;be&nbsp;notified as&nbsp;soon as&nbsp;digital copies
            of&nbsp;this release are available for purchase in&nbsp;audiophile quality.
          </div>
        </>
      )}
      <div className={styles.marketplaceCardInfo__footer}>
        <div className={styles.marketplaceCardInfo__value}>
          <b>Quality:</b> FLAC / 192kHz · 24bit
        </div>
        {(!!mediaCondition || formats.length > 0) && (
          <div className={styles.marketplaceCardInfo__value}>
            <b>Source:</b>
            &nbsp;
            {formats.length > 0 && (
              <>
                <ProjectFormats items={formats} />
                &nbsp;/&nbsp;
              </>
            )}
            {!!mediaCondition && `${mediaCondition.title} (${mediaCondition.shortTitle})`}
          </div>
        )}
        {!!projectId && (
          <LinkRoute
            className={classNames(styles.marketplaceCardInfo__value, 'underline')}
            href={createProjectUrlUtil(projectId, title)}
            text="Pre-order"
          />
        )}
      </div>
    </div>
  );
}

export default MarketplaceCardInfo;
