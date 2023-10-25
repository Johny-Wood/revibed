import { Component, createRef } from 'react';

import { connect } from 'react-redux';

import ReleasesItems from '@/components/release/ReleaseWrapper/_components/ReleasesItems';
import { CommonScrollbarLocationsConstants } from '@/constants/common/scrollBar';
import { RoutePathsConstants } from '@/constants/routes/routes';
import ScrollBlockIdConstants from '@/constants/scroll/scrollBlockId';
import {
  clearWantListReleaseItemsAction,
  loadWantListReleaseItemsRequestAction,
} from '@/redux-actions/wantList/wantListReleaseItemActions';
import ScrollService from '@/services/scroll/ScrollService';

class ReleaseItemsWrapper extends Component {
  constructor(props) {
    super(props);

    this.releaseItemsRef = createRef();
  }

  componentDidMount() {
    const {
      withInitialLoadItems,
      onInitCallback,
      scrollLocation = CommonScrollbarLocationsConstants.MAIN_SCROLL,

      wantlistReleaseItemsPageSettings: { page: { size } = {} } = {},
    } = this.props;

    ScrollService.getInstance(scrollLocation).addSection(
      ScrollBlockIdConstants.WANTLIST_RELEASE_ITEMS,
      RoutePathsConstants.RELEASE,
      this.releaseItemsRef
    );

    if (withInitialLoadItems) {
      this.onLoadReleaseItems({
        size,
        init: true,
        onInitCallback,
      });
    }
  }

  componentWillUnmount() {
    const { clearReleaseItems } = this.props;

    clearReleaseItems();
  }

  scrollTopList = () => {
    const { scrollLocation = CommonScrollbarLocationsConstants.MAIN_SCROLL } = this.props;

    setTimeout(() => {
      ScrollService.getInstance(scrollLocation)
        .scrollToElement({
          sectionId: ScrollBlockIdConstants.WANTLIST_RELEASE_ITEMS,
          inRoute: true,
          secondOffset: scrollLocation === CommonScrollbarLocationsConstants.MAIN_SCROLL ? 80 : 150,
        })
        .then();
    }, 100);
  };

  onLoadReleaseItems = ({ size, page, init, onInitCallback = () => {} } = {}) => {
    const {
      releaseId,
      parseNow,
      type,

      loadWantListReleaseItemsInProcess,
      loadWantListReleaseItemsRequest,
    } = this.props;

    if (loadWantListReleaseItemsInProcess) {
      return;
    }

    loadWantListReleaseItemsRequest({
      size,
      page,
      wantlistReleaseItemId: releaseId,
      parseNow,
      type,
    })
      .then(() => {
        if (!init) {
          this.scrollTopList();
        }

        onInitCallback();
      })
      .catch(() => {
        onInitCallback();
      });
  };

  render() {
    const {
      withReleaseLink,
      withNotifications,
      withShortPagination,
      itemsPerPage,
      withTime,
      restartProjectId,
      loadReleaseItemsFromApi,
      onClickCreateProjectLink,
      onClickReleaseLink,

      loadWantListReleaseItemsInProcess,
      wantlistReleaseItems,
      wantlistReleaseItemsPageSettings,
      className,
      itemClassName,
      noResultClassName,
    } = this.props;

    return (
      <ReleasesItems
        ref={this.releaseItemsRef}
        items={wantlistReleaseItems}
        inProcess={loadWantListReleaseItemsInProcess}
        onLoad={this.onLoadReleaseItems}
        itemsPerPage={itemsPerPage}
        pageSettings={wantlistReleaseItemsPageSettings}
        withReleaseLink={withReleaseLink}
        withNotifications={withNotifications}
        withShortPagination={withShortPagination}
        withTime={withTime}
        restartProjectId={restartProjectId}
        loadReleaseItemsFromApi={loadReleaseItemsFromApi}
        onClickCreateProjectLink={onClickCreateProjectLink}
        onClickReleaseLink={onClickReleaseLink}
        className={className}
        itemClassName={itemClassName}
        noResultClassName={noResultClassName}
      />
    );
  }
}

export default connect(
  (state) => ({
    loadWantListReleaseItemsInProcess: state.WantListReleaseItemReducer.loadWantListReleaseItemsInProcess,
    wantlistReleaseItems: state.WantListReleaseItemReducer.wantlistReleaseItems,
    wantlistReleaseItemsPageSettings: state.WantListReleaseItemReducer.wantlistReleaseItemsPageSettings,
  }),
  (dispatch) => ({
    loadWantListReleaseItemsRequest: (params) => loadWantListReleaseItemsRequestAction(params)(dispatch),
    clearReleaseItems: () => {
      dispatch(clearWantListReleaseItemsAction());
    },
  })
)(ReleaseItemsWrapper);
