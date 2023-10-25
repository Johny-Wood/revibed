import { ArtistFundActionsConstants } from '@/constants/actions/artistFund';

import { createHandlers, createReducer } from './handler';

const initialState = {
  getArtistFundInProcess: false,
  getArtistFundFromApi: false,
  artistFund: {
    balance: 0,
  },
};

const handlers = createHandlers({
  [ArtistFundActionsConstants.LOAD_ARTIST_FUND_IN_PROCESS]: (state, { getArtistFundInProcess }) => ({
    ...state,
    getArtistFundInProcess,
  }),
  [ArtistFundActionsConstants.LOAD_ARTIST_FUND_SUCCESS]: (state, { artistFund }) => ({
    ...state,
    getArtistFundInProcess: false,
    getArtistFundFromApi: true,
    artistFund,
  }),
});

const ArtistFundReducer = (state = initialState, action) => createReducer(state, action, handlers);

export default ArtistFundReducer;
