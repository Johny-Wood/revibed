import classNames from 'classnames';

import SliderSlide from '@/components/common/Slider/_components/SliderSlide';

import styles from './styles.module.scss';

function SliderItems({
  listClassNames: { listClassName, listActiveClassName, listPrevClassName, listNextClassName } = {},
  mobileType,
  id,
  slides,
  listIdx,
  activeId,
  packCount,
  titleComponent,
}) {
  let suffix = '';

  if (listIdx === activeId) {
    suffix = 'active';
  } else if (activeId === packCount - 1 && listIdx === 0) {
    suffix = 'next';
  } else if (activeId === 0 && listIdx === packCount - 1) {
    suffix = 'prev';
  } else if (listIdx < activeId) {
    suffix = 'prev';
  } else if (listIdx > activeId) {
    suffix = 'next';
  }

  return (
    <div
      className={classNames([
        styles.sliderList,
        listClassName,
        suffix === 'active' && styles.sliderList__active,
        suffix === 'active' && listActiveClassName,
        suffix === 'prev' && styles.sliderList__prev,
        suffix === 'prev' && listPrevClassName,
        suffix === 'next' && styles.sliderList__next,
        suffix === 'next' && listNextClassName,
      ])}
    >
      {slides.map((item) => (
        <SliderSlide
          key={`slider-${id}-item-${item.fileName}`}
          titleComponent={titleComponent}
          sliderId={id}
          mobileType={mobileType}
          {...item}
        />
      ))}
    </div>
  );
}

export default SliderItems;
