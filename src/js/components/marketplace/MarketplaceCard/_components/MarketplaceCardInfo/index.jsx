import { useMemo } from 'react';

import classNames from 'classnames';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import { DesktopLayout, MobileLayout } from '@/components/layouts/ViewportLayouts';
import MarketplaceAddToWantButton from '@/components/marketplace/MarketplaceAddToWantButton';
import MarketplaceBuyButton from '@/components/marketplace/MarketplaceBuyButton';
import MarketplaceCardInfoStatus from '@/components/marketplace/MarketplaceCard/_components/MarketplaceCardInfo/_components/MarketplaceCardInfoStatus';
import ProjectTags from '@/components/projects/Project/_components/ProjectTags';
import Button from '@/components/ui/buttons/Button';
import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';
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
    tags = [],
    release: { covers: releaseCovers, artists } = {},
    covers = releaseCovers,
    price,
    preview,
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
          disabled={!purchaseAvailable && !isGoodsInCart}
          styleProps={{
            className: styles.marketplaceCardInfo__buyButton,
          }}
        >
          {(purchaseAvailable || isGoodsInCart) && (
            <span className={classNames(styles.marketplaceCardInfo__buyPrice, 'not-hide')}>
              <Coin afterText={floatWithCommaFixedUtil(price)} />
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
  }, [id, inCart, isCanBuy, isGoodsInCart, isOnlyTracks, isPreOrder, isPurchased, marketplaceCardId, price, purchaseAvailable]);

  return (
    <div className={classNames([styles.marketplaceCardInfo, isPreOrder && styles.marketplaceCardInfo_preorder])}>
      <div className={styles.marketplaceCardInfo__main}>
        <MobileLayout>
          <MarketplaceCardInfoStatus isPreOrder={isPreOrder} />
        </MobileLayout>
        <Cover
          covers={covers}
          preview={preview}
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
            This release has recently been digitised and is&nbsp;currently only available to&nbsp;those who joined the Pre-order.
            It&nbsp;will become available through the {CommonHeadConstants.SITE_NAME} catalogue soon. Click <b>Notify me</b>{' '}
            to&nbsp;receive an&nbsp;update when the music can be&nbsp;purchased.
          </div>
        </>
      )}
      <div className={styles.marketplaceCardInfo__footer}>
        <div className={styles.marketplaceCardInfo__value}>
          <b>Format:</b> FLAC / 44.1kHz · 16bit
        </div>
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
