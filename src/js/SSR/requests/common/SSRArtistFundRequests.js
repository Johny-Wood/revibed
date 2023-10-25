import { getArtistFundRequestAction } from '@/redux-actions/artistFundActions';

export const SSRArtistFund = async ({ req }, { dispatch, getState }) => {
  if (req) {
    await getArtistFundRequestAction({ dispatch }).then().catch();
  } else {
    const { ArtistFundReducer: { getArtistFundFromApi } = {} } = getState();

    if (!getArtistFundFromApi) {
      getArtistFundRequestAction({ dispatch }).then().catch();
    }
  }
};
