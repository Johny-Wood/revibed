import { connect } from 'react-redux';

import ArtistFund from '@/components/common/ArtistFund';

function ProjectCardArtistFund({
  variablesList: { PROJECT_COPYRIGHT_HOLDER_FUND_PERCENTAGE = 0 } = {},
  showArtistFund,
  containsInArtistFund,
  artistFund,
  cutsCount = 0,
  priceBuy = 0,
}) {
  if (!showArtistFund) {
    return null;
  }

  return (
    <ArtistFund
      shown
      description="Pre-order Artist Fund"
      value={
        containsInArtistFund
          ? artistFund
          : priceBuy * (cutsCount / 100) * (PROJECT_COPYRIGHT_HOLDER_FUND_PERCENTAGE / 100) + artistFund
      }
    />
  );
}

export default connect((state) => ({
  variablesList: state.VariablesReducer.variablesList,
}))(ProjectCardArtistFund);
