import { useCallback } from 'react';

import classNames from 'classnames';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DropDownMenu from '@/components/common/DropDownMenu';
import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import Button from '@/components/ui/buttons/Button';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import ArrowIcon from '@/icons/arrows/ArrowIcon';

import styles from './styles.module.scss';

function Navigation({ links, location, className, dropDownMenuListClass, variablesList, userIsAuthorized }) {
  const { isNotDesktop } = ViewportHook();

  const { pathname } = useRouter();

  const DropDownButton = useCallback(
    ({ text, tKey, disabled, isActive, notAuthorized, shownDropDownMenu }) => (
      <Button
        type="link"
        className={classNames(notAuthorized && 'link_not_authorized')}
        text={text}
        translateKey={tKey}
        isActive={isActive}
        disabled={disabled}
      >
        <ArrowIcon isOpened={shownDropDownMenu} />
      </Button>
    ),
    []
  );

  return (
    <nav className={className}>
      {links
        .filter(({ shown = () => true }) => shown({ ...variablesList, userIsAuthorized }))
        .map((link) => {
          const {
            text,
            tKey,
            href,
            keyMenuNotification,
            notAuthorized,
            notNotAuthorized,
            disabled,
            items = [],
            inheritanceActive,
          } = link;

          if (userIsAuthorized && notAuthorized) {
            return null;
          }

          if (!userIsAuthorized && notNotAuthorized) {
            return null;
          }

          const key = `nav-item-${location}-${tKey}`;

          if (items.length > 0) {
            if (isNotDesktop) {
              return items.map(({ tKey: itemTKey, href: itemHref, disabled: itemDisabled }) => (
                <LinkRoute
                  key={`${itemTKey}-${key}`}
                  className={classNames(notAuthorized && 'link_not_authorized')}
                  translateKey={itemTKey}
                  href={itemHref}
                  disabled={itemDisabled}
                  inheritanceActive={inheritanceActive}
                />
              ));
            }

            return (
              <DropDownMenu
                key={key}
                list={items.map(({ tKey: itemTKey, href: itemHref }) => ({
                  id: itemTKey,
                  tKey: itemTKey,
                  link: { href: itemHref },
                }))}
                button={DropDownButton}
                buttonProps={{
                  text,
                  tKey,
                  disabled,
                  notAuthorized,
                  isActive: items.map(({ href: itemHref }) => itemHref).includes(pathname),
                }}
                dropDownMenuListClass={dropDownMenuListClass}
              />
            );
          }

          return (
            <LinkRoute
              key={key}
              className={notAuthorized && 'link_not_authorized'}
              text={text}
              translateKey={tKey}
              href={href}
              disabled={disabled}
            >
              <NotificationSectionCount className={styles.navigationNotifications} keysMenuNotification={[keyMenuNotification]} />
            </LinkRoute>
          );
        })}
    </nav>
  );
}

Navigation.defaultProps = {
  className: '',
};

Navigation.propTypes = {
  location: PropTypes.oneOf(['header', 'footer']).isRequired,
  links: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default connect((state) => ({
  userIsAuthorized: state.AuthReducer.userIsAuthorized,
  variablesList: state.VariablesReducer.variablesList,
}))(Navigation);
