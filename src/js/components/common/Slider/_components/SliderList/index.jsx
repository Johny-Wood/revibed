import SliderItems from '@/components/common/Slider/_components/SliderItems';
import { listPartitionUtil } from '@/utils/listUtils';

import styles from './styles.module.scss';

function SliderList({
  listClassNames,
  mobileType,
  id,
  activeId,
  items,
  titleComponent,
  isSmallMobile,
  itemsOnPack,
  itemWidth,
  packCount,
}) {
  const averageListWidth = itemWidth * itemsOnPack;
  const position = isSmallMobile ? -averageListWidth * activeId : 0;

  return (
    <div className={styles.sliderWrapper} style={{ transform: `translate(${position}px, 0px)` }}>
      {listPartitionUtil(items, itemsOnPack).map((slides, idx) => (
        <SliderItems
          // eslint-disable-next-line react/no-array-index-key
          key={`${id}-row-${idx}`}
          sliderId={id}
          mobileType={mobileType}
          titleComponent={titleComponent}
          slides={slides}
          activeId={activeId}
          listIdx={idx}
          packCount={packCount}
          listClassNames={listClassNames}
        />
      ))}
    </div>
  );
}

export default SliderList;
