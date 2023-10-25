import { forwardRef } from 'react';

import classNames from 'classnames';

import styles from './styles.module.scss';

const AboutUsSection = forwardRef(({ className = '', isColumn, children }, ref) => (
  <div ref={ref} className={classNames([styles.aboutUsSection, isColumn && styles.aboutUsSection__column, className])}>
    <div className={styles.aboutUsSection__wrapper}>{children}</div>
  </div>
));

AboutUsSection.displayName = 'AboutUsSection';

export default AboutUsSection;
