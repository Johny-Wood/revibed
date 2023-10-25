import type { FunctionComponent, PropsWithChildren } from 'react';
import { useMemo, useState } from 'react';

import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isNumber from 'lodash/isNumber';
import { useRouter } from 'next/router';

import TabContent from '@/components/common/tabs/TabContent';
import type { TabsNavigationExternalProps } from '@/components/common/tabs/TabsNavigation';
import TabsNavigation from '@/components/common/tabs/TabsNavigation';

type TabsWrapperProps = Omit<TabsNavigationExternalProps, 'activeTabId' | 'setActiveTab'> & {
  withOffsetBottom?: boolean;
  tabsContainerProps?: Record<string, unknown>;
  activeTabDefault?: number;
  throughBlock?: FunctionComponent<PropsWithChildren>;

  contentClassName?: string;
};

function TabsWrapper({
  tabs = [],
  type = 'DEFAULT',
  visibleType = 'DEFAULT',
  withButtonBorder = true,
  activeTabDefault = -1,
  withOffsetBottom,
  tabsContainerProps,
  tabsRightBlock,
  throughBlock: ThroughBlock,
  className,
  contentClassName,
  horizontalScrollLayoutClassName,
  horizontalScrollLayoutContentClassName,
  withActiveClass,
}: TabsWrapperProps) {
  const router = useRouter();

  const { pathname, query: { tab = '' } = {} } = router || {};

  const [activeTabIdTrigger, setActiveTabIdTrigger] = useState<number>(-1);

  const route = useMemo(() => `${pathname}${tab ? `?tab=${tab}` : ''}`, [pathname, tab]);

  const canShowTabs = useMemo(() => cloneDeep(tabs.filter(({ hide }) => !hide)), [tabs]);

  const firstTabId = useMemo(() => {
    const { id } = canShowTabs[0] || {};

    return activeTabDefault >= 0 ? activeTabDefault : id;
  }, [activeTabDefault, canShowTabs]);

  const activeTabId = useMemo(() => {
    const { id: foundActiveTabId } =
      canShowTabs.find(({ href, hrefPath = href, hrefKey: foundHrefKey = hrefPath }) => route === foundHrefKey) ?? {};

    if (isNumber(foundActiveTabId) && foundActiveTabId >= 0 && type === 'NAVIGATION') {
      return foundActiveTabId;
    }

    if (activeTabIdTrigger >= 0 && canShowTabs.findIndex(({ id: searchId }) => searchId === activeTabIdTrigger) > -1) {
      return activeTabIdTrigger;
    }

    return firstTabId;
  }, [canShowTabs, type, activeTabIdTrigger, firstTabId, route]);

  const activeTab = useMemo(() => canShowTabs.find(({ id }) => id === activeTabId), [canShowTabs, activeTabId]);

  const { container: ActiveTabContent, throughBlockChild: ThroughBlockChild, containerProps = {} } = activeTab ?? {};

  return (
    <>
      <TabsNavigation
        type={type}
        visibleType={visibleType}
        className={classNames(className)}
        tabs={tabs}
        setActiveTab={setActiveTabIdTrigger}
        activeTabId={activeTabId}
        tabsRightBlock={tabsRightBlock}
        withButtonBorder={withButtonBorder}
        horizontalScrollLayoutClassName={horizontalScrollLayoutClassName}
        horizontalScrollLayoutContentClassName={horizontalScrollLayoutContentClassName}
        withActiveClass={withActiveClass}
      />
      {!!ThroughBlock && <ThroughBlock>{!!activeTab && !!ThroughBlockChild && <ThroughBlockChild />}</ThroughBlock>}
      <TabContent className={classNames(contentClassName)} withOffsetBottom={withOffsetBottom}>
        {!!ActiveTabContent && <ActiveTabContent {...tabsContainerProps} {...containerProps} />}
      </TabContent>
    </>
  );
}

export default TabsWrapper;
