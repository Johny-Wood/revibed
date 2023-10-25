import { forwardRef } from 'react';

import classNames from 'classnames';

import globalStyles from '@/assets/styles/global-classes.module.scss';
import NoResults from '@/components/common/NoResults';
import { DesktopLayout } from '@/components/layouts/ViewportLayouts';
import ReleaseItemsPagination from '@/components/release/ReleaseWrapper/_components/ReleaseItemsPagination';
import ReleaseItem from '@/components/release/ReleaseWrapper/_components/ReleasesItems/_components/ReleaseItem';
import Preloader from '@/components/ui/Preloader';
import ComponentsCommonConstants from '@/constants/components/common';
import { ReleaseLocationConstants } from '@/constants/release';

import styles from './styles.module.scss';

const ITEMS_PER_PAGE_OPTIONS = [
  {
    id: 15,
    value: 15,
    label: '15',
  },
  {
    id: 25,
    value: 25,
    label: '25',
  },
  {
    id: 50,
    value: 50,
    label: '50',
  },
];

const ReleasesItems = forwardRef(
  (
    {
      location = ReleaseLocationConstants.RELEASE,
      items,
      inProcess,
      pageSettings,
      itemsPerPage = ITEMS_PER_PAGE_OPTIONS,
      withNotifications,
      withReleaseLink,
      withTime,
      restartProjectId,
      withShortPagination = true,
      loadReleaseItemsFromApi = true,
      onLoad = () => {},
      onClickCreateProjectLink,
      onClickReleaseLink,
      videoShown,
      withPlayVideo,
      className,
      itemClassName,
      noResultClassName,
    },
    ref
  ) => (
    <div ref={ref} className={classNames(styles.wantListReleasesItems, className)}>
      {withShortPagination && (
        <DesktopLayout>
          <ReleaseItemsPagination onLoadRequest={onLoad} pageSettings={pageSettings} withPageSize={false} type="short" />
        </DesktopLayout>
      )}
      <div className={globalStyles.relative}>
        <Preloader
          id="release-items"
          isShown={inProcess}
          opacity={items.length > 0 ? 0.8 : 1}
          type="container"
          size={ComponentsCommonConstants.Size.SMALL}
        />
        <div className={styles.wantListReleasesItems__container}>
          {items.length <= 0 && !inProcess && loadReleaseItemsFromApi && <NoResults className={noResultClassName} />}
          {items.map((wantListReleasesItem) => {
            const { id } = wantListReleasesItem;

            return (
              <ReleaseItem
                key={`wantList-releases-item-${id}`}
                item={{
                  key: `wantList-releases-item-${id}`,
                  className: itemClassName,
                  ...wantListReleasesItem,
                  withReleaseLink,
                  withNotifications,
                  withTime,
                  restartProjectId,
                  onClickCreateProjectLink,
                  onClickReleaseLink,
                  videoShown,
                  withPlayVideo,
                  location,
                }}
              />
            );
          })}
        </div>
      </div>
      <ReleaseItemsPagination onLoadRequest={onLoad} pageSettings={pageSettings} itemsPerPage={itemsPerPage} />
    </div>
  )
);

ReleasesItems.displayName = 'ReleasesItems';

export default ReleasesItems;
