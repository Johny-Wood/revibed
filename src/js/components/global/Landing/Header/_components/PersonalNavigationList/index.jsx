import { Fragment } from 'react';

import classNames from 'classnames';
import { connect } from 'react-redux';

import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import LinkRoute from '@/components/ui/links/LinkRoute';
import TranslateHook from '@/hooks/translate/TranslateHook';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { signOutRequestAction } from '@/redux-actions/auth/authActions';

import styles from './styles.module.scss';

const renderAction = (action, signOut) => {
  switch (action) {
    case 'signOut': {
      signOut();
      break;
    }
    default: {
      break;
    }
  }
};

const getGroup = ({ links, userInfo, isNotDesktop, variablesList }) =>
  links.filter(({ shown = () => true }) => shown({ isNotDesktop, ...userInfo, ...variablesList })) || [];

const renderControlList = (
  signOut,
  t,
  { userInfo, id, navigationList = [], withNotifications = true, variablesList, isNotDesktop, groupClassName, itemClassName }
) =>
  getGroup({ links: navigationList, variablesList, isNotDesktop, userInfo }).map((item, idx) => {
    const {
      tKey,
      keyMenuNotification,
      icon: Icon,
      group,
      action,
      type,
      disabled,
      href,
      asPath: asPathLink,
      asPathExclude: asPathExcludeLink,
      links = [],
    } = item;

    const genericKey = (menuKey) => `menu-item-link-${menuKey}-${id}-${idx}`;
    const genericKeyGroup = (menuGroup) => `menu-item-group-link-${menuGroup}-${id}-${idx}`;

    const renderMenuGroup = () =>
      getGroup({ links, variablesList, userInfo, isNotDesktop }).map(
        ({
          keyMenuNotification: keyMenuNotificationLink,
          tKey: tKeyLink,
          href: hrefLink,
          disabled: disabledLink,
          asPath,
          inheritanceActive,
        }) => {
          const key = `personal-navigation-in_${group}_${tKeyLink}`;

          return (
            <div className={classNames(styles.personalNavigation__item)} key={key}>
              <LinkRoute
                translateKey={tKeyLink}
                href={hrefLink}
                disabled={disabledLink}
                className={classNames(styles.personalNavigation__link, 't-bold')}
                asPath={asPath}
                inheritanceActive={inheritanceActive}
              />
              <NotificationSectionCount keysMenuNotification={[keyMenuNotificationLink]} withNotifications={withNotifications} />
            </div>
          );
        }
      );

    const renderMenuItem = () => (
      <>
        <span className="name-item">
          <span className="name">{t(tKey)}</span>
          <NotificationSectionCount keysMenuNotification={[keyMenuNotification]} withNotifications={withNotifications} />
        </span>
        {Icon && <Icon color="black" />}
      </>
    );

    const renderMenu = () => {
      if (type !== 'button') {
        return (
          <LinkRoute
            href={href}
            asPath={asPathLink}
            asPathExclude={asPathExcludeLink}
            className={classNames(itemClassName)}
            disabled={disabled}
          >
            {renderMenuItem()}
          </LinkRoute>
        );
      }

      return (
        <div className={classNames(itemClassName)} onClick={() => renderAction(action, signOut)}>
          {renderMenuItem()}
        </div>
      );
    };

    return links.length > 0 ? (
      getGroup({ links, variablesList, userInfo }).length > 0 && (
        <div key={genericKeyGroup(group)} className={classNames(styles.personalNavigation__group, groupClassName)}>
          {renderMenuGroup()}
        </div>
      )
    ) : (
      <Fragment key={genericKey(tKey)}>{renderMenu()}</Fragment>
    );
  });

function PersonalNavigationList({
  groupClassName,
  itemClassName,
  navigationList,
  signOut,
  userInfo,
  withNotifications,
  variablesList,
  id,
}) {
  const t = TranslateHook();

  const { isNotDesktop } = ViewportHook();

  return (
    <>
      {renderControlList(signOut, t, {
        navigationList,
        variablesList,
        userInfo,
        withNotifications,
        id,
        isNotDesktop,
        groupClassName,
        itemClassName,
      })}
    </>
  );
}

export default connect(
  (state) => ({
    variablesList: state.VariablesReducer.variablesList,
    userInfo: state.AuthReducer.userInfo,
  }),
  (dispatch) => ({
    signOut: (params = {}) => signOutRequestAction(params)(dispatch),
  })
)(PersonalNavigationList);
