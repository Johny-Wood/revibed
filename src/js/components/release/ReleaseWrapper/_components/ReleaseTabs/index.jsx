import { useMemo } from 'react';

import { connect } from 'react-redux';

import TabsWrapper from '@/components/common/tabs/TabsWrapper';
import ReleaseAvailable from '@/components/release/ReleaseWrapper/_components/ReleaseAvailable';
import ReleaseListedLast from '@/components/release/ReleaseWrapper/_components/ReleaseListedLast';
import TabsRightBlock from '@/components/release/ReleaseWrapper/_components/ReleaseTabs/_components/TabsRightBlock';

import styles from './styles.module.scss';

const RELEASE_TABS = ({ lifeTime, watchedInSystemWantlist, isAdded, active }) => [
  {
    id: 1,
    title: `Listed last ${lifeTime}h`,
    keyMenu: 'LISTED_LAST',
    container: ReleaseListedLast,
    hide: !((isAdded && active) || watchedInSystemWantlist),
  },
  {
    id: 2,
    title: 'Available on Discogs now',
    keyMenu: 'AVAILABLE_NOW',
    container: ReleaseAvailable,
  },
];

function ReleaseTabs({
  releaseId,
  parseNow,
  isAdded,
  active,
  watchedInSystemWantlist,

  variablesList: { PARSED_ITEMS_LIFE_TIME } = {},
  wantlistReleaseItemsPageSettings: { page: { totalElements = 0 } = {} } = {},
}) {
  return (
    <TabsWrapper
      className={styles.releaseTabs}
      withButtonBorder={false}
      tabsContainerProps={useMemo(
        () => ({
          releaseId,
          parseNow,
        }),
        [parseNow, releaseId]
      )}
      tabs={useMemo(
        () =>
          RELEASE_TABS({
            lifeTime: PARSED_ITEMS_LIFE_TIME,
            isAdded,
            watchedInSystemWantlist,
            active,
          }),
        [PARSED_ITEMS_LIFE_TIME, active, isAdded, watchedInSystemWantlist]
      )}
      tabsRightBlock={useMemo(() => TabsRightBlock, [])}
      tabsRightBlockProps={useMemo(
        () => ({
          totalElements,
        }),
        [totalElements]
      )}
    />
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
  wantlistReleaseItemsPageSettings: state.WantListReleaseItemReducer.wantlistReleaseItemsPageSettings,
}))(ReleaseTabs);
