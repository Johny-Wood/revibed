import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import ScrollbarLayout from '@/components/layouts/ScrollbarLayout';
import CartNoItems from '@/components/marketplace/cart/CartNoItems';
import CartTotal from '@/components/marketplace/cart/CartTotal';
import CartTracksCount from '@/components/marketplace/cart/CartTracksCount';
import MarketplaceRemoveButton from '@/components/marketplace/MarketplaceRemoveButton';
import Coin from '@/components/ui/currency/Coin';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import { floatWithCommaFixedUtil, parseReplaceTextUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

function CartControlContent({ goods = [], goodsCount = 0 }) {
  return (
    <div className={styles.cartControl__content}>
      {goods.length > 0 ? (
        <ScrollbarLayout maxHeight={`calc((1rem * ${72 * 3.5} / var(--font-size__small-int))`} contentLength={goods.length}>
          <div className={styles.cartControl__items}>
            {goods.map(
              ({
                id,
                targetType,
                rootGoodsId,
                name,
                price,
                purchaseAvailable,
                release: { covers: releaseCovers = [], artists = [] } = {},
                target: { tracksGoods = [], trackId } = {},
                covers = releaseCovers,
              }) => {
                const count = tracksGoods.length || 1;
                const href = {
                  pathname: parseReplaceTextUtil(RoutePathsConstants.MARKETPLACE_ITEM, rootGoodsId || id),
                  query: targetType === 'TRACK' ? { track: trackId } : {},
                };

                return (
                  <div key={`cart-preview-${id}`} className={styles.cartControl__item}>
                    <span className="f-y-start">
                      <Cover
                        className={styles.projectCover}
                        containerClassName={styles.projectCoverContainer}
                        covers={covers}
                        projectId={id}
                        href={href}
                        size={50}
                      />
                      <div className="f_direction_column">
                        <Names
                          className={styles.projectNames}
                          titleClassName={styles.projectNames__title}
                          albumClassName={styles.projectNames__album__title}
                          artists={artists}
                          albumTitle={name}
                          href={href}
                        />
                        <CartTracksCount count={count} className="text_size_12" />
                      </div>
                    </span>
                    <MarketplaceRemoveButton
                      goodsId={id}
                      marketplaceCardId={rootGoodsId || id}
                      targetType={targetType}
                      className={styles.marketplaceGoods__remove}
                    />
                    {!purchaseAvailable ? (
                      <span className="c-last-call text_size_12">Unavailable</span>
                    ) : (
                      <b>
                        <Coin afterText={floatWithCommaFixedUtil(price)} />
                      </b>
                    )}
                  </div>
                );
              }
            )}
            {goods.length > 0 && goods.length < goodsCount && (
              <div className={styles.cartControl__item}>
                <div className="c-gray-2 t-center w-100pct">
                  +{goodsCount - goods.length} {textForLotsOfUtil(goodsCount - goods.length, ['item', 'items'])}
                </div>
              </div>
            )}
          </div>
        </ScrollbarLayout>
      ) : (
        <CartNoItems className={styles.cartControl__noItems} />
      )}
      {goods.length > 0 && (
        <div className={styles.cartControl__footer}>
          <CartTotal className={styles.cartTotal} descriptionClassName={styles.cartTotal__description} withCount />
          <LinkRoute
            href={RoutePathsConstants.CART}
            type="button"
            text="View cart"
            className="w-100pct m-top-20"
            transparent
            borderColor="gray-3"
            size="small-45"
          />
        </div>
      )}
    </div>
  );
}

export default CartControlContent;
