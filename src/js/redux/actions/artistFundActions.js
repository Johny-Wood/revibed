import api from '@/api';
import { ArtistFundActionsConstants } from '@/constants/actions/artistFund';

import createAction from './actionCreator';

const getArtistFundInProcessAction = (getArtistFundInProcess) =>
  createAction(ArtistFundActionsConstants.LOAD_ARTIST_FUND_IN_PROCESS, {
    getArtistFundInProcess,
  });

const getArtistFundSuccessAction = ({ artistFund }) =>
  createAction(ArtistFundActionsConstants.LOAD_ARTIST_FUND_SUCCESS, {
    artistFund,
  });

export const getArtistFundRequestAction = ({ dispatch }) =>
  new Promise((resolve, reject) => {
    dispatch(getArtistFundInProcessAction(true));

    api
      .get('balance')
      .then(({ data: { data: artistFund } = {} }) => {
        dispatch(getArtistFundSuccessAction({ artistFund }));

        resolve();
      })
      .catch(() => {
        dispatch(getArtistFundInProcessAction(false));

        reject();
      });
  });
