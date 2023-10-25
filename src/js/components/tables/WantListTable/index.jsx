import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import { connect } from 'react-redux';

import Cover from '@/components/common/Cover';
import Names from '@/components/common/Names';
import TruncatedText from '@/components/common/TruncatedText';
import EventMarker from '@/components/events/EventMarker';
import TransitionLayout from '@/components/layouts/TransitionLayouts/TransitionLayout';
import ProjectCountry from '@/components/projects/Project/_components/ProjectCountry';
import ProjectDiscogsLink from '@/components/projects/Project/_components/ProjectDiscogsLink';
import ProjectFormats from '@/components/projects/Project/_components/ProjectFormats';
import ProjectGenres from '@/components/projects/Project/_components/ProjectGenres';
import ProjectRatio from '@/components/projects/Project/_components/ProjectRatio';
import ProjectStyles from '@/components/projects/Project/_components/ProjectStyles';
import CheckBox from '@/components/ui/inputs/CheckBox';
import Preloader from '@/components/ui/Preloader';
import Table from '@/components/ui/Table';
import ToolTip from '@/components/ui/ToolTip';
import WantListToggleWatch from '@/components/wantList/list/controls/WantListToggleWatch';
import ComponentsCommonConstants from '@/constants/components/common';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import ViewportHook from '@/hooks/viewport/ViewportHook';
import { loadWantListRequestAction, selectWantListItemAction } from '@/redux-actions/wantList/wantListActions';
import { parseReplaceTextUtil, textForLotsOfUtil } from '@/utils/textUtils';

import styles from './styles.module.scss';

const onSelectItem = ({ itemId, selectWantListItem, list } = {}) => {
  const itemsNew = cloneDeep(list);
  const selectedItem = itemsNew.find(({ releaseInfo: { id: releaseId } = {} }) => releaseId === itemId) || {};

  selectWantListItem({ wantListRelease: selectedItem });
};

const renderWatchField = ({ unreadable, active, releaseItemId, itemsCount, releaseWatched, inProcess }) => {
  if (!releaseWatched) {
    return (
      <div className="f_direction_column f-y-end">
        <span className="o-25">not watched</span>
        <ToolTip
          text="This release does not qualify as rare and is not suitable for tracking"
          width={235}
          position="top-right"
          className="not-watched-tooltip"
          withCloseButton={false}
        />
      </div>
    );
  }

  if (!active || (active && !itemsCount && itemsCount === undefined && !inProcess)) {
    return (
      <WantListToggleWatch
        buttonAddWatchClassName={styles.buttonAddWatch}
        buttonDeleteWatchClassName={styles.buttonDeleteWatch}
        active={active}
        itemsCount={itemsCount}
        releaseItemId={releaseItemId}
      />
    );
  }

  if (inProcess) {
    return (
      <TransitionLayout isShown={inProcess}>
        <Preloader type="element" withOffsets={false} isShown={inProcess} size={ComponentsCommonConstants.Size.SMALL} />
      </TransitionLayout>
    );
  }

  if (itemsCount > 0) {
    return (
      <span className="f-y-center">
        <EventMarker shown={unreadable} />
        <b>{itemsCount}</b>
        &nbsp;
        {textForLotsOfUtil(itemsCount, ['item', 'items'])}
      </span>
    );
  }

  return 'no items';
};

const isCheckedItem = ({ itemId, selectedWantListItems } = {}) =>
  selectedWantListItems.findIndex(({ releaseInfo: { id } = {} }) => id === itemId) !== -1;

const itemMapper = (
  {
    id: releaseItemId,
    unreadable,
    releaseWatched,
    inProcess,
    active,
    itemsCount,
    releaseInfo: {
      id,
      releaseInfoLoaded,
      discogsLink,
      covers = [],
      artists = [],
      genres = [],
      styles: releaseStyles = [],
      formats = [],
      album: albumTitle,
      country,
      year,
      ratio,
      have,
      want,
    } = {},
  },
  { selectedWantListItems, selectWantListItem, list }
) => [
  {
    key: `${id}-1`,
    component: (
      <div className="w-100pct f_direction_column f-x-center">
        <CheckBox
          id={`${id}-${ratio}`}
          borderRadius
          dark
          checked={isCheckedItem({ itemId: id, selectedWantListItems })}
          onChange={() => {
            onSelectItem({ itemId: id, selectWantListItem, list });
          }}
        />
        <ProjectDiscogsLink
          className={classNames(styles.discogsLink, 'm-top-10')}
          link={discogsLink}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </div>
    ),
  },
  {
    key: `${id}-2`,
    component: (
      <>
        <Cover
          covers={covers}
          isNoCover={releaseInfoLoaded && covers.length <= 0}
          inProcess={!releaseInfoLoaded && covers.length <= 0}
          withImageLiteBox={false}
          isDefault={false}
          href={parseReplaceTextUtil(RoutePathsConstants.RELEASE, id)}
          className={styles.projectCover}
          containerClassName={styles.projectCoverContainer}
          size={50}
        />
        <Names
          projectId={id}
          artists={artists}
          albumTitle={albumTitle}
          isRoute
          href={parseReplaceTextUtil(RoutePathsConstants.RELEASE, id)}
          className={styles.projectNames}
          titleClassName={styles.projectNames__title}
          albumClassName={styles.projectNames__album__title}
        />
      </>
    ),
  },
  {
    key: `${id}-3`,
    component: genres.length > 0 ? <TruncatedText text={ProjectGenres({ items: genres })} sliceLength={20} /> : '-',
  },
  {
    key: `${id}-4`,
    component: releaseStyles.length > 0 ? <TruncatedText text={ProjectStyles({ items: releaseStyles })} sliceLength={20} /> : '-',
  },
  {
    key: `${id}-5`,
    component: country ? <ProjectCountry country={country} sliceLength={8} /> : '---',
  },
  {
    key: `${id}-6`,
    component: <span>{year || '-'}</span>,
  },
  {
    key: `${id}-7`,
    component: formats.length > 0 ? <TruncatedText text={ProjectFormats({ items: formats })} sliceLength={16} /> : '-',
  },
  {
    key: `${id}-8`,
    component: (
      <ProjectRatio
        className={styles.projectRatio}
        valueClassName={styles.projectRatio__value}
        infoClassName={styles.projectRatio__info}
        withDescription={false}
        want={want}
        have={have}
        ratio={ratio}
      />
    ),
  },
  {
    key: `${id}-9`,
    component: renderWatchField({
      unreadable,
      active,
      itemsCount,
      releaseItemId,
      releaseWatched,
      inProcess,
    }),
  },
];

function WantListTable({
  list = [],
  selectedWantListItems,
  wantListSortAndFilter: { sort: wantListSort = [] } = {},
  wantListPageSettings: { page: { totalElements, totalPages, size, currentNumber = 0 } = {} } = {},

  orders = {},
  onSort,

  selectWantListItem,
  loadWantListInProcess,
  loadWantListRequest,
}) {
  const { isNotDesktop } = ViewportHook();

  const isSelectedAll = isEqual(list.sort(), selectedWantListItems.sort()) && list.length > 0 && selectedWantListItems.length > 0;
  const wantListSortTmp = cloneDeep(wantListSort);

  const WANT_LIST_RELEASE_RATIO = wantListSortTmp.find(({ name }) => name === 'WANT_LIST_RELEASE_RATIO') || {};

  const { items: wantListReleaseRatioSortItems = [] } = WANT_LIST_RELEASE_RATIO;

  const WANT_LIST_LAST_ITEM_DATE = wantListSortTmp.find(({ name }) => name === 'WANT_LIST_LAST_ITEM_DATE') || {};

  const { items: wantListLastItemDateSortItems = [] } = WANT_LIST_LAST_ITEM_DATE;

  return (
    <Table
      name={styles.wantListTable}
      items={list.map((item) => itemMapper(item, { selectedWantListItems, selectWantListItem, list }))}
      headerColumns={[
        {
          key: 0,
          name: 'select',
          align: 'center',
          width: 20,
          type: 'CHECKBOX',
          checked: isSelectedAll,
          onClick: () => {
            selectWantListItem({
              wantListRelease: list,
              isRemove: isSelectedAll,
            });
          },
          hideOnMobile: true,
        },
        {
          key: 1,
          name: 'Artist - Title',
          align: 'start',
          width: 210,
          grow: 1,
        },
        {
          key: 2,
          keyItem: 'projectTitle',
          name: 'Genres',
          align: 'start',
          width: 95,
          hideOnMobile: true,
        },
        {
          key: 3,
          name: 'Styles',
          align: 'start',
          width: 95,
          hideOnMobile: true,
        },
        {
          key: 4,
          name: 'Country',
          align: 'start',
          width: 75,
          hideOnMobile: true,
        },
        {
          key: 5,
          name: 'Year',
          align: 'start',
          width: 45,
          hideOnMobile: true,
        },
        {
          key: 6,
          name: 'Format',
          align: 'start',
          width: 95,
          // hideOnMobile: true,
        },
        {
          key: 7,
          name: 'Ratio',
          align: 'start',
          width: 70,
          type: 'SORT',
          keyItem: 'WANT_LIST_RELEASE_RATIO',
          items: wantListReleaseRatioSortItems,
          order: orders?.WANT_LIST_RELEASE_RATIO,
          onClick: onSort,
        },
        {
          key: 8,
          name: 'Listed 24h',
          align: 'end',
          width: 90,
          type: 'SORT',
          keyItem: 'WANT_LIST_LAST_ITEM_DATE',
          items: wantListLastItemDateSortItems,
          order: orders?.WANT_LIST_LAST_ITEM_DATE,
          onClick: onSort,
        },
      ]}
      ids={list.map(({ releaseInfo: { id: itemId } = {} }) => itemId)}
      rowSettings={{
        'un-active': {
          enable: list.map(({ active }) => !active),
          className: styles.unActive,
        },
        'un-watched': {
          enable: list.map(({ releaseWatched }) => !releaseWatched),
          className: styles.unWatched,
        },
      }}
      scrollId={ScrollBlockIdConstants.WANTLIST_RELEASES}
      route={RoutePathsConstants.WANTLIST}
      inProcess={loadWantListInProcess}
      withFieldName={isNotDesktop}
      withPaginationControl
      pagination={{
        size,
        currentNumber,
        totalElements,
        totalPages,
        location: 'WANT_LIST',
        withPageSizeMobile: !isNotDesktop,
        withPagination: true,
        onLoadRequest: loadWantListRequest,
      }}
      headerClassName={styles.tableHeader}
      headerElementClassName={styles.tableHeader__element}
      bodyTextClassName={styles.tableBody__text}
      itemClassName={styles.table__item}
      itemElementClassName={styles.table__itemElement}
    />
  );
}

export default connect(
  (state) => ({
    selectedWantListItems: state.WantListReducer.selectedWantListItems,
    wantListPageSettings: state.WantListReducer.wantListPageSettings,
    loadWantListInProcess: state.WantListReducer.loadWantListInProcess,
    wantListSortAndFilter: state.WantListReleasesSortAndFiltersReducer.sortAndFilters,
  }),
  (dispatch) => ({
    selectWantListItem: (params) => {
      dispatch(selectWantListItemAction(params));
    },
    loadWantListRequest: (params) => loadWantListRequestAction(params)(dispatch),
  })
)(WantListTable);
