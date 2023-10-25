import classNames from 'classnames';

import Logo from '@/components/primary/Logo';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { CommonHeadConstants } from '@/constants/common/head';

import styles from './styles.module.scss';

function LandingHeaderLogo({ color }) {
  return (
    <LinkRoute href="/" title={CommonHeadConstants.SITE_NAME} className={classNames([styles.landingHeaderLogo])}>
      <Logo color={color} />
    </LinkRoute>
  );
}

export default LandingHeaderLogo;
