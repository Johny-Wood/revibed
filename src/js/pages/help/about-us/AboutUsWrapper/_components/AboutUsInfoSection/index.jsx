import classNames from 'classnames';
import { connect } from 'react-redux';

import LinkRoute from '@/components/ui/links/LinkRoute';

import styles from './styles.module.scss';

function AboutUsInfoSection({ textClassName, title: Title, text: Text, href, linkText, isNotAuth, userIsAuthorized }) {
  return (
    <div className={styles.aboutUsInfoSection}>
      <h2 className={styles.aboutUsInfoSection__title}>
        <Title />
      </h2>
      <p className={classNames(styles.aboutUsInfoSection__text, textClassName)}>
        <Text />
      </p>
      <div className={styles.aboutUsInfoSection__control}>
        {(!isNotAuth || (isNotAuth && !userIsAuthorized)) && (
          <LinkRoute
            href={href}
            text={linkText}
            type="button"
            rounded
            className={classNames('primary', styles.aboutUsInfoSection__button)}
          />
        )}
      </div>
    </div>
  );
}

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
}))(AboutUsInfoSection);
