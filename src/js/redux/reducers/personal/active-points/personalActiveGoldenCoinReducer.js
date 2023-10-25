import { PointsTypesConstants } from '@/constants/points/type';

import createPersonalActivePointsReducer from './createPersonalActivePointsReducer';

const PersonalActiveGoldenCoinReducer = (state, action) =>
  createPersonalActivePointsReducer(state, action, PointsTypesConstants.GOLDEN_COIN);

export default PersonalActiveGoldenCoinReducer;
