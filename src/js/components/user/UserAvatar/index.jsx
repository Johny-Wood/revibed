import classNames from 'classnames';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LinkRoute from '@/components/ui/links/LinkRoute';
import { RoutePathsConstants } from '@/constants/routes/routes';
import CoinIcon from '@/icons/CoinIcon';
import GemIcon from '@/icons/GemIcon';
import GoldenCoinIcon from '@/icons/GoldenCoinIcon';
import KollektivXIcon from '@/icons/site-logo/KollektivXIcon';
import User2Icon from '@/icons/users/User2Icon';
import UserAvatarIcon from '@/icons/users/UserAvatarIcon';

import styles from './styles.module.scss';

const renderAvatarWrapper = ({ stylesRender, wrapperClassName, children }) => (
  <span style={stylesRender} className={wrapperClassName}>
    {children}
  </span>
);

const renderAvatarType = ({ isRoute, userId, userIsAuthorized, myId, content, onClick }) => {
  if (isRoute && userId >= 0 && !(userIsAuthorized && userId === myId)) {
    return (
      <LinkRoute
        ariaLabel="user"
        href={RoutePathsConstants.USER_PROJECTS.replace(/%X/, userId)}
        withActive={false}
        onClick={onClick}
      >
        {content()}
      </LinkRoute>
    );
  }

  return content();
};

const renderAvatar = ({
  kollektivxAvatar,
  isSystemCoin,
  isSystemGoldenCoin,
  isSystemGem,
  stylesRender,
  size,
  userData: { avatar } = {},
  src = avatar,
  deleted,
  rounded,
  className,
  backgroundColor,
  iconSize,
  iconColor,
  withBorder,
  localSrc,
}) => {
  const isDefaultUser = !src && !isSystemCoin && !isSystemGem && !isSystemGoldenCoin && !kollektivxAvatar;

  const wrapperClassName = classNames([
    styles.userAvatar,
    rounded && styles.userAvatar_rounded,
    size === 30 && styles.userAvatar_size_30,
    size === 50 && styles.userAvatar_size_50,
    size === 'stretch' && styles.userAvatar_size_stretch,
    backgroundColor === 'purple' && !isDefaultUser && styles.userAvatar_bg_purple,
    backgroundColor === 'black' && !isDefaultUser && styles.userAvatar_bg_black,
    backgroundColor === 'white' && !isDefaultUser && styles.userAvatar_bg_white,
    backgroundColor && isDefaultUser && styles.userAvatar_bg_transparent,
    (isSystemGem || isSystemGoldenCoin || isSystemCoin || kollektivxAvatar || withBorder) && styles.userAvatar_border,
    className,
  ]);

  const renderAvatarDefaults = () => !src && (!deleted ? <UserAvatarIcon size={size} /> : <User2Icon size={size} />);

  if (isSystemCoin) {
    return renderAvatarWrapper({
      stylesRender,
      wrapperClassName,
      children: <CoinIcon size={iconSize} offset={false} colorUrl={iconColor} />,
    });
  }

  if (isSystemGoldenCoin) {
    return renderAvatarWrapper({
      stylesRender,
      wrapperClassName,
      children: <GoldenCoinIcon size={iconSize} colorUrl={iconColor} />,
    });
  }

  if (isSystemGem) {
    return renderAvatarWrapper({
      stylesRender,
      wrapperClassName,
      children: <GemIcon size={iconSize} colorUrl={iconColor} />,
    });
  }

  if (kollektivxAvatar) {
    return renderAvatarWrapper({
      stylesRender,
      wrapperClassName,
      children: <KollektivXIcon size={size * 0.8} />,
    });
  }

  if (localSrc) {
    return (
      <span className={wrapperClassName} style={{ ...stylesRender }}>
        <Image src={localSrc.src} blurDataURL={localSrc.blurDataURL} placeholder="blur" width={size} height={size} alt="avatar" />
      </span>
    );
  }

  if (src) {
    return (
      <span className={wrapperClassName} style={{ ...stylesRender }}>
        <picture>
          <source srcSet={src} />
          <img src={src} alt="user-avatar" loading="lazy" />
        </picture>
      </span>
    );
  }

  return (
    <span style={stylesRender} className={wrapperClassName}>
      {renderAvatarDefaults()}
    </span>
  );
};

function UserAvatar({ size, userId, isRoute, userIsAuthorized, userData, userInfo: { id: myId } = {}, onClick, ...restProps }) {
  const stylesRender = {
    width: size,
    minWidth: size,
    minHeight: size,
    height: size,
  };

  return renderAvatarType({
    isRoute,
    userId,
    userIsAuthorized,
    myId,
    onClick,
    content: () =>
      renderAvatar({
        stylesRender,
        size,
        userData,
        ...restProps,
      }),
  });
}

UserAvatar.defaultProps = {
  size: 30,
  iconSize: 20,
  rounded: true,
  kollektivxAvatar: false,
  isSystemCoin: false,
  isSystemGoldenCoin: false,
  isSystemGem: false,
  userId: null,
  isRoute: false,
  withBorder: false,
  className: '',
  localSrc: undefined,
  iconColor: undefined,
  backgroundColor: 'white',
};

UserAvatar.propTypes = {
  size: PropTypes.number,
  iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rounded: PropTypes.bool,
  kollektivxAvatar: PropTypes.bool,
  isSystemCoin: PropTypes.bool,
  isSystemGoldenCoin: PropTypes.bool,
  isSystemGem: PropTypes.bool,
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isRoute: PropTypes.bool,
  withBorder: PropTypes.bool,
  className: PropTypes.string,
  iconColor: PropTypes.string,
  localSrc: PropTypes.object,
  backgroundColor: PropTypes.oneOf(['white', 'purple', 'black', 'transparent']),
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  userInfo: state.AuthReducer.userInfo,
}))(UserAvatar);
