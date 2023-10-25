import classNames from 'classnames';

import styles from './styles.module.scss';

const renderImg = ({ path, alt = 'slider-img' }) => (
  <picture>
    <source srcSet={path} />
    <img src={path} alt={alt} loading="lazy" />
  </picture>
);

function SliderSlide({
  mobileType,
  link,
  path,
  alt,
  title,
  sliderComponent: SliderComponent,
  sliderComponentProps = {},
  titleComponent: TitleComponent,
}) {
  if (SliderComponent) {
    return <SliderComponent {...sliderComponentProps} />;
  }

  if (link) {
    return (
      <a
        className={classNames([styles.sliderItem, mobileType && styles.sliderItem_mobile])}
        href={link}
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        {renderImg({ path, alt })}
      </a>
    );
  }

  return (
    <div className={classNames([styles.sliderItem, mobileType && styles.sliderItem_mobile])}>
      {!!path && renderImg({ path, alt })}
      {title && TitleComponent && <TitleComponent {...title} />}
    </div>
  );
}

export default SliderSlide;
