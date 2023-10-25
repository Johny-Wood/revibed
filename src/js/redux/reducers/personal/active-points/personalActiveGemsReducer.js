import { PointsTypesConstants } from '@/constants/points/type';

import createPersonalActivePointsReducer from './createPersonalActivePointsReducer';

const PersonalActiveGemsReducer = (state, action) => createPersonalActivePointsReducer(state, action, PointsTypesConstants.GEM);

export default PersonalActiveGemsReducer;
