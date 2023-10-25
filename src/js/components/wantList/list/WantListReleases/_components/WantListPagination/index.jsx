import { connect } from 'react-redux';

import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';

const ITEMS_OPTIONS = [
  {
    id: 25,
    value: 25,
    label: '25',
  },
  {
    id: 50,
    value: 50,
    label: '50',
  },
  {
    id: 100,
    value: 100,
    label: '100',
  },
  {
    id: 250,
    value: 250,
    label: '250',
  },
];

function WantListPagination({
  withPageSize = true,

  wantListPageSettings: { page: { totalElements, totalPages, currentNumber, size } = {} } = {},

  onLoadRequest,
  type,
}) {
  return (
    <PaginationFullWrapper
      currentPage={currentNumber}
      currentNumber={currentNumber}
      pageSize={size}
      totalPages={totalPages}
      totalElements={totalElements}
      location="WANT_LIST"
      itemsOption={ITEMS_OPTIONS}
      changePage={(page) => {
        onLoadRequest({
          page,
          size,
        });
      }}
      changeItemsPerPage={({ value: pageSize }) => {
        onLoadRequest({
          size: pageSize,
          page: 0,
        });
      }}
      withPageSize={withPageSize}
      type={type}
    />
  );
}
export default connect((state) => ({
  wantListPageSettings: state.WantListReducer.wantListPageSettings,
  currentPage: state.WantListReducer.currentPage,
}))(WantListPagination);
