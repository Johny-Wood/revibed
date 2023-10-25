import classNames from 'classnames';

import MainPageDecorations from '@/components/common/MainPageDecorations';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

function MainSlider() {
  return (
    <div className={classNames(styles.mainSlider)}>
      <MainPageDecorations />
      <div className={styles.mainSlider__content}>
        <h1 className={styles.mainSlider__title}>
          <b>Discover some of&nbsp;the most forgotten and wanted vinyl records, CDs &amp;&nbsp;Cassette Tapes of&nbsp;all time</b>
        </h1>
        <p className={styles.mainSlider__description}>
          Rediscover some of&nbsp;the most forgotten and wanted music records of&nbsp;all time and support the original artists.
          Welcome to&nbsp;the most innovative tool to&nbsp;collect rare music.
        </p>
        <div className={styles.mainSlider__buttons}>
          <LinkRoute
            type="button"
            backgroundColor="purple-2"
            rounded
            className={classNames(styles.mainSlider__button)}
            text="Find out more"
            href={RoutePathsConstants.ABOUT_US}
          />
          <LinkRoute
            type="button"
            transparent
            rounded
            className={styles.mainSlider__button}
            text="Sign Up"
            href={RoutePathsConstants.SIGN_UP}
          />
        </div>
      </div>
    </div>
  );
}

export default MainSlider;
