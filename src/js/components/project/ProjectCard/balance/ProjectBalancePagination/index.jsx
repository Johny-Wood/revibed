import { connect } from 'react-redux';

import PaginationFullWrapper from '@/components/pagination/PaginationFullWrapper';

function ProjectBalancePagination({
  withPageSize = true,
  withPagination = true,
  withPageSizeMobile,

  projectBalancePageSettings: { page: { totalElements, totalPages, currentNumber, size } = {} } = {},

  onLoadRequest,
  type,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationFullWrapper
      currentPage={currentNumber}
      currentNumber={currentNumber}
      pageSize={size}
      totalPages={totalPages}
      totalElements={totalElements}
      location="PROJECT_BALANCE"
      changePage={(page) => {
        onLoadRequest({
          page,
          size,
        });
      }}
      changeItemsPerPage={({ value: pageSize }) => {
        onLoadRequest({
          size: pageSize,
        });
      }}
      withPageSize={withPageSize}
      withPageSizeMobile={withPageSizeMobile}
      withPagination={withPagination}
      type={type}
    />
  );
}

export default connect((state) => ({
  projectBalancePageSettings: state.ProjectBalanceReducer.projectBalancePageSettings,
}))(ProjectBalancePagination);
