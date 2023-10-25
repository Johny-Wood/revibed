import classNames from 'classnames';

import Button from '@/components/ui/buttons/Button';
import ArrowBigIcon from '@/icons/arrows/ArrowBigIcon';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

const renderIcon = ({ type, color, isNext }) => {
  if (type === 'big') {
    return <ArrowBigIcon color={color} />;
  }

  return <ArrowIcon className={isNext ? 'rotate-90' : 'rotate-90-minus'} color={color} />;
};

function SliderControls({
  arrowClassNames: { arrowClassName, arrowLeftClassName, arrowRightClassName } = {},
  mobileType,
  arrowIconColor,
  arrowIconType = 'big',
  prev,
  next,
}) {
  return (
    <>
      <Button
        className={classNames([
          styles.sliderArrow,
          mobileType && styles.sliderArrow_mobile,
          arrowClassName,
          styles.sliderArrow__left,
          mobileType && styles.sliderArrow__left_mobile,
          arrowLeftClassName,
        ])}
        type="button_string"
        aria-label="Prev"
        onClick={prev}
      >
        {renderIcon({
          type: arrowIconType,
          color: arrowIconColor,
          isNext: false,
        })}
      </Button>
      <Button
        className={classNames([
          styles.sliderArrow,
          mobileType && styles.sliderArrow_mobile,
          arrowClassName,
          styles.sliderArrow__right,
          mobileType && styles.sliderArrow__right_mobile,
          arrowRightClassName,
        ])}
        type="button_string"
        aria-label="Next"
        onClick={next}
      >
        {renderIcon({
          type: arrowIconType,
          color: arrowIconColor,
          isNext: true,
        })}
      </Button>
    </>
  );
}

export default SliderControls;
