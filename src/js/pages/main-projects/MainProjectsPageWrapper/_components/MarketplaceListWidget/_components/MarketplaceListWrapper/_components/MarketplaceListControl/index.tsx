import classNames from 'classnames';
import type { ConnectedProps } from 'react-redux';
import { connect } from 'react-redux';

import SecondaryTitle from '@/components/common/titles/SecondaryTitle';
import LinkRoute from '@/components/ui/links/LinkRoute';
import { MarketplaceLocationsConstants } from '@/constants/marketplace/location';
import { RoutePathsConstants } from '@/constants/routes/routes';
import TitlesConstants from '@/constants/titles/titlesConstants';
import {
  applyMarketplaceFilterAction,
  resetMarketplaceCurrentParamsAction,
  selectMarketplaceFilterAction,
} from '@/redux-actions/marketplace/marketplaceActions';

import styles from './styles.module.scss';

type PropsFromRedux = ConnectedProps<typeof connector>;

export type MarketplaceListControlProps = PropsFromRedux & {
  location: string;
};

const MarketplaceListControl = ({
  location,
  filterSelectAction,
  filterApplyAction,
  filterResetCurrentParamsAction,
}: MarketplaceListControlProps) => {
  const isInSale = location === MarketplaceLocationsConstants.NEW_RELEASES;

  return (
    <div className={classNames(styles.MarketplaceListControl)}>
      <SecondaryTitle
        title={isInSale ? TitlesConstants.NEW_RELEASES : TitlesConstants.COMING_SOON}
        className={classNames(styles.MarketplaceListControl__title)}
      />
      <div className={classNames(styles.MarketplaceListControl__control)}>
        <LinkRoute
          text="View All"
          href={{
            pathname: RoutePathsConstants.MARKETPLACE,
            query: { inSale: isInSale },
          }}
          onClick={() => {
            filterResetCurrentParamsAction({ location: MarketplaceLocationsConstants.MARKETPLACE });

            filterSelectAction({
              location: MarketplaceLocationsConstants.MARKETPLACE,
              beforeResetCategory: false,
              selected: [
                {
                  id: isInSale ? 1 : 2,
                  value: isInSale ? 1 : 2,
                  label: isInSale ? 'In sale' : 'Coming soon',
                  queryParam: isInSale ? 'true' : 'false',
                  disabled: false,
                },
              ],
              beforeResetCategoryNow: true,
              categoryId: 'MARKETPLACE_IN_SALE_STATUS',
              multi: false,
            });

            filterApplyAction(MarketplaceLocationsConstants.MARKETPLACE);
          }}
          type="button"
          size="small-25"
          borderColor="gray-4"
          className={styles.MarketplaceListControl__button}
        />
      </div>
    </div>
  );
};

const connector = connect(
  () => ({}),
  (dispatch) => ({
    filterSelectAction: (params: {
      location: any;
      categoryId: any;
      selected: any;
      multi: any;
      beforeResetCategory: any;
      beforeResetCategoryNow: any;
    }) => {
      dispatch(selectMarketplaceFilterAction(params));
    },
    filterApplyAction: (params: any) => {
      dispatch(applyMarketplaceFilterAction(params));
    },
    filterResetCurrentParamsAction: (params: any) => {
      dispatch(resetMarketplaceCurrentParamsAction(params));
    },
  })
);

export default connector(MarketplaceListControl);
