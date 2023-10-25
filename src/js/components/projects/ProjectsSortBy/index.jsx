import { connect } from 'react-redux';

import SortBy from '@/components/common/SortBy';
import { setProjectsSortSelectedAction } from '@/redux-actions/projects/projectsActions';

function ProjectsSortBy({ className, location, sorting, sortSelected, sortSelectedAction, sortCallback }) {
  return (
    <SortBy
      location={location}
      sorting={sorting}
      sortSelected={sortSelected}
      sortSelectedAction={sortSelectedAction}
      sortCallback={sortCallback}
      defaultType={false}
      className={className}
    />
  );
}

export default connect(
  () => ({}),
  (dispatch) => ({
    sortSelectedAction: (location, categoryId, selected) => {
      dispatch(setProjectsSortSelectedAction(location, categoryId, selected));
    },
  })
)(ProjectsSortBy);
