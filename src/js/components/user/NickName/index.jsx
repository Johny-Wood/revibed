import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LinkRoute from '@/components/ui/links/LinkRoute';
import UserFlag from '@/components/user/UserFlag';
import { RoutePathsConstants } from '@/constants/routes/routes';

import styles from './styles.module.scss';

const renderName = ({ withDescription, name }) => (
  <>
    {withDescription && <>by&nbsp;</>}
    {name}
  </>
);

function NickName({
  className,
  classNameNickName,
  flagClassName,
  name,
  userId,
  fontWeight,
  withFlag,
  country,
  withDescriptionRole,
  role,
  withDescription,
  alias,
  isRoute,
  userData: {
    name: nameEnd = name,
    id: userIdEnd = userId,
    country: { title_en: countryEnd = country, alias: aliasEnd = alias } = {},
  } = {},

  userIsAuthorized,
  userInfo: { id: myId } = {},
  onClick = () => {},
}) {
  return (
    <span className={classNames([styles.nickname, className, `t-${fontWeight}`])}>
      {isRoute && userIdEnd >= 0 && !(userIsAuthorized && userIdEnd === myId) ? (
        <LinkRoute
          className={classNames([styles.nickname__name, styles.nickname_link, classNameNickName])}
          href={RoutePathsConstants.USER_PROJECTS.replace(/%X/, userIdEnd)}
          title={nameEnd}
          withActive={false}
          onClick={onClick}
        >
          {renderName({ name: nameEnd, withDescription })}
        </LinkRoute>
      ) : (
        <span className={classNames([styles.nickname__name, classNameNickName])}>
          {renderName({ name: nameEnd, withDescription })}
        </span>
      )}
      {withFlag && aliasEnd && (
        <UserFlag country={countryEnd} alias={aliasEnd} className={classNames(styles.nickname__flag, flagClassName)} />
      )}
      {!!withDescriptionRole && !!role && <span className={styles.nickname__role}>{role}</span>}
    </span>
  );
}

NickName.defaultProps = {
  name: '',
  userId: null,
  fontWeight: 'medium',
  country: '',
  withFlag: true,
  withDescriptionRole: false,
  role: '',
  isRoute: false,
};

NickName.propTypes = {
  fontWeight: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  role: PropTypes.string,
  withFlag: PropTypes.bool,
  withDescriptionRole: PropTypes.bool,
  country: PropTypes.string,
  name: PropTypes.string,
  isRoute: PropTypes.bool,
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  userInfo: state.AuthReducer.userInfo,
}))(NickName);
