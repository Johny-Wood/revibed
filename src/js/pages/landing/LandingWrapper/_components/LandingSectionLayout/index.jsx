import { forwardRef } from 'react';

import classNames from 'classnames';
import parse from 'html-react-parser';

import styles from './styles.module.scss';

const LandingSectionLayout = forwardRef(({ className, name, title, height, titleStyle = {}, children }, ref) => (
  <section ref={ref} className={classNames(styles.landingSection, name)} style={{ minHeight: height }}>
    <div className={classNames([styles.landingSection__wrapper, className])}>
      {!!title && (
        <div className={styles.landingSection__title} style={titleStyle}>
          {parse(title)}
        </div>
      )}
      <div className={styles.landingSection__content}>{children}</div>
    </div>
  </section>
));

LandingSectionLayout.displayName = 'LandingSectionLayout';

export default LandingSectionLayout;
