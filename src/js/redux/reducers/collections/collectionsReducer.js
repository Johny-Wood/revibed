import createCollectionsReducer from '@/js/redux/reducers/collections/createCollectionsReducer';

const CollectionsListReducer = (state, action) => createCollectionsReducer(state, action);

export default CollectionsListReducer;
