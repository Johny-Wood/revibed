import classNames from 'classnames';
import range from 'lodash/range';

import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

function SliderCounter({ controlsClassName, mobileType, id, className, controlClassName, items, count, button, activeId }) {
  return (
    <div
      className={classNames([styles.sliderControls, mobileType && styles.sliderControls_mobile, controlsClassName, className])}
    >
      {range(count).map((number) => {
        const key = `slider-${id}-indicator-${number}`;
        const active = activeId === number;

        if (!active) {
          return null;
        }

        return (
          <div key={key} className={classNames([controlClassName])}>
            <span>
              {number + 1}
              &nbsp;/&nbsp;
              {items.length}
            </span>
          </div>
        );
      })}
      {!!button && <LinkRoute {...button} />}
    </div>
  );
}

export default SliderCounter;
