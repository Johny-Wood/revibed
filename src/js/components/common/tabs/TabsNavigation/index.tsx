import type { FunctionComponent } from 'react';

import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import NotificationSectionCount from '@/components/common/Notification/NotificationSectionCount';
import HorizontalScrollLayout from '@/components/layouts/HorizontalScrollLayout';
import Button from '@/components/ui/buttons/Button';
import type { IconProps } from '@/components/ui/links/LinkDefault';
import LinkRoute from '@/components/ui/links/LinkRoute';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import type { RootState } from '@/js/redux/reducers';

import styles from './styles.module.scss';

const renderTitleCount = (count: number | string | undefined) => {
  if (!count) {
    return null;
  }

  return <b className="m-left-5">{count}</b>;
};

type PropsFromRedux = ConnectedProps<typeof connector>;

export type TabConfig = {
  id: number;
  title?: string | number;
  keyMenu?: string | number;
  hide?: boolean;
  href?: string;
  hrefPath?: string;
  hrefKey?: string;
  tKey?: string;
  keyMenuNotification?: string;
  titleCount?: string | number;
  asPath?: string;
  withActive?: boolean;
  inheritanceActive?: boolean;
  onlyIcon?: boolean;
  containerProps?: Record<string, unknown>;
  asPathExclude?: string | { pathname: string; query?: unknown };

  icon?: FunctionComponent<IconProps>;
  container?: FunctionComponent;
  throughBlockChild?: FunctionComponent;

  shown?: (props?: PropsFromRedux & { isNotDesktop: boolean }) => void;
};

export type TabsNavigationExternalProps = {
  tabs: TabConfig[];
  type?: 'DEFAULT' | 'NAVIGATION';
  visibleType?: 'DEFAULT' | 'TAGS';
  tabsRightBlockProps?: Record<string, unknown>;
  withButtonBorder?: boolean;
  withActiveClass?: boolean;
  activeTabId: number;

  setActiveTab: (activeTabId: number) => void;

  tabsRightBlock?: FunctionComponent;

  className?: string;
  buttonClassName?: string;
  horizontalScrollLayoutClassName?: string;
  horizontalScrollLayoutContentClassName?: string;
};

type TabsNavigationProps = PropsFromRedux & TabsNavigationExternalProps;

function TabsNavigation({
  tabs = [],
  type = 'DEFAULT',
  visibleType = 'DEFAULT',
  withButtonBorder = true,
  activeTabId,
  setActiveTab,
  tabsRightBlock: TabsRightBlock,
  tabsRightBlockProps,
  withActiveClass,

  className,
  buttonClassName,
  horizontalScrollLayoutClassName,
  horizontalScrollLayoutContentClassName,

  variablesList,
  userInfo,
}: TabsNavigationProps) {
  const { isNotDesktop } = ViewportHook();
  const router = useRouter();

  return (
    <div
      className={classNames([
        styles.tabsContainer,
        styles[`tabsContainer_type_${visibleType}`],
        withButtonBorder && styles.tabsContainer_with_border,
        className,
      ])}
    >
      <div className={styles.tabsContainer__navigation}>
        <HorizontalScrollLayout
          className={classNames([styles.tabsContainer__horizontalScrollLayout, horizontalScrollLayoutClassName])}
          contentClassName={classNames(
            styles.tabsContainer__horizontalScrollLayout__content,
            horizontalScrollLayoutContentClassName
          )}
        >
          {tabs
            .filter(({ shown = () => true }) => shown({ isNotDesktop, ...userInfo, ...variablesList }))
            .map(
              ({
                id,
                title,
                hide,
                href,
                hrefKey = href,
                tKey,
                keyMenuNotification,
                titleCount,
                asPathExclude,
                asPath,
                withActive,
                inheritanceActive,
                icon: Icon,
                onlyIcon,
              }) => {
                if (hide) {
                  return '';
                }

                const key = `tab-${title || tKey}`;
                const classNameButton = classNames(
                  'tab-button',
                  activeTabId === id && type === 'DEFAULT' && 'active',
                  buttonClassName
                );

                if (type === 'DEFAULT') {
                  return (
                    // @ts-ignore
                    <Button
                      doubleText={visibleType !== 'TAGS'}
                      key={key}
                      className={classNameButton}
                      onClick={() => {
                        setActiveTab(id);
                      }}
                      type="button_string"
                      text={!onlyIcon ? title : undefined}
                      translateKey={!onlyIcon ? tKey : undefined}
                      icon={Icon}
                    >
                      <NotificationSectionCount
                        className={styles.tabNotificationCount}
                        keysMenuNotification={[keyMenuNotification]}
                      />
                      {renderTitleCount(titleCount)}
                    </Button>
                  );
                }

                if (href) {
                  return (
                    <LinkRoute
                      doubleText={visibleType !== 'TAGS'}
                      href={href}
                      key={key}
                      asPath={asPath}
                      withActive={withActive}
                      asPathExclude={asPathExclude}
                      inheritanceActive={inheritanceActive}
                      className={classNames([classNameButton, activeTabId === id && withActiveClass && 'active'])}
                      type="button_string"
                      text={!onlyIcon && title ? `${title}` : undefined}
                      translateKey={!onlyIcon ? tKey : undefined}
                      icon={Icon}
                      onClick={(e) => {
                        e.preventDefault();

                        router.replace(hrefKey ?? '', undefined, { shallow: true }).then();
                      }}
                    >
                      <NotificationSectionCount
                        className={styles.tabNotificationCount}
                        keysMenuNotification={[keyMenuNotification]}
                      />
                      {renderTitleCount(titleCount)}
                    </LinkRoute>
                  );
                }

                return null;
              }
            )}
        </HorizontalScrollLayout>
      </div>
      {!!TabsRightBlock && <TabsRightBlock {...tabsRightBlockProps} />}
    </div>
  );
}

const connector = connect((state: RootState) => ({
  variablesList: state.VariablesReducer.variablesList,
  userInfo: state.AuthReducer.userInfo,
}));

export default connector(TabsNavigation);
