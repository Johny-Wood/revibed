import { connect } from 'react-redux';

import ArtistFund from '@/components/common/ArtistFund';
import { floatWithCommaFixedUtil } from '@/utils/textUtils';

function TotalArtistFund({ artistFund: { balance } = {}, getArtistFundFromApi, getArtistFundInProcess }) {
  return (
    <ArtistFund
      description="Total Artist Fund"
      value={floatWithCommaFixedUtil(balance)}
      inProcess={(getArtistFundInProcess && !getArtistFundFromApi) || !getArtistFundFromApi}
      shown={balance > 0}
    />
  );
}

export default connect((state) => ({
  artistFund: state.ArtistFundReducer.artistFund,
  getArtistFundFromApi: state.ArtistFundReducer.getArtistFundFromApi,
  getArtistFundInProcess: state.ArtistFundReducer.getArtistFundInProcess,
}))(TotalArtistFund);
