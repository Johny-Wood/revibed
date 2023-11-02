import SliderItems from '@/components/common/Slider/_components/SliderItems';
import { listPartitionUtil } from '@/utils/listUtils';

import styles from './styles.module.scss';

function SliderList({
  duration = 0,
  inProcessCircle,
  customCircle,
  listClassNames,
  mobileType,
  id,
  activeId,
  items,
  titleComponent,
  itemsOnPack,
  packCount,
}) {
  const position = 100 * -activeId;

  return (
    <div
      className={styles.sliderWrapper}
      style={{
        transition: customCircle && !inProcessCircle ? `transform ${duration}ms ease` : 'none',
        transform: customCircle ? `translate(${position}%, 0%)` : undefined,
      }}
    >
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
