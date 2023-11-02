import { useCallback, useMemo } from 'react';

import classNames from 'classnames';
import chunk from 'lodash/chunk';
import cloneDeep from 'lodash/cloneDeep';

import NoResults from '@/components/common/NoResults';
import Slider from '@/components/common/Slider';
import Preloader from '@/components/ui/Preloader';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import MarketplaceListControl from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper/_components/MarketplaceListControl';
import MarketplaceListWidgetGoods from '@/pages/main-projects/MainProjectsPageWrapper/_components/MarketplaceListWidget/_components/MarketplaceListWrapper/_components/MarketplaceListWidgetGoods';

import styles from './styles.module.scss';

type MarketplaceListWrapperProps = {
  location: string;
  items: any[];
  inProcess: boolean;
};

const MarketplaceListWrapper = ({ location, items, inProcess }: MarketplaceListWrapperProps) => {
  const { isNotDesktop } = ViewportHook();

  const maxCount = !isNotDesktop ? 8 : 4;

  const itemsEnd = useMemo(
    () =>
      items.length <= maxCount
        ? chunk(items, maxCount)
        : [
            [
              ...cloneDeep(items).slice(
                (Math.ceil(items.length / maxCount) - 1) * maxCount,
                (Math.ceil(items.length / maxCount) - 1) * maxCount + maxCount
              ),
            ],
            ...chunk(items, maxCount),
            [...cloneDeep(items).slice(0, maxCount)],
          ],
    [items, maxCount]
  );

  const slideCount = itemsEnd.length;

  const renderSlide = useCallback(
    ({ list = [] }) => (
      <div className={classNames(styles.MarketplaceListWrapper__container)}>
        {list.map((item, idx) => {
          const { id } = item;

          // eslint-disable-next-line react/no-array-index-key
          return <MarketplaceListWidgetGoods key={`${location}-marketplace-item-${id}-${idx}`} item={item} />;
        })}
      </div>
    ),
    [location]
  );

  const sliderList = useMemo(
    () =>
      Array.from({ length: slideCount }, (_, i) => i).map((bannerItem) => ({
        id: `${location}-slide-${bannerItem}`,
        sliderComponent: renderSlide,
        sliderComponentProps: {
          list: itemsEnd[bannerItem],
        },
      })),
    [itemsEnd, location, renderSlide, slideCount]
  );

  return (
    <div
      className={classNames(
        styles.MarketplaceListWrapper,
        location === MarketplaceLocationsConstants.NEW_RELEASES && styles.MarketplaceListWrapper_with_bg
      )}
    >
      <MarketplaceListControl location={location} />
      <div className={styles.MarketplaceListWrapper__content}>
        {slideCount > 0 ? (
          <Slider
            id={`${location}-slider`}
            items={sliderList}
            withCount={false}
            activeSlideIdx={slideCount > 1 ? 1 : 0}
            arrowIconColor="black"
            // @ts-ignore
            customCircle
            duration={500}
            arrowIconType="normal"
            className={classNames(styles.MarketplaceListWrapper__slider)}
            arrowClassNames={{
              arrowClassName: classNames(styles.MarketplaceListWrapper__arrow),
              arrowLeftClassName: classNames(styles.MarketplaceListWrapper__arrow_left),
              arrowRightClassName: classNames(styles.MarketplaceListWrapper__arrow_right),
            }}
            listClassNames={{
              listClassName: classNames(styles.MarketplaceListWrapper__slide),
              listActiveClassName: classNames(styles.MarketplaceListWrapper__slide_active),
              listPrevClassName: classNames(styles.MarketplaceListWrapper__slide_prev),
              listNextClassName: classNames(styles.MarketplaceListWrapper__slide_next),
            }}
          />
        ) : (
          !inProcess && <NoResults minPaddings />
        )}
        <Preloader isShown={inProcess} withOffsets={false} opacity={0} />
      </div>
    </div>
  );
};

export default MarketplaceListWrapper;
